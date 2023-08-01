const getElement = (selector) => document.querySelector(selector);

// Elementos do DOM
const elements = {
  loginContainer: getElement('#login-container'),
  passwordInput: getElement('#password-input'),
  outSenha: getElement('#outSenha'),
  emailInput: getElement('#email'),
  passwordInputLogin: getElement('#password'),
  submitButton: getElement('#submit-button'),
  fullNameInput: getElement('.form-register input[placeholder="Nome Completo"]'),
  emailInputRegister: getElement('.form-register input[placeholder="Email"]'),
  passwordInputRegister: getElement('.form-register input[placeholder="Senha"]'),
  formLoginButton: getElement('.form-login .form-button'),
  formRegisterButton: getElement('.form-register .form-button'),
  openRegisterButton: getElement('#open-register'),
  openLoginButton: getElement('#open-login'),
  openRegisterButtonMobile: getElement('#open-register-mobile'),
  openLoginButtonMobile: getElement('#open-login-mobile'),
};

// Toggle da classe 'move' no container de login
const moveOverlay = () => elements.loginContainer.classList.toggle('move');


// Listener para o botão de cadastro mobile (abrir overlay)
elements.openRegisterButtonMobile.addEventListener('click', () => {
  moveOverlay();
  clearRequirementsPassword(); // Limpar requisitos da senha quando o overlay for aberto
});

// Listener para o botão de entrar mobile (fechar overlay)
elements.openLoginButtonMobile.addEventListener('click', () => {
  moveOverlay();
  clearRequirementsPassword(); // Limpar requisitos da senha quando o overlay for fechado
});

// Mostrar requisitos da senha
const showRequirementsPassword = () => {
  elements.outSenha.textContent =
    " 1 - No mínimo 8 caracteres.\n" +
    "2 - Ao menos uma letra maiúscula. (Ex: A-Z).\n" +
    "3 - Ao menos um caractere especial. (Ex: @$&).\n" +
    "4 - Ao menos um número. (Ex: 1, 2, 3...)."
};

// Limpar requisitos da senha
const clearRequirementsPassword = () => {
  elements.outSenha.textContent = '';
};

// Função para verificar o reCAPTCHA
const isRecaptchaResolved = () => {
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert('Complete o reCAPTCHA antes de fazer o seu login.');
    return false;
  }
  return true;
};

// Função para realizar o login
const handleLogin = () => {
  if (!isRecaptchaResolved()) {
    return;
  }

  const email = elements.emailInput.value;
  const password = elements.passwordInputLogin.value;

  if (email === '' || password === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const loginValid = validateLogin(email, password);
  if (loginValid) {
    alert('Login bem-sucedido!');
    grecaptcha.reset();
  } else {
    alert('Usuário não encontrado!\nVerifique se o email e a senha estão corretos.');
    grecaptcha.reset();
  }
};

// Função para realizar o registro
const handleRegister = () => {
  const fullName = elements.fullNameInput.value;
  const email = elements.emailInputRegister.value;
  const password = elements.passwordInputRegister.value;

  if (fullName === '' || email === '' || password === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  saveUser(email, password, fullName);
};

// Adicionar os listeners aos botões de registro e login
elements.formLoginButton.addEventListener('click', handleLogin);
elements.formRegisterButton.addEventListener('click', handleRegister);

// Adicionar os listeners para mostrar e limpar os requisitos da senha
elements.passwordInput.addEventListener('click', showRequirementsPassword);
elements.passwordInput.addEventListener('blur', clearRequirementsPassword);
elements.passwordInput.addEventListener('focus', showRequirementsPassword);

// Listener para o botão de cadastro (abrir overlay)
elements.openRegisterButton.addEventListener('click', () => {
  moveOverlay();
  clearRequirementsPassword(); // Limpar requisitos da senha quando o overlay for aberto
});

// Listener para o botão de entrar (fechar overlay)
elements.openLoginButton.addEventListener('click', () => {
  moveOverlay();
  clearRequirementsPassword(); // Limpar requisitos da senha quando o overlay for fechado
});

// Função para renderizar o reCAPTCHA quando a página carrega
window.onload = () => {
  grecaptcha.render('submit-button', {
    sitekey: '6LfZrGEnAAAAAGVFHbMjtY7oxqaU_lccv3TXQ_1V',
    callback: '',
  });
};

// Função para validar login e salvar usuário
function validateLogin(email, password) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const user = registeredUsers.find((user) => user.email === email);

  return user && user.password === password;
}

function saveUser(email, password, fullName) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const existingUser = registeredUsers.find((user) => user.email === email);

  if (existingUser) {
    alert('Este email já está registrado. Por favor, use um email diferente.');
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[.!@#$%^&*_\-])[A-Za-z\d!@#$%.^&*_\-]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert(
      " 1 - No mínimo 8 caracteres.\n" +
      "2 - Ao menos uma letra maiúscula. (Ex: A-Z).\n" +
      "3 - Ao menos um caractere especial. (Ex: @$&).\n" +
      "4 - Ao menos um número. (Ex: 1, 2, 3...).");
    return;
  }

  registeredUsers.push({ email, password, fullName });
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  alert('Conta criada com sucesso! Agora você pode fazer login com suas credenciais.');

  // Limpar campos após o cadastro
  elements.fullNameInput.value = '';
  elements.emailInputRegister.value = '';
  elements.passwordInputRegister.value = '';
}
