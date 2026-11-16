// TELA DE AGENDAR: o cliente escolhe serviço, barbeiro, data e horário, e confirma.
const usuario = Monarca.usuarioAtual() || { id: '' };   // visitante: o topo.js manda para o login
const barbeiros = Monarca.dados.barbeiros;

// "Estado" da tela: tudo o que o cliente já escolheu fica guardado aqui
const escolha = { servicos: [], barbeiro: 0, data: '', hora: '' };   // barbeiro 0 = qualquer profissional

function pegar(id) { return document.getElementById(id); }
function dataISO(data) {   // Date -> 'AAAA-MM-DD' no horário local
  return data.getFullYear() + '-' + String(data.getMonth() + 1).padStart(2, '0') + '-' + String(data.getDate()).padStart(2, '0');
}
function servicosEscolhidos() {
  return Monarca.dados.servicos.filter(s => escolha.servicos.includes(s.id));
}
function totais() {
  let minutos = 0, valor = 0;
  for (const s of servicosEscolhidos()) { minutos += s.duracao; valor += s.preco; }
  return { minutos: minutos, valor: valor, blocos: Math.ceil(minutos / 30) };
}

/* Passo 1: serviços pode marcar mais de um  */
function montarServicos() {
  pegar('lista-servicos').innerHTML = Monarca.dados.servicos.map(s => `
    <button type="button" class="linha opcao ${escolha.servicos.includes(s.id) ? 'selecionado' : ''}" data-id="${s.id}">
      <span class="info"><strong>${s.nome}</strong><br><small class="suave">${s.duracao} min</small></span>
      <span class="preco">${Monarca.moeda(s.preco)}</span>
    </button>`).join('');
}

/* Passo 2: barbeiro */
function montarBarbeiros() {
  const opcoes = [{ id: 0, nome: 'Qualquer profissional' }].concat(barbeiros);
  pegar('lista-barbeiros').innerHTML = opcoes.map(b => `
    <button type="button" class="linha opcao ${escolha.barbeiro === b.id ? 'selecionado' : ''}" data-id="${b.id}">
      <span class="info"><strong>${b.nome}</strong></span>
    </button>`).join('');
}

/* Passo 4: horários desabilitados quando ocupados, passados ou no almoço */
function montarHorarios() {
  const caixa = pegar('lista-horarios');
  if (!escolha.data) { caixa.innerHTML = '<p class="suave">Escolha uma data primeiro.</p>'; return; }
  if (!Monarca.diaAberto(escolha.data)) { caixa.innerHTML = '<p class="suave">A barbearia está fechada nesse dia.</p>'; return; }
  if (escolha.servicos.length === 0) { caixa.innerHTML = '<p class="suave">Escolha o serviço para ver os horários.</p>'; return; }

  const blocos = totais().blocos;
  let html = '', algumLivre = false;
  for (const hora of Monarca.horariosDoDia()) {
    const livre = !Monarca.horarioPassou(escolha.data, hora) && Monarca.barbeiroLivre(escolha.data, hora, escolha.barbeiro, blocos) !== null;
    if (livre) algumLivre = true;
    html += `<button type="button" class="horario ${escolha.hora === hora ? 'selecionado' : ''}" data-hora="${hora}" ${livre ? '' : 'disabled'}>${hora}</button>`;
  }
  caixa.innerHTML = html + (algumLivre ? '' : '<p class="suave">Dia lotado. Tente outra data.</p>');
}

/* Resumo e botão de confirmar */
function atualizarResumo() {
  const t = totais();
  const nomes = servicosEscolhidos().map(s => s.nome).join(', ') || 'nenhum';
  pegar('resumo').innerHTML = `
    <p><strong>Serviços:</strong> ${nomes}</p>
    <p><strong>Duração:</strong> ${t.minutos} min · <strong>Total:</strong> <span class="preco">${Monarca.moeda(t.valor)}</span></p>
    <p><strong>Quando:</strong> ${escolha.data ? new Date(escolha.data + 'T12:00').toLocaleDateString('pt-BR') : '—'} ${escolha.hora ? 'às ' + escolha.hora : ''}</p>`;
  // O botão só habilita para clicar quando tudo foi escolhido
  pegar('btn-confirmar').disabled = !(escolha.servicos.length > 0 && escolha.data && escolha.hora);
}

function atualizarTudo() { montarServicos(); montarBarbeiros(); montarHorarios(); atualizarResumo(); }

/* Cliques */
pegar('lista-servicos').onclick = function (evento) {
  const botao = evento.target.closest('[data-id]');
  if (!botao) return;
  const id = botao.dataset.id;
  // marca ou desmarca o serviço
  escolha.servicos = escolha.servicos.includes(id) ? escolha.servicos.filter(s => s !== id) : escolha.servicos.concat(id);
  escolha.hora = '';   // a duração mudou, então o horário escolhido pode não servir mais
  atualizarTudo();
};
pegar('lista-barbeiros').onclick = function (evento) {
  const botao = evento.target.closest('[data-id]');
  if (!botao) return;
  escolha.barbeiro = Number(botao.dataset.id);
  escolha.hora = '';
  atualizarTudo();
};
pegar('data').onchange = function (evento) {
  escolha.data = evento.target.value;
  escolha.hora = '';
  atualizarTudo();
};
pegar('lista-horarios').onclick = function (evento) {
  const botao = evento.target.closest('[data-hora]');
  if (!botao || botao.disabled) return;
  escolha.hora = botao.dataset.hora;
  atualizarTudo();
};

/* Confirmar: confere o horário de novo e salva */
pegar('btn-confirmar').onclick = function () {
  const t = totais();
  // Confere outra vez: outro agendamento pode ter ocupado o horário enquanto o cliente decidia
  const barbeiroId = Monarca.barbeiroLivre(escolha.data, escolha.hora, escolha.barbeiro, t.blocos);
  if (barbeiroId === null || Monarca.horarioPassou(escolha.data, escolha.hora)) {
    Monarca.aviso('Esse horário acabou de ser ocupado. Escolha outro.');
    escolha.hora = '';
    atualizarTudo();
    return;
  }
  Monarca.salvarAgendamento({
    id: 'a' + Date.now(), code: Monarca.gerarCodigo(), userId: usuario.id, clientName: usuario.nome, phone: usuario.telefone,
    // guardamos uma cópia dos serviços, assim o histórico não muda se o preço mudar depois
    services: servicosEscolhidos().map(s => ({ id: s.id, name: s.nome, price: s.preco, duration: s.duracao })),
    barberId: barbeiroId, date: escolha.data, time: escolha.hora, durationMin: t.minutos, blocks: t.blocos,
    subtotal: t.valor, discount: 0, total: t.valor, status: 'agendado', createdAt: new Date().toISOString()
  });
  location.href = 'agendamentos.html?aba=confirmar&novo=1';   // vai para a aba Confirmar
};

/* Início */
(function iniciar() {
  // Limites do calendário: de hoje até daqui a 30 dias
  const hoje = new Date(), limite = new Date();
  limite.setDate(hoje.getDate() + 30);
  pegar('data').min = dataISO(hoje);
  pegar('data').max = dataISO(limite);

  // Serviço clicado na tela inicial já vem marcado
  const guardado = sessionStorage.getItem('monarca_servico');
  if (guardado) { escolha.servicos = [guardado]; sessionStorage.removeItem('monarca_servico'); }
  atualizarTudo();
})();
