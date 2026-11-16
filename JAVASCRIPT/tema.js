// Carregado no <head>: aplica o tema antes de a página aparecer (evita piscar)
(function () {
  let tema = null;
  try { tema = JSON.parse(localStorage.getItem('monarca_theme')); } catch (e) {}
  if (!tema) tema = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', tema);
})();
window.Monarca = window.Monarca || {};
const ICONE_SOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/></svg>';
const ICONE_LUA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>';
Monarca.iniciarTema = function (botao) {
  const pintar = () => {
    const claro = document.documentElement.getAttribute('data-theme') === 'light';
    botao.innerHTML = claro ? ICONE_SOL : ICONE_LUA; // sol no tema claro, lua no escuro
    botao.setAttribute('aria-label', claro ? 'Mudar para tema escuro' : 'Mudar para tema claro');
  };
  botao.addEventListener('click', () => {
    const novo = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', novo);
    Monarca.salvar('monarca_theme', novo);
    pintar();
  });
  pintar();
};
// Se uma imagem não existir, esconde o ícone quebrado (a moldura continua lá, vazia, esperando a sua foto)
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.style.visibility = 'hidden'; }, true);
