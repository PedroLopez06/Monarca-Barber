# Monarca Barber

Site de agendamento para uma barbearia. Projeto final da disciplina de Front-end.

- **Autor:** Pedro Henrique
- **Curso:** Ciência da Computação, Unipê (João Pessoa - PB)

## Sobre o projeto

O problema: o barbeiro fica com as mãos ocupadas e não consegue responder mensagens. O cliente espera sem resposta ou vai até o local e não encontra vaga.

A solução: o site mostra **apenas horários livres** e o cliente agenda na hora, sem esperar resposta. O agendamento é confirmado pelo WhatsApp, com a mensagem já escrita.

## O que o site faz

**Tela inicial (`index.html`)**
- Cabeçalho da barbearia com nota média das avaliações e botão "Agendar agora".
- Selo com o próximo horário livre, calculado na hora.
- Galeria com 3 fotos e janela de foto ampliada (setas, tecla ESC e clique fora).
- Abas: Serviços (com filtro por categoria), Profissionais, Avaliações e Sobre.
- Cartão lateral com localização (botão que abre o Google Maps), horários de atendimento com a etiqueta "Hoje", contato (WhatsApp e Instagram) e formas de pagamento.
- Tema claro e escuro, lembrado entre as visitas.

**Login e cadastro (`login.html`)**
- Duas abas (Entrar e Cadastrar) com validação campo a campo.
- Máscara de telefone, botão de mostrar/ocultar senha e e-mail sem repetição.
- Senha guardada apenas como hash SHA-256.

**Agendar (`agendar.html`)**
- Escolha de um ou mais serviços, do barbeiro (ou "Qualquer profissional"), da data (próximos 30 dias) e do horário.
- Horários de 30 em 30 minutos. Ficam desabilitados: horários ocupados, passados, no almoço, fora do expediente e em dias fechados.
- Um serviço longo ocupa vários blocos de 30 minutos, e o horário só aparece se todos estiverem livres.
- O horário é conferido de novo na hora de confirmar.
- Depois de confirmar, o cliente vai para a aba **Confirmar** da tela de agendamentos.

**Meus agendamentos (`agendamentos.html`)**
- Aba **Confirmar**: agendamentos feitos, com código (formato `MB-4821`), botão para confirmar pelo WhatsApp e botão de cancelar (permitido até 2 horas antes).
- Aba **Concluídos**: atendimentos já realizados, com data, serviços, valor e barbeiro, mais o total de cortes e o total gasto.

## Como abrir

1. No VSCode, abra a pasta que contém `HTML`, `CSS`, `JAVASCRIPT` e `IMG` (**File > Open Folder**). Abrir só a pasta `HTML` quebra os caminhos.
2. Clique com o botão direito em `HTML/index.html` e escolha **Open with Live Server**.
3. O endereço deve ser `127.0.0.1:5500/HTML/index.html`.

As fontes vêm do Google Fonts, então é preciso internet para elas aparecerem. Sem internet, o site funciona com fontes reserva.

## Estrutura de pastas

```
monarca-barber/
├── HTML/
│   ├── index.html          tela inicial
│   ├── login.html          entrar e cadastrar
│   ├── agendar.html        escolha de serviço, barbeiro, data e horário
│   ├── agendamentos.html   abas Confirmar e Concluídos
│   └── perfil.html         em construção
├── CSS/
│   ├── base.css            cores (variáveis), reset, textos e formulários
│   ├── componentes.css     botões, topo, fotos e barra de baixo
│   └── paginas.css         estilos de cada tela
├── JAVASCRIPT/
│   ├── tema.js             tema claro/escuro (roda no <head>)
│   ├── armazenamento.js    ler/salvar no navegador e funções de uso geral
│   ├── dados.js            dados do site (serviços, horários, contato...)
│   ├── auth.js             hash da senha, cadastro e login
│   ├── topo.js             cria o cabeçalho e protege as páginas restritas
│   ├── nav.js              cria a barra de baixo (Início, Agendamentos, Perfil)
│   ├── home.js             preenche a tela inicial
│   ├── login.js            validação e envio dos formulários
│   ├── agenda.js           regras de horários e conflitos
│   ├── agendar.js          tela de agendar
│   └── agendamentos.js     tela de agendamentos
└── IMG/                    fotos do site (veja abaixo)
```

## Como o código está organizado

- **HTML:** o esqueleto. Muitas caixas começam vazias e têm um `id`.
- **CSS:** a aparência. As cores ficam em variáveis no começo do `base.css`, e o tema claro só troca os valores delas.
- **JavaScript:** o comportamento. Cada arquivo cuida de uma coisa, e as funções ficam dentro do objeto global `Monarca` (os arquivos não usam `import`, para o site abrir sem servidor). A ordem dos `<script>` importa: `armazenamento.js` vem primeiro, `dados.js` em seguida e o arquivo da própria página por último.

Conceitos de JavaScript usados: variáveis, `if/else`, funções, arrays e laço `for`, DOM (`getElementById`, `innerHTML`, `textContent`), eventos de clique e `localStorage`.

## Onde os dados ficam guardados

Não há banco de dados nem servidor: tudo fica no **localStorage** do navegador.

| Chave | O que guarda |
|---|---|
| `monarca_users` | contas cadastradas (senha como hash) |
| `monarca_session` | quem está logado |
| `monarca_appointments` | todos os agendamentos |
| `monarca_theme` | tema escolhido (claro ou escuro) |
| `monarca_seeded` | marca de que o histórico de exemplo já foi criado |

Para ver ou apagar: `F12` > aba **Application** > **Local Storage**.

## Como trocar os dados

Quase tudo fica em `JAVASCRIPT/dados.js`:

- **WhatsApp:** `whatsapp` (só números, com `55` e DDD, para o link) e `whatsappTexto` (como aparece na tela). Troque os dois.
- **Instagram e endereço:** `instagram` (sem o `@`) e `endereco`.
- **Horário de funcionamento:** `abre`, `fecha`, `almocoInicio`, `almocoFim` e `diasAbertos` (0 = domingo ... 6 = sábado).
- **Serviços, barbeiros, avaliações e formas de pagamento:** as listas `servicos`, `barbeiros`, `avaliacoes` e `pagamentos`.

O endereço do rodapé está escrito direto no `index.html`: se mudar o endereço, mude lá também.


## Limitações

- Como os dados ficam no navegador, **cada navegador e cada aparelho tem a sua própria agenda**. Dois clientes em aparelhos diferentes não veem os horários um do outro. Um sistema de verdade precisaria de servidor e banco de dados compartilhado.
- O login é uma **simulação**: tudo roda no navegador e pode ser visto e alterado por quem abrir as ferramentas do desenvolvedor. Não é segurança real.
- O selo de "próximo horário livre" da tela inicial considera só o expediente e o almoço, e não os agendamentos já feitos.
- Nenhum agendamento muda para "concluído" sozinho: sem o painel do administrador, só o usuário de teste tem atendimentos concluídos.
