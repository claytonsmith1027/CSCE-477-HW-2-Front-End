const form = document.querySelector('#login-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const message = document.querySelector('#form-message');

function validateLogin(email, password) {
  if (email.trim() === '' || password === '') {
    return 'Email and password are required.';
  }

  if (!email.includes('@')) {
    return 'Email must contain @.';
  }

  if (password.length < 8) {
    return 'Password must be at least 8 characters.';
  }

  return '';
}

function showMessage(text, type) {
  message.textContent = text;
  message.className = type;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const validationError = validateLogin(email, password);

  if (validationError) {
    showMessage(validationError, 'error');
    return;
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const result = await response.json();

    if (!response.ok) {
      showMessage(result.message || 'Unable to submit the form.', 'error');
      return;
    }

    showMessage(result.message, 'success');
  } catch {
    showMessage('Could not contact the server.', 'error');
  }
});
