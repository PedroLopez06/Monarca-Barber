// REGRAS DA AGENDA: quais horários estão livres e como salvar um agendamento.
// Ideia central: o dia é dividido em "blocos" de 30 minutos. Um corte de 60 min ocupa 2 blocos.

// Converte '09:30' em minutos (570) e volta, porque somar minutos é mais fácil que somar texto
function paraMinutos(hora) {
  const partes = hora.split(':');
  return Number(partes[0]) * 60 + Number(partes[1]);
}
function paraHora(minutos) {
  const h = String(Math.floor(minutos / 60)).padStart(2, '0');
  const m = String(minutos % 60).padStart(2, '0');
  return h + ':' + m;
}

// Todos os horários de início do dia, sem o almoço: 09:00, 09:30 ... 18:30
Monarca.horariosDoDia = function () {
  const b = Monarca.dados.barbearia;
  const lista = [];
  for (let minuto = b.abre * 60; minuto < b.fecha * 60; minuto += 30) {
    const noAlmoco = minuto >= b.almocoInicio * 60 && minuto < b.almocoFim * 60;
    if (!noAlmoco) lista.push(paraHora(minuto));
  }
  return lista;
};

// A barbearia abre nesse dia da semana? (dataTexto no formato 'AAAA-MM-DD')
Monarca.diaAberto = function (dataTexto) {
  const diaDaSemana = new Date(dataTexto + 'T12:00').getDay();
  return Monarca.dados.barbearia.diasAbertos.includes(diaDaSemana);
};

// Lista os blocos já ocupados de um barbeiro num dia por agendamento
function blocosOcupados(data, barbeiroId) {
  const ocupados = new Set();
  for (const a of Monarca.ler('monarca_appointments', [])) {
    const ocupaAgenda = a.status === 'agendado' || a.status === 'concluido';   // cancelado libera o horário
    if (a.date !== data || a.barberId !== barbeiroId || !ocupaAgenda) continue;
    for (let i = 0; i < a.blocks; i++) ocupados.add(paraHora(paraMinutos(a.time) + i * 30));
  }
  return ocupados;
}
// Devolve o id de um barbeiro livre nesse horário, ou null se ninguém puder.
// barbeiroId 0 = "Qualquer profissional": testa cada barbeiro até achar um livre.
Monarca.barbeiroLivre = function (data, hora, barbeiroId, blocos) {
  const validos = Monarca.horariosDoDia();
  const candidatos = barbeiroId === 0 ? Monarca.dados.barbeiros.map(b => b.id) : [barbeiroId];
  for (const id of candidatos) {
    const ocupados = blocosOcupados(data, id);
    let livre = true;
    for (let i = 0; i < blocos; i++) {                      // todos os blocos precisam estar livres
      const bloco = paraHora(paraMinutos(hora) + i * 30);
      if (!validos.includes(bloco) || ocupados.has(bloco)) { livre = false; break; }   // não atravessa almoço nem o fim do expediente
    }
    if (livre) return id;
  }
  return null;
};

// No dia de hoje, só dá para agendar a partir de 30 minutos à frente
Monarca.horarioPassou = function (data, hora) {
  const limite = new Date(Date.now() + 30 * 60000);
  return new Date(data + 'T' + hora) < limite;
};

// Código no formato MB-4821, sem repetir
Monarca.gerarCodigo = function () {
  const usados = Monarca.ler('monarca_appointments', []).map(a => a.code);
  let codigo;
  do { codigo = 'MB-' + (1000 + Math.floor(Math.random() * 9000)); } while (usados.includes(codigo));
  return codigo;
};

Monarca.salvarAgendamento = function (agendamento) {
  const lista = Monarca.ler('monarca_appointments', []);
  lista.push(agendamento);
  Monarca.salvar('monarca_appointments', lista);
};
