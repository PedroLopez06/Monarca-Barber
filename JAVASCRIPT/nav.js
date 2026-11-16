// Barra flutuante com 3 abas, injetada por script (o HTML dela não é copiado em cada página).
// Cada página define <body data-pagina="inicio|agendamentos|perfil">
document.addEventListener('DOMContentLoaded', function () {
  const atual = document.body.dataset.pagina;
  if (!atual) return; // login e admin não têm data-pagina, então não mostram a barra
  const logado = !!Monarca.usuarioAtual();
  const abas = [
    ['inicio', 'index.html', 'Início', '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>'],
    ['agendamentos', 'agendamentos.html', 'Agendamentos', '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'],
    ['perfil', 'perfil.html', 'Perfil', '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>']
  ];
  const nav = document.createElement('nav');
  nav.className = 'barra'; nav.setAttribute('aria-label', 'Navegação principal');
  nav.innerHTML = abas.map(([id, link, texto, icone]) => {
    // Visitante que clica em página restrita cai no login (e volta depois)
    const destino = (!logado && id !== 'inicio') ? 'login.html' : link;
    return '<a href="' + destino + '"' + (id === atual ? ' aria-current="page"' : '') + '>' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' + icone + '</svg>' + texto + '</a>';
  }).join('');
  document.body.appendChild(nav);
});
