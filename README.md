<h1>Projeto FactoryTrack/ SPRINT 01</h1>
A empresa fictícia MetalTech Indústria atua na fabricação de peças metálicas sob demanda. Atualmente, os pedidos são realizados presencialmente pelo setor comercial ou administrativo.
<h1> Sistema back-end </h1>
<p> Durante o processo de programação do Back-end, realizamos algumas alteraçoes (já que reutilizamos uma API de pizza)
envolvendo o armazenamento de dados e trocado alguns nome que tinham a mesma funcionalidade. Entre elas mudados: </p>
  <ul> Mesa -> Entrega </ul>
  <ul> Garçom -> Funcionario </ul>
  <ul> Pizza -> Metal </ul>
  <ul> Pedido -> Peça </ul>
  
<h2> Sprint 2 </h2>

<p>Este repositório contém a documentação, o progresso e a evolução da arquitetura do sistema funcional desenvolvido pela **COD** para a empresa fictícia **MetalTech**. O projeto foi projetado com foco em modernidade, escalabilidade, responsividade e alta experiência do usuário (UX), deixando a estrutura pronta para futuras expansões e integrações mobile.

## 📋 Índice

* [Visão Geral do Sistema](https://www.google.com/search?q=%23-vis%C3%A3o-geral-do-sistema)
* [Planejamento e Organização](https://www.google.com/search?q=%23-planejamento-e-organiza%C3%A7%C3%A3o)
* [Arquitetura e Telas do Sistema](https://www.google.com/search?q=%23-arquitetura-e-telas-do-sistema)
* [Desafios Enfrentados e Soluções na Sprint](https://www.google.com/search?q=%23-desafios-enfrentados-e-solu%C3%A7%C3%B5es-na-sprint)
* [Equipe (Membros da COD)](https://www.google.com/search?q=%23-equipe-membros-da-cod)

---

## 💻 Visão Geral do Sistema

A plataforma atua no gerenciamento administrativo, controle de pedidos e organização de dados da MetalTech. Sua estrutura de código foi padronizada e separada em pastas (`HTML`, `CSS`, `JS`), garantindo manutenibilidade e evolução do software de forma limpa.

---

## 🗺️ Planejamento e Organização

O fluxo de desenvolvimento seguiu metodologias ágeis e mapeamento técnico:

* **Gestão de Tarefas:** Criação de um quadro no **Trello** dividido em *"A Fazer", "Em Anamento"* e *"Entregue"*.
* **Documentação:** Elaboração do Termo de Abertura do Projeto (TAP), documento de requisitos e organograma.
* **Design UI/UX:** Prototipagem de alta fidelidade de todas as telas utilizando o **Figma**.

---

## 🏛️ Arquitetura e Telas do Sistema

### Back-end

Responsável por toda a inteligência do sistema (regras de negócio, autenticação de logins, validação de permissões e processamento de pedidos). A arquitetura foi preparada para integração futura com aplicações Web e Mobile via **APIs**.

### Front-end (Web & Mobile)

A interface adota uma identidade visual *premium*, utilizando um **tema escuro (dark mode)** com **detalhes em neon** e efeitos visuais foscos/minimalistas.

* **Landing Page:** Página institucional com apresentação da empresa, cards de serviços, área de feedbacks e botões de acesso.
* **Tela de Login / Criação de Conta:** Telas com visual *glassmorphism* (efeito fosco), validação de dados (nome, endereço, e-mail/telefone, senha) e botões de redes sociais.
* **Painel Administrativo:** Dashboard centralizado com *sidebar* lateral fixa, gráficos e cards de métricas (faturamento, clientes, transporte, etc.).
* **Tela de Pedidos:** Listagem com barra de pesquisa e indicadores de status baseados em cores (*Verde:* Concluído | *Laranja:* Pendente | *Vermelho:* Cancelado).
* **Versão Mobile:** Planejada e desenhada sob o conceito de **Responsividade (Media Queries no CSS)**, adaptando grids e fontes para smartphones e tablets.

---

## ⚠️ Desafios Enfrentados e Soluções na Sprint

> **Nota:** Durante o desenvolvimento desta sprint, a equipe enfrentou um imprevisto técnico crítico: uma queda de energia/desligamento do computador causou a perda de códigos não salvos, exigindo uma rápida mudança de prioridades para cumprir os prazos de entrega.

### 1. Integração com o Banco de Dados (Back-end)

* **Problema:** No início da sprint, as ações dos botões falhavam na comunicação entre front-end e back-end. Dados de cadastros não eram inseridos ou consultados corretamente. O botão de criação de conta exigia etapas externas, quebrando o propósito de sistema integrado.
* **Solução:** A equipe revisou a lógica de comunicação, reorganizou as funções de clique e garantiu rotinas síncronas de validação, envio e retorno dos dados. O botão de cadastro foi centralizado 100% dentro da plataforma.

### 2. Estilização e Fidelidade Visual (Front-end)

* **Problema:** Complexidade em transpor o design moderno/neon do Figma para o código CSS puro. Houve também limitações no uso da ferramenta *Live Share* (onde apenas o *host* tinha acesso ao *Go Live*).
* **Solução:** Realização de múltiplos testes iterativos de alinhamento, ajuste minucioso de componentes e uso intensivo de *media queries* para garantir que elementos complexos (como tabelas e a *sidebar*) quebrassem de forma fluida no mobile.

---

## 👥 Equipe (Membros da COD)

* 🧑‍💻 **Felipe Chagas Machado**
* 👩‍💻 **Giovanna Alves de Almeida**
* 👩‍💻 **Carina Cristina Teixeira de Souza**
* 🧑‍💻 **Gustavo Nunes da Silva**</p>
