// TELA INICIAL: cada função cuida de uma parte da página.
// No final do arquivo, a função iniciar() chama todas elas na ordem.

const dados = Monarca.dados;
const barbearia = dados.barbearia;
const logado = Monarca.usuarioAtual() !== null;
// Quem não está logado passa pelo login antes de agendar
const paginaAgendar = logado ? 'agendar.html' : 'login.html';

// Atalhos para não repetir código
function pegar(id) { return document.getElementById(id); }
function estrelas(nota) { return '★'.repeat(nota) + '☆'.repeat(5 - nota); }

/* ---------- 1. Próximo horário livre (aparece como selo no topo da página) ---------- */
function proximoHorarioLivre() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() + 30);                 // só a partir de 30 min à frente

  for (let dias = 0; dias < 8; dias++) {                     // procura nos próximos 8 dias
    const dia = new Date(agora);
    dia.setDate(agora.getDate() + dias);
    if (!barbearia.diasAbertos.includes(dia.getDay())) continue;   // pula dia fechado

    for (let hora = barbearia.abre; hora < barbearia.fecha; hora += 0.5) {
      const noAlmoco = hora >= barbearia.almocoInicio && hora < barbearia.almocoFim;
      if (noAlmoco) continue;                                // pula o horário de almoço

      const candidato = new Date(dia);
      candidato.setHours(Math.floor(hora), (hora % 1) * 60, 0, 0);
      if (candidato >= agora) return candidato;
    }
  }
  return null;
}

function mostrarSelo() {
  const horario = proximoHorarioLivre();
  if (!horario) { pegar('selo').textContent = 'Consulte os horários'; return; }
  const data = horario.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const hora = horario.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  pegar('selo').textContent = `Próximo horário livre: ${data} às ${hora}`;
}

/* ---------- 2. Abas (Serviços, Profissionais, Avaliações, Sobre) ---------- */
function ativarAbas() {
  const botoes = document.querySelectorAll('.abas-loja button');
  botoes.forEach(function (botao) {
    botao.onclick = function () {
      // marca só a aba clicada como selecionada e mostra só o painel dela
      botoes.forEach(b => b.setAttribute('aria-selected', b === botao));
      document.querySelectorAll('.painel').forEach(p => p.hidden = true);
      pegar('painel-' + botao.dataset.aba).hidden = false;
      if (botao.dataset.aba === 'sobre') contarNumeros();
    };
  });
}

/* ---------- 3. Serviços com filtro por categoria ---------- */
function montarServicos(categoria) {
  let html = '';
  for (const servico of dados.servicos) {
    if (categoria !== 'todos' && servico.categoria !== categoria) continue;
    html += `
      <div class="linha">
        ${Monarca.foto(servico.img, servico.nome)}
        <div class="info">
          <h3>${servico.nome}</h3>
          <small class="suave">${servico.desc} · ${servico.duracao} min</small><br>
          <span class="preco">${Monarca.moeda(servico.preco)}</span>
        </div>
        <a class="btn btn-pequeno" href="${paginaAgendar}" data-servico="${servico.id}">Agendar</a>
      </div>`;
  }
  pegar('lista-servicos').innerHTML = html;
}

function ativarFiltros() {
  const botoes = document.querySelectorAll('.filtros button');
  botoes.forEach(function (botao) {
    botao.onclick = function () {
      botoes.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');
      montarServicos(botao.dataset.cat);
    };
  });
  // Guarda o serviço clicado para a tela de agendar já deixá-lo marcado
  pegar('lista-servicos').onclick = function (evento) {
    const link = evento.target.closest('[data-servico]');
    if (link) sessionStorage.setItem('monarca_servico', link.dataset.servico);
  };
}

/* ---------- 4. Profissionais ---------- */
function montarProfissionais() {
  let html = '';
  for (const barbeiro of dados.barbeiros) {
    html += `
      <div class="linha redonda">
        ${Monarca.foto(barbeiro.foto, barbeiro.nome)}
        <div class="info"><h3>${barbeiro.nome}</h3><small class="suave">${barbeiro.especialidade}</small></div>
      </div>`;
  }
  pegar('lista-profissionais').innerHTML = html;
}

/* ---------- 5. Avaliações: média, barras por nota e comentários ---------- */
function montarAvaliacoes() {
  // junta as avaliações de exemplo com as que os clientes salvarem (etapa 3)
  const todas = dados.avaliacoes.concat(Monarca.ler('monarca_reviews', []));
  let soma = 0;
  for (const a of todas) soma += a.nota;
  const media = soma / todas.length;

  // nota ao lado do nome da barbearia
  pegar('nota-media').innerHTML = `<span class="estrelas">★</span> ${media.toFixed(1).replace('.', ',')} <span class="suave">(${todas.length})</span>`;

  // resumo grande + uma barra para cada nota (5 até 1)
  let resumo = `<strong>${media.toFixed(1).replace('.', ',')}</strong>
                <div class="estrelas">${estrelas(Math.round(media))}</div>
                <small class="suave">${todas.length} avaliações</small>`;
  for (let nota = 5; nota >= 1; nota--) {
    const quantidade = todas.filter(a => a.nota === nota).length;
    const largura = (quantidade / todas.length) * 100;
    resumo += `<div class="barra-nota"><span>${nota}★</span><div><i style="width:${largura}%"></i></div><span>${quantidade}</span></div>`;
  }
  pegar('resumo-notas').innerHTML = resumo;

  // cartões de comentário (escapar evita injetar HTML digitado pelo usuário)
  let comentarios = '';
  for (const a of todas) {
    const data = new Date(a.data + 'T12:00').toLocaleDateString('pt-BR');
    comentarios += `
      <div class="linha avaliacao">
        <span class="estrelas">${estrelas(a.nota)}</span>
        <p>${Monarca.escapar(a.comentario)}</p>
        <small class="suave">${Monarca.escapar(a.nome)} · ${data}</small>
      </div>`;
  }
  pegar('lista-avaliacoes').innerHTML = comentarios;
}

/* ---------- 6. Números que sobem (aba Sobre) ---------- */
let numerosJaContaram = false;
function contarNumeros() {
  if (numerosJaContaram) return;
  numerosJaContaram = true;
  document.querySelectorAll('[data-alvo]').forEach(function (elemento) {
    const fim = Number(elemento.dataset.alvo);
    let atual = 0;
    const relogio = setInterval(function () {
      atual = Math.min(fim, atual + Math.ceil(fim / 40));
      elemento.textContent = atual + '+';
      if (atual === fim) clearInterval(relogio);
    }, 30);
  });
}

/* ---------- 7. Cartão lateral: horários, contato, pagamento e mapa ---------- */
function montarLateral() {
  pegar('texto-endereco').textContent = barbearia.endereco;
  pegar('link-maps').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(barbearia.endereco);

  // horário de atendimento: segunda a domingo, com a etiqueta "Hoje"
  const nomes = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
  const hoje = new Date().getDay();
  let horarios = '';
  for (const numero of [1, 2, 3, 4, 5, 6, 0]) {
    const aberto = barbearia.diasAbertos.includes(numero);
    horarios += `
      <div class="dia ${numero === hoje ? 'hoje' : ''}">
        <span>${nomes[numero]}${numero === hoje ? '<span class="badge-hoje">Hoje</span>' : ''}</span>
        <span>${aberto ? barbearia.abre + ':00 - ' + barbearia.fecha + ':00' : 'Fechado'}</span>
      </div>`;
  }
  pegar('lista-horarios').innerHTML = horarios +
    `<small class="suave">Pausa para almoço das ${barbearia.almocoInicio}h às ${barbearia.almocoFim}h</small>`;

  pegar('link-whats').href = 'https://wa.me/' + barbearia.whatsapp;
  pegar('link-whats').textContent = 'WhatsApp ' + barbearia.whatsappTexto;
  pegar('link-insta').href = 'https://instagram.com/' + barbearia.instagram;
  pegar('link-insta').textContent = '@' + barbearia.instagram;

  pegar('lista-pagamentos').innerHTML = dados.pagamentos.map(p => `<span class="chip">${p}</span>`).join('');
}

/* ---------- 8. Galeria: 3 fotos no topo + janela ampliada ---------- */
let fotoAtual = 0;
function montarGaleria() {
  const total = dados.galeria.length;
  let html = '';
  for (let i = 0; i < 3; i++) {
    const [arquivo, descricao] = dados.galeria[i];
    const maisFotos = (i === 2 && total > 3) ? `<div class="mais-fotos">+${total - 3} imagens</div>` : '';
    html += `<button data-i="${i}" aria-label="Ampliar: ${descricao}">${Monarca.foto(arquivo, descricao).replace('</div>', maisFotos + '</div>')}</button>`;
  }
  pegar('galeria-topo').innerHTML = html;
  pegar('galeria-topo').onclick = function (evento) {
    const botao = evento.target.closest('button');
    if (botao) abrirFoto(Number(botao.dataset.i));
  };

  const janela = pegar('lightbox');
  janela.querySelector('.ant').onclick = () => abrirFoto(fotoAtual - 1);
  janela.querySelector('.prox').onclick = () => abrirFoto(fotoAtual + 1);
  janela.onclick = evento => { if (evento.target === janela) janela.classList.remove('aberto'); };   // clique fora fecha
  document.addEventListener('keydown', function (evento) {
    if (!janela.classList.contains('aberto')) return;
    if (evento.key === 'Escape') janela.classList.remove('aberto');
    if (evento.key === 'ArrowLeft') abrirFoto(fotoAtual - 1);
    if (evento.key === 'ArrowRight') abrirFoto(fotoAtual + 1);
  });
}

function abrirFoto(indice) {
  const total = dados.galeria.length;
  fotoAtual = (indice + total) % total;            // volta ao início/fim da lista
  const [arquivo, descricao] = dados.galeria[fotoAtual];
  const janela = pegar('lightbox');
  janela.querySelector('.foto-box').innerHTML = `<img src="../IMG/${arquivo}" alt="${descricao}">`;
  janela.classList.add('aberto');
}

/* ---------- Chama tudo na ordem ---------- */
function iniciar() {
  pegar('btn-agendar').href = paginaAgendar;
  mostrarSelo();
  ativarAbas();
  montarServicos('todos');
  ativarFiltros();
  montarProfissionais();
  montarAvaliacoes();
  montarLateral();
  montarGaleria();
}
iniciar();
