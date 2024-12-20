// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

// Links hover effect
document.querySelectorAll('a, button').forEach(link => {
    link.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'scale(1.5)';
    });
    
    link.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'scale(1)';
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    navLinks.classList.toggle('active');
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Stats counter animation
const stats = document.querySelectorAll('.stat-number');
const observerOptions = {
    threshold: 0.5
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-value'));
            animateValue(entry.target, 0, target, 2000);
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

stats.forEach(stat => statsObserver.observe(stat));

function animateValue(element, start, end, duration) {
    let current = start;
    const range = end - start;
    const increment = range / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Scroll reveal animation
const revealElements = document.querySelectorAll('.section-header, .research-card, .about-grid, .impact-stats');

const scrollReveal = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            scrollReveal.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

revealElements.forEach(element => scrollReveal.observe(element));

// Scroll Reveal Animation
const fadeElements = document.querySelectorAll('.fade-in');

const revealOnScroll = () => {
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Add fade-in class to elements
document.querySelectorAll('.team-member, .stats-item, .product-card').forEach(element => {
    element.classList.add('fade-in');
});

// Glitch effect
const glitchText = document.querySelector('.glitch');
let glitchInterval;

function startGlitch() {
    clearInterval(glitchInterval);
    glitchInterval = setInterval(() => {
        glitchText.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        setTimeout(() => {
            glitchText.style.transform = 'translate(0, 0)';
        }, 50);
    }, 3000);
}

startGlitch();

// Modal Management
function openModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    document.body.style.overflow = 'hidden';
    modal.style.display = 'block';
    setTimeout(() => modal.style.opacity = '1', 10);
}

function closeModal(type) {
    const modal = document.getElementById(`${type}Modal`);
    modal.style.opacity = '0';
    document.body.style.overflow = '';
    setTimeout(() => modal.style.display = 'none', 300);
    resetForm(type);
}

function switchModal(from, to) {
    closeModal(from);
    setTimeout(() => openModal(to), 300);
}

// Form Management
function resetForm(type) {
    const form = document.getElementById(`${type}Form`);
    if (form) {
        form.reset();
        clearErrors(form);
        resetPasswordStrength();
    }
}

function clearErrors(form) {
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.textContent = '');
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => input.classList.remove('error'));
}

// Password Management
function setupPasswordToggles() {
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'toggle-password';
        toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';
        toggleBtn.onclick = () => togglePassword(input, toggleBtn);
        input.parentElement.appendChild(toggleBtn);
    });
}

function togglePassword(input, button) {
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
    button.innerHTML = `<i class="fas fa-eye${type === 'password' ? '' : '-slash'}"></i>`;
}

// Password Strength
function setupPasswordStrength() {
    const passwordInput = document.getElementById('signupPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', updatePasswordStrength);
    }
}

function updatePasswordStrength() {
    const password = this.value;
    const meter = document.querySelector('.strength-meter');
    const text = document.querySelector('.strength-text');

    if (!password) {
        meter.className = 'strength-meter';
        text.textContent = '';
        return;
    }

    const strength = calculatePasswordStrength(password);
    meter.className = `strength-meter ${strength.class}`;
    text.textContent = `Password strength: ${strength.text}`;
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 3) return { class: 'weak', text: 'Weak' };
    if (score < 5) return { class: 'medium', text: 'Medium' };
    return { class: 'strong', text: 'Strong' };
}

// Form Validation
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formType = form.id.replace('Form', '');
    
    if (!validateForm(form)) return;
    
    showLoading(form);
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Handle success
        console.log(`${formType} successful`);
        closeModal(formType);
        showSuccessMessage(formType);
    } catch (error) {
        showError(form, 'An error occurred. Please try again.');
    } finally {
        hideLoading(form);
    }
}

function validateForm(form) {
    let isValid = true;
    clearErrors(form);

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !validateEmail(emailInput.value)) {
        showInputError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation for signup
    if (form.id === 'signupForm') {
        const password = form.querySelector('#signupPassword').value;
        const confirm = form.querySelector('#confirmPassword').value;
        
        if (!validatePassword(password)) {
            showInputError(form.querySelector('#signupPassword'), 
                'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            isValid = false;
        }
        
        if (password !== confirm) {
            showInputError(form.querySelector('#confirmPassword'), 
                'Passwords do not match');
            isValid = false;
        }

        // Terms acceptance
        const terms = form.querySelector('#termsAccept');
        if (terms && !terms.checked) {
            showInputError(terms, 'You must accept the Terms of Service');
            isValid = false;
        }
    }

    return isValid;
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

function showInputError(input, message) {
    input.classList.add('error');
    const errorElement = input.closest('.form-group').querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

// Loading State
function showLoading(form) {
    const button = form.querySelector('.btn-primary');
    button.classList.add('loading');
    button.disabled = true;
}

function hideLoading(form) {
    const button = form.querySelector('.btn-primary');
    button.classList.remove('loading');
    button.disabled = false;
}

// Success Messages
function showSuccessMessage(type) {
    let message = '';
    switch(type) {
        case 'login':
            message = 'Welcome back!';
            break;
        case 'signup':
            message = 'Account created successfully!';
            break;
        case 'reset':
            message = 'Password reset link sent to your email!';
            break;
    }
    // Implement your preferred notification system here
    alert(message); // Replace with a better notification system
}

// Social Login
function socialLogin(provider) {
    console.log(`Initiating ${provider} login...`);
    // Implement social login logic here
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupPasswordToggles();
    setupPasswordStrength();
    setupFormValidation();
});

// Close modals when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        const type = e.target.id.replace('Modal', '');
        closeModal(type);
    }
});

// Prevent modal close when clicking modal content
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', (e) => e.stopPropagation());
});

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add form submission logic here
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    });
}

// Parallax effect for shapes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach(shape => {
        const speed = shape.getAttribute('data-speed') || 0.1;
        const x = (window.innerWidth - e.pageX * speed) / 100;
        const y = (window.innerHeight - e.pageY * speed) / 100;
        
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(`${modalId}Modal`);
    if (!modal) return;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent body scrolling
    
    // Reset scroll position
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(`${modalId}Modal`);
    if (!modal) return;
    
    modal.style.display = 'none';
    document.body.style.overflow = ''; // Restore body scrolling
}

function switchModal(fromModal, toModal) {
    closeModal(fromModal);
    setTimeout(() => {
        openModal(toModal);
    }, 300); // Match transition time
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id.replace('Modal', '');
        closeModal(modalId);
    }
});

// Prevent modal close when clicking modal content
document.querySelectorAll('.modal-content').forEach(content => {
    content.addEventListener('click', function(event) {
        event.stopPropagation();
    });
});

// Auth Modal Functions
function socialLogin(provider) {
    console.log(`Logging in with ${provider}`);
    // Implement social login logic here
}

// Enhanced Auth Functions

// Password visibility toggle
function setupPasswordToggles() {
    document.querySelectorAll('.input-group').forEach(group => {
        const input = group.querySelector('input[type="password"]');
        if (!input) return;

        // Remove any existing toggle button
        const existingToggle = group.querySelector('.toggle-password');
        if (existingToggle) {
            existingToggle.remove();
        }

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'toggle-password fas fa-eye';
        toggle.setAttribute('aria-label', 'Toggle password visibility');
        
        group.appendChild(toggle);

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
}

// Call setup function when DOM is loaded
document.addEventListener('DOMContentLoaded', setupPasswordToggles);

// Also call setup when modals are opened to ensure toggles are added
document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', () => {
        setTimeout(setupPasswordToggles, 100);
    });
});

// Password strength checker
function checkPasswordStrength(password) {
    let strength = 0;
    const patterns = {
        length: password.length >= 8,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    strength += patterns.length ? 1 : 0;
    strength += (patterns.lowercase && patterns.uppercase) ? 1 : 0;
    strength += patterns.numbers ? 1 : 0;
    strength += patterns.special ? 1 : 0;

    return {
        score: strength,
        patterns
    };
}

document.getElementById('signupPassword').addEventListener('input', function() {
    const strength = checkPasswordStrength(this.value);
    const meter = document.querySelector('.strength-meter');
    const text = document.querySelector('.strength-text');

    meter.className = 'strength-meter';
    if (strength.score > 0) meter.classList.add(strength.score === 4 ? 'strong' : strength.score >= 2 ? 'medium' : 'weak');

    const messages = [];
    if (!strength.patterns.length) messages.push('at least 8 characters');
    if (!strength.patterns.lowercase || !strength.patterns.uppercase) messages.push('both upper and lowercase letters');
    if (!strength.patterns.numbers) messages.push('at least one number');
    if (!strength.patterns.special) messages.push('at least one special character');

    text.textContent = messages.length ? `Add ${messages.join(', ')}` : 'Strong password!';
});

// Form validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    let isValid = true;

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(error => error.classList.remove('show'));

    // Validate required fields
    form.querySelectorAll('input[required]').forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        }
    });

    // Email validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && !isValidEmail(emailInput.value)) {
        showError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation for signup
    if (formId === 'signupForm') {
        const password = form.querySelector('#signupPassword');
        const confirm = form.querySelector('#confirmPassword');
        const strength = checkPasswordStrength(password.value);

        if (strength.score < 2) {
            showError(password, 'Password is too weak');
            isValid = false;
        }

        if (password.value !== confirm.value) {
            showError(confirm, 'Passwords do not match');
            isValid = false;
        }
    }

    return isValid;
}

function showError(input, message) {
    const errorElement = input.closest('.form-group').querySelector('.error-message');
    errorElement.textContent = message;
    errorElement.classList.add('show');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Form submissions with loading state
function handleFormSubmit(formId, action) {
    const form = document.getElementById(formId);
    const button = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm(formId)) return;

        // Show loading state
        button.classList.add('loading');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Handle different form actions
            switch(action) {
                case 'login':
                    console.log('Login successful');
                    break;
                case 'signup':
                    console.log('Signup successful');
                    break;
                case 'reset':
                    console.log('Reset email sent');
                    break;
            }

            closeModal(action);
        } catch (error) {
            console.error('Error:', error);
            // Show error message
        } finally {
            button.classList.remove('loading');
        }
    });
}

// Initialize form handlers
handleFormSubmit('loginForm', 'login');
handleFormSubmit('signupForm', 'signup');
handleFormSubmit('resetForm', 'reset');

// Form Submissions
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    
    // Add your login logic here
    console.log('Login:', { email, password, remember });
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('termsAccept').checked;
    
    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }
    
    // Add your signup logic here
    console.log('Signup:', { name, email, password, terms });
});

// Products section reveal
const productsSection = document.querySelector('.products-section');
const productCards = document.querySelectorAll('.product-card');

const productsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Initially hide product cards
productCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.5s ease';
    productsObserver.observe(card);
});

// Make sure products section is visible
if (productsSection) {
    productsSection.style.display = 'block';
    productsSection.style.opacity = '1';
    productsSection.style.visibility = 'visible';
}
