// Namespace global: cada arquivo .js registra suas funções em window.Monarca
// (não usamos import/export porque o site abre por file://)
window.Monarca = window.Monarca || {};

// Lê do localStorage com valor padrão: se estiver vazio, bloqueado ou corrompido, o site não quebra
Monarca.ler = function (chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (erro) { return padrao; }
};
Monarca.salvar = function (chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); return true; }
  catch (erro) { return false; }
};
// Sessão: devolve o usuário logado ou null (usada por todas as páginas)
Monarca.usuarioAtual = function () {
  const sessao = Monarca.ler('monarca_session', null);
  if (!sessao) return null;
  return Monarca.ler('monarca_users', []).find(u => u.id === sessao.userId) || null;
};
Monarca.sair = function () {
  try { localStorage.removeItem('monarca_session'); } catch (e) {}
  location.href = 'index.html';
};
// Evita injetar HTML digitado pelo usuário
Monarca.escapar = t => String(t).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
Monarca.moeda = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
Monarca.aviso = function (msg) {
  const el = document.createElement('div');
  el.className = 'aviso'; el.setAttribute('role', 'status'); el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
};
