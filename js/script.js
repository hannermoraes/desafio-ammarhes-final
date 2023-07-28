const loginContainer = document.getElementById('login-container');
const moveOverlay = () => loginContainer.classList.toggle('move');

document.getElementById('open-register').addEventListener('click', moveOverlay);
document.getElementById('open-login').addEventListener('click', moveOverlay);
document.getElementById('open-register-mobile').addEventListener('click', moveOverlay);
document.getElementById('open-login-mobile').addEventListener('click', moveOverlay);

const passwordInput = document.getElementById('password-input');
const outSenha = document.getElementById('outSenha');

passwordInput.addEventListener('click', mostrarRequisitosSenha);
passwordInput.addEventListener('blur', limparRequisitosSenha);

function mostrarRequisitosSenha() {
  outSenha.textContent = "1 - A senha precisa ter no mínimo 8 caracteres.\n2 - É necessário ter ao menos uma letra maiúscula. (Ex: A-Z).\n3 - É necessário pelo menos um caractere especial. (Ex:@$&).\n4 - É preciso ter ao menos um número. (Ex: 1,2,3...).";
}

function limparRequisitosSenha() {
  outSenha.textContent = "";
}

// Função para renderizar o reCAPTCHA
function renderRecaptcha() {
  grecaptcha.render('submit-button', {
    'sitekey': '6LfZrGEnAAAAAGVFHbMjtY7oxqaU_lccv3TXQ_1V',
    'callback': ""
  });
}

// Chamando a função para renderizar o reCAPTCHA quando a página carrega
window.onload = renderRecaptcha;

function handleLogin() {
  // Verificar se o reCAPTCHA foi resolvido
  const recaptchaResponse = grecaptcha.getResponse();
  if (!recaptchaResponse) {
    alert("Por favor, complete o reCAPTCHA antes de fazer o login.");
    return;
  }

  // Se o reCAPTCHA foi resolvido, pode fazer o login
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  if (email === '' || password === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  // Realizar a validação do login
  const loginValid = validateLogin(email, password);
  if (loginValid) {
    // Exibir mensagem de login bem-sucedido (apenas para fins de demonstração)
    alert("Login bem-sucedido!");
    // Limpando o reCAPTCHA após o login bem-sucedido
    grecaptcha.reset();
  } else {
    // Usuário não encontrado
    alert('Usuário não encontrado!\nVerifique se email e senha estão corretos.');
    grecaptcha.reset();
  }
}

// Restante do código, incluindo as funções de validateLogin e saveUser (não foram alteradas)
function validateLogin(email, password) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const user = registeredUsers.find(user => user.email === email);

  if (!user) {
    return false;
  }

  if (user.password === password) {
    return true;
  } else {
    return false;
  }
}

function saveUser(email, password, fullName) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const existingUser = registeredUsers.find(user => user.email === email);

  if (existingUser) {
    alert('Este email já está registrado. Por favor, use um email diferente.');
    return;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[.!@#$%^&*_\-])[A-Za-z\d!@#$%.^&*_\-]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert('1 - A senha precisa ter no mínimo 8 caracteres.\n2 - É necessário ter ao menos uma letra maiúscula. (Ex: A-Z).\n3 - É necessário pelo menos um caractere especial. (Ex:@$&).\n4 - É preciso ter ao menos um número. (Ex: 1,2,3...).');
    return;
  }

  registeredUsers.push({ email, password, fullName });
  localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

  alert('Conta criada com sucesso! Agora você pode fazer login com suas credenciais.');

  document.querySelectorAll('.form-register .form-input').forEach(input => input.value = '');
}

function handleRegister() {
  const fullName = document.querySelector('.form-register input[placeholder="Nome Completo"]').value;
  const email = document.querySelector('.form-register input[placeholder="Email"]').value;
  const password = document.querySelector('.form-register input[placeholder="Senha"]').value;

  if (fullName === '' || email === '' || password === '') {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  saveUser(email, password, fullName);
}

// Adicionar os listeners para os botões de registro e login (se existirem)
document.querySelector('.form-login .form-button').addEventListener('click', handleLogin);
document.querySelector('.form-register .form-button').addEventListener('click', handleRegister);



