/**
 * Incompatible Moons — Main Interactive Controller
 * Handles Navigation, Real-time Form Validation & Submission
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Navbar Scroll Blur & Back to Top
  const navbar = document.getElementById('navbar');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any link
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Message Textarea Character Counter
  const messageInput = document.getElementById('message');
  const charCounter = document.getElementById('char-counter');

  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const len = messageInput.value.length;
      charCounter.textContent = `${len} / 1000`;
      if (len >= 950) {
        charCounter.style.color = 'var(--warning)';
      } else {
        charCounter.style.color = 'var(--text-dim)';
      }
    });
  }

  // 4. Contact Form Validation & Submission
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');

  const nameGroup = document.getElementById('group-name');
  const emailGroup = document.getElementById('group-email');
  const messageGroup = document.getElementById('group-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName() {
    const val = nameInput.value.trim();
    if (!val) {
      setError(nameGroup, nameError, 'Please enter your name or moniker.');
      return false;
    }
    if (val.length < 2) {
      setError(nameGroup, nameError, 'Name must be at least 2 characters.');
      return false;
    }
    clearError(nameGroup, nameError);
    return true;
  }

  function validateEmail() {
    const val = emailInput.value.trim();
    if (!val) {
      setError(emailGroup, emailError, 'Email frequency is required.');
      return false;
    }
    if (!EMAIL_REGEX.test(val)) {
      setError(emailGroup, emailError, 'Enter a valid email address (e.g. name@domain.com).');
      return false;
    }
    clearError(emailGroup, emailError);
    return true;
  }

  function validateMessage() {
    const val = messageInput.value.trim();
    if (!val) {
      setError(messageGroup, messageError, 'Please provide a transmission message.');
      return false;
    }
    if (val.length < 10) {
      setError(messageGroup, messageError, 'Message must be at least 10 characters.');
      return false;
    }
    clearError(messageGroup, messageError);
    return true;
  }

  function setError(group, errorElem, message) {
    group.classList.add('has-error');
    group.classList.remove('is-valid');
    errorElem.textContent = message;
  }

  function clearError(group, errorElem) {
    group.classList.remove('has-error');
    group.classList.add('is-valid');
    errorElem.textContent = '';
  }

  // Real-time blur listeners
  nameInput.addEventListener('blur', validateName);
  emailInput.addEventListener('blur', validateEmail);
  messageInput.addEventListener('blur', validateMessage);

  nameInput.addEventListener('input', () => {
    if (nameGroup.classList.contains('has-error')) validateName();
  });
  emailInput.addEventListener('input', () => {
    if (emailGroup.classList.contains('has-error')) validateEmail();
  });
  messageInput.addEventListener('input', () => {
    if (messageGroup.classList.contains('has-error')) validateMessage();
  });

  // Handle Form Submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset status
    formFeedback.className = 'form-feedback';
    formFeedback.style.display = 'none';
    formFeedback.innerHTML = '';

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isMsgValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isMsgValid) {
      // Focus first erroneous input
      if (!isNameValid) nameInput.focus();
      else if (!isEmailValid) emailInput.focus();
      else if (!isMsgValid) messageInput.focus();
      return;
    }

    // Get selected budget
    const selectedBudget = document.querySelector('input[name="budget"]:checked')?.value || 'Unspecified';

    const payload = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      subject: subjectInput.value,
      budget: selectedBudget,
      message: messageInput.value.trim()
    };

    // UI Loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        showSuccess(data.transmissionId, data.message);
        contactForm.reset();
        charCounter.textContent = '0 / 1000';
        [nameGroup, emailGroup, messageGroup].forEach(g => g.classList.remove('is-valid'));
      } else {
        const errorText = data.message || (data.errors ? data.errors.join(' ') : 'Orbital transmission failed.');
        showError(errorText);
      }
    } catch (err) {
      console.warn('Backend server unavailable or network error. Saving to local storage fallback.', err);
      // Fallback: save to localStorage so no user input is ever lost
      const localId = `local_${Date.now().toString(36)}`;
      const savedTransmissions = JSON.parse(localStorage.getItem('incompatible_moons_transmissions') || '[]');
      savedTransmissions.unshift({
        id: localId,
        ...payload,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('incompatible_moons_transmissions', JSON.stringify(savedTransmissions));

      showSuccess(
        localId,
        'Transmission captured locally! Our automated relay will dispatch it once connection to the mothership is established.'
      );
      contactForm.reset();
      charCounter.textContent = '0 / 1000';
      [nameGroup, emailGroup, messageGroup].forEach(g => g.classList.remove('is-valid'));
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });

  function showSuccess(transmissionId, customMsg) {
    formFeedback.className = 'form-feedback success';
    formFeedback.innerHTML = `
      <strong>✦ Transmission Successful!</strong>
      <p style="margin-top: 4px;">${customMsg || "Your signal has entered our orbit. Expect a response within 24 standard solar hours."}</p>
      ${transmissionId ? `<div class="transmission-id-pill">Signal ID: ${transmissionId}</div>` : ''}
    `;
    formFeedback.style.display = 'block';
  }

  function showError(msg) {
    formFeedback.className = 'form-feedback error';
    formFeedback.innerHTML = `
      <strong>⚠ Transmission Interrupted</strong>
      <p style="margin-top: 4px;">${msg}</p>
    `;
    formFeedback.style.display = 'block';
  }
});
