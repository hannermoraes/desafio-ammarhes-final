const loginContainer = document.getElementById('login-container');
const moveOverlay = () => loginContainer.classList.toggle('move');

document.getElementById('open-register').addEventListener('click', moveOverlay);
document.getElementById('open-login').addEventListener('click', moveOverlay);
document.getElementById('open-register-mobile').addEventListener('click', moveOverlay);
document.getElementById('open-login-mobile').addEventListener('click', moveOverlay);

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
    alert('Credenciais inválidas.\nPor favor, verifique se email e senha estão corretos.');
  }
}
// Adicionar o listener para o botão de login
document.getElementById('submit-button').addEventListener('click', handleLogin);

// Restante do código, incluindo as funções de validateLogin e saveUser (não foram alteradas)
function validateLogin(email, password) {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];
  const user = registeredUsers.find(user => user.email === email);

  if (!user) {
    alert("Usuário não encontrado!\nVerifique se email e senha estão corretos.");
    return false;
  }

  if (user.password === password) {
    return true;
  } else {
    alert('Credenciais inválidas.\nPor favor, verifique se email e senha estão corretos.');
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

  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*_\-])[A-Za-z\d!@#$%^&*_\-]{8,}$/;
  if (!passwordRegex.test(password)) {
    alert('A senha deve ter pelo menos 8 caracteres, incluindo pelo menos 1 caractere especial e 1 número.');
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



