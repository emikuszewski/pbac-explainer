let accessMode = 'allow'; // Track current mode

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

function toggleCondition(toggle) {
    toggle.classList.toggle('active');
    updateAccessDecision();
}

function setAccessType(type) {
    accessMode = type;
    const allowBtn = document.getElementById('allowBtn');
    const restrictBtn = document.getElementById('restrictBtn');
    const policyInput = document.getElementById('policyInput');
    
    if (type === 'allow') {
        allowBtn.classList.add('active');
        restrictBtn.classList.remove('active');
        policyInput.value = "Bank employees can view customer data";
    } else {
        allowBtn.classList.remove('active');
        restrictBtn.classList.add('active');
        policyInput.value = "Restrict bank employees from viewing customer data";
    }
    
    updateAccessDecision();
}

function updateAccessDecision() {
    const conditions = document.querySelectorAll('.condition-item');
    const activeConditions = document.querySelectorAll('.toggle.active').length;
    const indicator = document.getElementById('accessIndicator');
    const message = document.getElementById('accessMessage');
    const reason = document.getElementById('accessReason');
    const policyDesc = document.getElementById('policyDescription');
    
    // Get specific condition states
    const businessHours = conditions[0].querySelector('.toggle').classList.contains('active');
    const validAuth = conditions[1].querySelector('.toggle').classList.contains('active');
    const consent = conditions[2].querySelector('.toggle').classList.contains('active');
    const ownBranch = conditions[3].querySelector('.toggle').classList.contains('active');
    const compliance = conditions[4].querySelector('.toggle').classList.contains('active');
    
    let granted = false;
    let reasonText = '';
    
    if (accessMode === 'allow') {
        // Allow mode: need critical conditions to grant access
        policyDesc.textContent = 'Allow bank employees to view customer data when security conditions are met';
        
        if (validAuth && businessHours && consent) {
            granted = true;
            if (activeConditions === 5) {
                reasonText = 'All security conditions are met - maximum access granted';
            } else if (compliance && ownBranch) {
                reasonText = 'Strong security posture with compliance and branch verification';
            } else {
                reasonText = 'Core security requirements satisfied for data access';
            }
        } else {
            granted = false;
            if (!validAuth) {
                reasonText = 'Authentication required for any data access';
            } else if (!businessHours) {
                reasonText = 'Access restricted outside business hours';
            } else if (!consent) {
                reasonText = 'Customer consent required for data access';
            }
        }
    } else {
        // Restrict mode: block access when certain conditions are true
        policyDesc.textContent = 'Restrict access when security concerns or policy violations are detected';
        
        if (!businessHours || !validAuth || !compliance) {
            granted = false;
            if (!businessHours) {
                reasonText = 'Access blocked outside business hours per security policy';
            } else if (!validAuth) {
                reasonText = 'Access blocked due to authentication failure';
            } else if (!compliance) {
                reasonText = 'Access blocked - compliance training required';
            }
        } else if (!consent && activeConditions < 4) {
            granted = false;
            reasonText = 'Access restricted - insufficient permissions for customer data';
        } else {
            granted = true;
            reasonText = 'No security restrictions currently active';
        }
    }
    
    // Update UI
    if (granted) {
        indicator.className = 'access-indicator access-granted';
        indicator.innerHTML = '✓';
        message.textContent = 'Access Granted';
    } else {
        indicator.className = 'access-indicator access-denied';
        indicator.innerHTML = '✗';
        message.textContent = 'Access Denied';
    }
    
    reason.textContent = reasonText;
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});
