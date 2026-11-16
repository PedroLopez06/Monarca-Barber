// LOGIN E CADASTRO: abas, validação, máscara de telefone e envio
document.addEventListener('DOMContentLoaded', async function () {
  if (Monarca.usuarioAtual()) { location.replace('index.html'); return; }
  await Monarca.garantirDemo();

  const formEntrar = document.getElementById('form-entrar'), formCadastro = document.getElementById('form-cadastro');
  const abas = document.querySelectorAll('.abas button');
  abas.forEach(aba => aba.onclick = () => { // troca de aba
    abas.forEach(a => a.setAttribute('aria-selected', a === aba));
    formEntrar.hidden = aba.dataset.aba !== 'entrar';
    formCadastro.hidden = aba.dataset.aba !== 'cadastrar';
  });

  // Cada campo tem uma regra: devolve true se estiver certo, ou o texto do erro
  const regras = {
    nome: v => v.trim().length >= 3 || 'Digite pelo menos 3 letras.',
    email: v => /^\S+@\S+\.\S+$/.test(v) || 'Digite um e-mail válido.',
    telefone: v => v.replace(/\D/g, '').length === 11 || 'Use o formato (83) 9 9999-9999.',
    senha: v => (v.length >= 8 && /[A-Za-z]/.test(v) && /\d/.test(v)) || 'Mínimo de 8 caracteres, com letra e número.',
    confirma: v => v === document.getElementById('c-senha').value || 'As senhas não conferem.'
  };
  function validar(campo) {
    const resposta = regras[campo.dataset.regra](campo.value);
    campo.closest('.grupo').querySelector('.erro').textContent = resposta === true ? '' : resposta;
    return resposta === true;
  }
  document.querySelectorAll('[data-regra]').forEach(c => c.addEventListener('blur', () => validar(c)));

  // Máscara: (83) 9 9999-9999
  document.getElementById('c-telefone').oninput = e => {
    const n = e.target.value.replace(/\D/g, '').slice(0, 11);
    e.target.value = n.replace(/^(\d{0,2})(\d{0,1})(\d{0,4})(\d{0,4}).*/, (t, a, b, c, d) =>
      (a ? '(' + a : '') + (a.length === 2 ? ') ' : '') + b + (b ? ' ' : '') + c + (d ? '-' + d : ''));
  };
  document.querySelectorAll('.ver-senha').forEach(botao => botao.onclick = () => { // mostrar/ocultar senha
    const campo = botao.previousElementSibling;
    campo.type = campo.type === 'password' ? 'text' : 'password';
  });

  formEntrar.onsubmit = async e => {
    e.preventDefault();
    const ok = await Monarca.entrar(document.getElementById('e-email').value, document.getElementById('e-senha').value);
    if (ok) location.href = 'index.html';
    else document.getElementById('erro-entrar').textContent = 'E-mail ou senha incorretos.'; // erro genérico de propósito
  };
  formCadastro.onsubmit = async e => {
    e.preventDefault();
    const campos = [...formCadastro.querySelectorAll('[data-regra]')];
    if (!campos.map(validar).every(Boolean)) return;
    const email = document.getElementById('c-email').value.trim().toLowerCase();
    if (Monarca.ler('monarca_users', []).some(u => u.email === email)) {
      document.getElementById('c-email').closest('.grupo').querySelector('.erro').textContent = 'Este e-mail já está cadastrado.';
      return;
    }
    await Monarca.cadastrar(document.getElementById('c-nome').value, email, document.getElementById('c-telefone').value, document.getElementById('c-senha').value);
    location.href = 'index.html';
  };
});
