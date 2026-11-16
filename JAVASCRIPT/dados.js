// Todos os dados fictícios ficam aqui. Para trocar telefone, preços etc., mexa só neste arquivo.
window.Monarca = window.Monarca || {};
Monarca.dados = {
  barbearia: {
    nome: 'Monarca Barber', whatsapp: '5583996986476', whatsappTexto: '(83) 99698-6476',
    instagram: 'peddro.lpz', endereco: 'R. Monsenhor José Coutinho, 469, Centro, Itapororoca - PB',
    // dias: 0 = domingo ... 6 = sábado. Aberto de terça (2) a sábado (6)
    diasAbertos: [1, 2, 3, 4, 5, 6], abre: 7, fecha: 20, almocoInicio: 12, almocoFim: 14
  },
  barbeiros: [
    { id: 1, nome: 'Pedro Henrique', foto: 'pedroh.jpg', especialidade: 'Cortes navalhados, sociais, barba, visagismo e desondulação' },
    { id: 2, nome: 'Arthur Oliveira', foto: 'arthuro.jpg', especialidade: 'Cortes Navalhados, sociais e barba' }
  ],
  servicos: [
    { id: 's1', nome: 'Corte Social', categoria: 'social', duracao: 40, preco: 40, img: 'social.jpg', desc: 'Corte clássico, alinhado e discreto.' },
    { id: 's2', nome: 'Social Clássico na Tesoura', categoria: 'social', duracao: 40, preco: 40, img: 'social2.jpg', desc: 'Acabamento feito inteiro na tesoura.' },
    { id: 's3', nome: 'Degradê Navalhado', categoria: 'navalhado', duracao: 45, preco: 50, img: 'navalhado.jpg', desc: 'Degradê com acabamento na navalha.' },
    { id: 's4', nome: 'Navalhado Total', categoria: 'navalhado', duracao: 45, preco: 40, img: 'navalhado-militar.jpg', desc: 'Corte todo na navalha, com contorno.' },
    { id: 's5', nome: 'Barba Completa', categoria: 'barba', duracao: 15, preco: 35, img: 'barba.jpg', desc: 'Barba modelada e toalha quente para relaxar.' },
    { id: 's6', nome: 'Sobrancelha', categoria: 'barba', duracao: 4, preco: 8, img: 'sobrancelha.jpg', desc: 'Limpeza e alinhamento.' },
    { id: 's7', nome: 'Combo Social + Barba', categoria: 'social', duracao: 70, preco: 70, img: 'social-barba.jpg', desc: 'Corte social e barba completa.' },
    { id: 's8', nome: 'Combo Navalhado + Barba', categoria: 'navalhado', duracao: 80, preco: 70, img: 'navalhado-barba.jpg', desc: 'Corte navalhado e barba completa.' },
    { id: 's9', nome: 'Desondulação', categoria: 'social', duracao: 120, preco: 70, img: 'desondulação.jpg', desc: 'Solta as ondas, reduz o frizz e facilita o penteado.'}
  ],
  avaliacoes: [
    { id: 'a1', nome: 'Lucas M.', nota: 5, comentario: 'Melhor degradê da cidade, atendimento nota 10.', data: '2026-09-12' },
    { id: 'a2', nome: 'Pedro S.', nota: 5, comentario: 'Agendei pelo site e não perdi viagem.', data: '2026-09-20' },
    { id: 'a3', nome: 'Carlos E.', nota: 4, comentario: 'Ótimo corte, ambiente muito bom.', data: '2026-09-28' },
    { id: 'a4', nome: 'João V.', nota: 5, comentario: 'A barba com toalha quente é show.', data: '2026-10-02' },
    { id: 'a5', nome: 'Mateus R.', nota: 4, comentario: 'Pontual e caprichoso.', data: '2026-10-10' },
    { id: 'a6', nome: 'André L.', nota: 3, comentario: 'Bom, mas tive que esperar uns minutos.', data: '2026-10-18' }
  ],
  galeria: [
    ['fachada.jpg', 'Fachada da Monarca Barber'], ['barbearia.jpg', 'Interior da barbearia'],
    ['barbeiro.jpg', 'Barbeiro cortando o cabelo de um cliente'], ['barbeiro2.jpg', 'barbeiro no meio do trabalho'],
    ['cadeira.jpg', 'Cadeira de barbeiro'], ['navalha.jpg', 'Detalhe da navalha']
  ]
};
// Moldura de foto. A imagem fica em IMG/; se o arquivo não existir, a moldura fica vazia (veja tema.js)
Monarca.foto = (arquivo, descricao) =>
  '<div class="foto-box"><img src="../IMG/' + arquivo + '" alt="' + descricao + '" loading="lazy"></div>';
// Formas de pagamento mostradas no cartão lateral
Monarca.dados.pagamentos = ['Dinheiro', 'Pix', 'Débito à vista', 'Crédito à vista', 'Crédito parcelado'];
