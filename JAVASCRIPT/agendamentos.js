// TELA DE AGENDAMENTOS: duas abas, "Confirmar" (agendado) e "Concluídos"
const usuario = Monarca.usuarioAtual() || { id: '' };   // visitante: o topo.js manda para o login
function pegar(id) { return document.getElementById(id); }

function meusAgendamentos() {
  return Monarca.ler('monarca_appointments', []).filter(a => a.userId === usuario.id);
}
function nomeDoBarbeiro(id) {
  const barbeiro = Monarca.dados.barbeiros.find(b => b.id === id);
  return barbeiro ? barbeiro.nome : '—';
}
function textoData(a) {
  return new Date(a.date + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) + ' às ' + a.time;
}
function nomesDosServicos(a) { return a.services.map(s => s.name).join(', '); }

// Mensagem pronta para confirmar pelo WhatsApp
function linkWhatsApp(a) {
  const texto = `Olá! Sou ${a.clientName} e eu gostaria de agendar ${nomesDosServicos(a)} para ${textoData(a)}. Código: ${a.code}`;
  return 'https://wa.me/83996986476' + Monarca.dados.barbearia.whatsapp + '?text=' + encodeURIComponent(texto);
}

function estadoVazio(mensagem) {
  return `<div class="vazio"><p class="suave" style="margin-bottom:16px">${mensagem}</p><a class="btn" href="agendar.html">Agendar horário</a></div>`;
}

/* Aba de confirmar o agendamento*/
function montarConfirmar() {
  const lista = meusAgendamentos().filter(a => a.status === 'agendado')
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));   // do mais próximo ao mais distante
  pegar('contador-confirmar').textContent = lista.length;
  pegar('painel-confirmar').innerHTML = lista.length === 0 ? estadoVazio('Você não tem agendamentos para confirmar.') :
    lista.map(a => `
      <article class="cartao">
        <div class="topo-cartao"><strong>${textoData(a)}</strong><span class="chip">${a.code}</span></div>
        <p>${nomesDosServicos(a)}</p>
        <p class="suave">Barbeiro: ${nomeDoBarbeiro(a.barberId)} · <span class="preco">${Monarca.moeda(a.total)}</span></p>
        <div class="acoes-cartao">
          <a class="btn btn-pequeno" href="${linkWhatsApp(a)}" target="_blank" rel="noopener noreferrer">Confirmar pelo WhatsApp</a>
          <button class="btn btn-contorno btn-pequeno" data-cancelar="${a.id}">Cancelar</button>
        </div>
      </article>`).join('');
}

/* Aba Concluídos */
function montarConcluidos() {
  const lista = meusAgendamentos().filter(a => a.status === 'concluido')
    .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));   // do mais recente ao mais antigo
  pegar('contador-concluidos').textContent = lista.length;

  let gasto = 0;
  for (const a of lista) gasto += a.total;
  pegar('resumo-topo').innerHTML = `
    <div><strong>${lista.length}</strong>cortes concluídos</div>
    <div><strong>${Monarca.moeda(gasto)}</strong>total gasto</div>`;

  pegar('painel-concluidos').innerHTML = lista.length === 0 ? estadoVazio('Seus atendimentos concluídos aparecem aqui.') :
    lista.map(a => `
      <article class="cartao">
        <div class="topo-cartao"><strong>${textoData(a)}</strong><span class="chip">${a.code}</span></div>
        <p>${nomesDosServicos(a)}</p>
        <p class="suave">Barbeiro: ${nomeDoBarbeiro(a.barberId)} · <span class="preco">${Monarca.moeda(a.total)}</span></p>
      </article>`).join('');
}

/* Cancelar (só até 2 horas antes) */
pegar('painel-confirmar').onclick = function (evento) {
  const botao = evento.target.closest('[data-cancelar]');
  if (!botao) return;
  const todos = Monarca.ler('monarca_appointments', []);
  const agendamento = todos.find(a => a.id === botao.dataset.cancelar);
  const faltam = new Date(agendamento.date + 'T' + agendamento.time) - Date.now();
  if (faltam < 2 * 60 * 60 * 1000) { Monarca.aviso('Só é possível cancelar até 2 horas antes.'); return; }
  if (!confirm('Cancelar este agendamento?')) return;
  agendamento.status = 'cancelado';              // o horário volta a ficar livre para outros clientes
  Monarca.salvar('monarca_appointments', todos);
  Monarca.aviso('Agendamento cancelado.');
  montarConfirmar();
};

/* Abas */
function mostrarAba(nome) {
  document.querySelectorAll('.abas-loja button').forEach(b => b.setAttribute('aria-selected', b.dataset.aba === nome));
  pegar('painel-confirmar').hidden = nome !== 'confirmar';
  pegar('painel-concluidos').hidden = nome !== 'concluidos';
}
document.querySelectorAll('.abas-loja button').forEach(b => b.onclick = () => mostrarAba(b.dataset.aba));

/* Início */
montarConfirmar();
montarConcluidos();
const parametros = new URLSearchParams(location.search);
mostrarAba(parametros.get('aba') === 'concluidos' ? 'concluidos' : 'confirmar');
if (parametros.get('novo')) Monarca.aviso('Agendamento realizado! Confirme pelo WhatsApp.');
