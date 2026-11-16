// TOPO: monta o cabeçalho de todas as páginas e protege as telas que exigem login
document.addEventListener('DOMContentLoaded', function () {
  const usuario = Monarca.usuarioAtual();   // null se ninguém estiver logado
  const corpo = document.body;

  // Página protegida + visitante = vai para o login
  if (corpo.dataset.protegida && !usuario) {
    location.replace('login.html');
    return;
  }

  // Botão da direita: "Entrar" para visitante, nome com menu para quem está logado
  let botaoUsuario = '';
  if (!corpo.dataset.login) {
    if (usuario) {
      const primeiroNome = Monarca.escapar(usuario.nome.split(' ')[0]);
      botaoUsuario = `
        <div class="dropdown">
          <button class="pilula" id="btn-user"><span class="avatar">${primeiroNome[0]}</span>${primeiroNome} ▾</button>
          <div class="dropdown-lista">
            <a href="agendamentos.html">Agendamentos</a>
            <a href="perfil.html">Perfil</a>
            <button id="btn-sair">Sair</button>
          </div>
        </div>`;
    } else {
      botaoUsuario = '<a class="pilula" href="login.html"><span class="avatar">👤</span>Entrar</a>';
    }
  }

  // Monta o HTML do topo
  const topo = document.createElement('header');
  topo.className = 'topo';
  topo.innerHTML = `
    <div class="topo-esquerda">
      <a class="logo" href="index.html">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 18h18l1-10-5 4-5-8-5 8-5-4z"/></svg>Monarca Barber
      </a>
      <nav class="topo-links" aria-label="Principal">
        <a href="index.html">Início</a>
        <a href="agendar.html">Agendar</a>
        <a href="agendamentos.html">Meus Agendamentos</a>
      </nav>
    </div>
    <div class="acoes">
      <button class="btn-icone" id="btn-tema" type="button"></button>
      ${botaoUsuario}
    </div>`;
  corpo.prepend(topo);

  Monarca.iniciarTema(document.getElementById('btn-tema'));

  // Menu do usuário: abre ao clicar e fecha ao clicar fora
  if (usuario && document.getElementById('btn-user')) {
    const menu = document.querySelector('.dropdown');
    document.getElementById('btn-user').onclick = function (evento) {
      evento.stopPropagation();
      menu.classList.toggle('aberto');
    };
    document.addEventListener('click', () => menu.classList.remove('aberto'));
    document.getElementById('btn-sair').onclick = Monarca.sair;
  }
});
