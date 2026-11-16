// AUTENTICAÇÃO (simulada, tudo no navegador: isso NÃO é segurança real, um sistema de verdade usaria servidor)
// Senha nunca é guardada em texto puro: guardamos só o hash SHA-256.
Monarca.hash = async function (texto) {
  if (window.crypto && crypto.subtle) {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(bytes)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0; for (const c of texto) h = (h * 31 + c.charCodeAt(0)) | 0; // plano B simples
  return 'simples' + h;
};
// Cria o usuário de demonstração na primeira vez
Monarca.garantirDemo = async function () {
  Monarca.criarHistoricoDemo();
  const usuarios = Monarca.ler('monarca_users', []);
  if (usuarios.some(u => u.email === 'demo@monarca.com')) return;
  usuarios.push({ id: 'demo', nome: 'Cliente Demo', email: 'demo@monarca.com', telefone: '(83) 9 9999-9999',
    senhaHash: await Monarca.hash('Demo@123'), criadoEm: new Date().toISOString() });
  Monarca.salvar('monarca_users', usuarios);
};
Monarca.cadastrar = async function (nome, email, telefone, senha) {
  const usuarios = Monarca.ler('monarca_users', []);
  const novo = { id: 'u' + Date.now(), nome: nome.trim(), email: email.trim().toLowerCase(), telefone,
    senhaHash: await Monarca.hash(senha), criadoEm: new Date().toISOString() };
  usuarios.push(novo);
  Monarca.salvar('monarca_users', usuarios);
  Monarca.salvar('monarca_session', { userId: novo.id });
};
Monarca.entrar = async function (email, senha) {
  const hash = await Monarca.hash(senha);
  const achado = Monarca.ler('monarca_users', []).find(u => u.email === email.trim().toLowerCase() && u.senhaHash === hash);
  if (!achado) return false;
  Monarca.salvar('monarca_session', { userId: achado.id });
  return true;
};

Monarca.criarHistoricoDemo = function () {
  if (Monarca.ler('monarca_seeded', false)) return;
  const exemplos = [['s1', 'Corte Social', 40, 30, 1], ['s3', 'Degradê Navalhado', 50, 45, 2], ['s5', 'Barba Completa', 35, 30, 1],
                    ['s7', 'Combo Social + Barba', 70, 60, 2], ['s4', 'Navalhado Total', 55, 60, 1]];
  const lista = Monarca.ler('monarca_appointments', []);
  exemplos.forEach(function (e, i) {
    const dia = new Date();
    dia.setDate(dia.getDate() - 14 * (i + 1));   // um a cada 14 dias para trás
    const data = dia.getFullYear() + '-' + String(dia.getMonth() + 1).padStart(2, '0') + '-' + String(dia.getDate()).padStart(2, '0');
    lista.push({ id: 'demo' + i, code: 'MB-' + (2000 + i * 111), userId: 'demo', clientName: 'Cliente Demo', phone: '(83) 9 9999-9999',
      services: [{ id: e[0], name: e[1], price: e[2], duration: e[3] }], barberId: e[4], date: data, time: '10:00',
      durationMin: e[3], blocks: Math.ceil(e[3] / 30), subtotal: e[2], discount: 0, total: e[2], status: 'concluido' });
  });
  Monarca.salvar('monarca_appointments', lista);
  Monarca.salvar('monarca_seeded', true);
};
