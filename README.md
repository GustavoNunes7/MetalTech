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
<h2>Sprint 03</h2>
# ⚙️ FactoryTrack — Sistema de Gestão de Ordens de Produção

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado%20%28Sprint%203%29-success?style=for-the-badge)
![Escopo](https://img.shields.io/badge/Ambiente-Web-blue?style=for-the-badge)
![Segmento](https://img.shields.io/badge/Ind%C3%BAstria-Metal%C3%Bargica-orange?style=for-the-badge)

O **FactoryTrack** é uma solução digital desenvolvida para sanar os dilemas operacionais e administrativos de uma empresa metalúrgica. O sistema substitui o modelo de gestão obsoleto baseado em anotações manuais e ordens de produção físicas em papel — propensas a perdas e atrasos — por uma plataforma robusta, integrada e focada na experiência do usuário.

🔗 **Link do Repositório Oficial:** [MetalTech no GitHub](https://github.com/GustavoNunes7/MetalTech.git)

---

## 🎯 Objetivo do Projeto
O sistema tem como meta modernizar o fluxo de trabalho industrial, organizando e centralizando informações de pedidos e produção. A arquitetura foi projetada visando escalabilidade e facilidade de manutenção, servindo como uma fundação estável para futuras expansões modulares.

## 📐 Arquitetura e Organização Geral
A estrutura do projeto foi planejada englobando a integração das seguintes verticais técnicas:
* **Back-end:** Camada responsável pela inteligência de negócio, segurança, persistência e comunicação entre servidores.
* **Front-end / Sistema Web:** Interface do usuário voltada ao setor administrativo e gerenciamento do chão de fábrica.
* **Lógica Multi-Contas:** Sistema capaz de gerenciar e aceitar múltiplos perfis e contas independentes com segurança.

---

## 🚀 Evolução Histórica (Sprint 2 vs. Sprint 3)
Durante o ciclo final de desenvolvimento (Sprint 3), o foco principal foi a correção de instabilidades críticas e a ativação de fluxos de dados essenciais que apresentavam falhas na etapa anterior.

| Funcionalidade / Fluxo | Estado na Sprint 2 | Solução / Resultado na Sprint 3 |
| :--- | :--- | :--- |
| **Fluxo de Telas de Cadastro** | Travado. Botões de `Novo Pedido`, `Adicionar` e `Alterar` não exibiam as áreas de entrada de dados. | **Corrigido.** Varredura completa realizada, restabelecendo o fluxo visual e o envio correto de registros. |
| **Catálogo de Produtos** | Apresentava falhas na comunicação e inatividade. | **Ativo.** Integração concluída, operando como catálogo dinâmico de itens. |
| **Sincronização de Novos Pedidos** | Falha de exibição e comunicação interna inadequada. | **Normalizado.** Exibição em tempo real otimizada sem perda de integridade dos dados. |

---

## 🛠️ Desafios Técnicos Enfrentados
O processo de desenvolvimento exigiu esforço técnico contínuo e maturidade no gerenciamento de escopo por parte da equipe:

1.  **Engenharia Reversa de Código Legado:** O projeto partiu de uma base de código preexistente. A equipe dedicou a fase inicial para decifrar a lógica construída e adaptá-la às novas diretrizes do sistema.
2.  **Gerenciamento Estilístico (CSS):** Conflitos de estilo causavam travamento de rotinas JavaScript prontas, gerando loops infinitos de carregamento de páginas ou quebras nos botões. A folha de estilos foi higienizada para estabilizar o comportamento da interface.
3.  **Comunicação Servidor-Servidor:** Aprender e implementar na prática arquiteturas complexas de autenticação, lógica multiusuário e tráfego de dados autônomo.
4.  **Escopo e Pragmatismo (Módulo Mobile):** Como o desenvolvimento mobile demandaria a criação de conceitos do zero, a equipe optou estrategicamente por postergá-lo, focando todos os esforços na estabilidade e entrega de excelência da plataforma Web.

---

## 💡 Lições Aprendidas
O desenvolvimento do FactoryTrack funcionou como um laboratório prático para o mercado de trabalho real, trazendo ensinamentos essenciais:
* **Resiliência e Inteligência Emocional:** Gerenciamento do estresse, cansaço e pressão psicológica decorrentes do cumprimento de prazos rígidos.
* **Trabalho em Equipe:** Entendimento de que cada colaborador possui seu próprio ritmo produtivo e que a chave para o sucesso coletivo reside no diálogo transparente.
* **Autonomia Técnica:** Capacidade de buscar soluções independentes na internet para implementar recursos de programação não ministrados em sala de aula.

---

## 🔮 Sugestões e Visão de Futuro
Com o encerramento bem-sucedido do ecossistema fabril, abrem-se novos horizontes para o uso prático dessa tecnologia:
* **Automação Repetitiva:** Direcionar sistemas futuros para mitigação da sobrecarga humana por meio de rotinas automatizadas e mais leves.
* **Impacto Social em Gestão Escolar:** Adaptar a inteligência do FactoryTrack para colégios, secretarias e salas de aula, eliminando a alta burocracia de papéis manuais e devolvendo tempo livre para que os educadores foquem exclusivamente no ensino.

---

## 🏁 Como Executar este Projeto

```bash
# 1. Clone este repositório
git clone [https://github.com/GustavoNunes7/MetalTech.git](https://github.com/GustavoNunes7/MetalTech.git)

# 2. Acesse a pasta do projeto
cd MetalTech

# 3. Instale as dependências correspondentes
# (Insira aqui os comandos de instalação de dependências do seu ecossistema, ex: npm install ou pip install)

# 4. Inicie o servidor localmente
# (Insira aqui o comando para rodar o app, ex: npm start ou python main.py)
```python
html_content = """
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>README - FactoryTrack</title>
    <style>
        @page {
            size: A4;
            margin: 18mm 15mm;
            background-color: #ffffff;
            @bottom-right {
                content: counter(page);
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 9pt;
                color: #8c92ac;
            }
            @bottom-left {
                content: "FactoryTrack — README do Repositório";
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                font-size: 9pt;
                color: #8c92ac;
            }
        }
        
        body {
            margin: 0;
            padding: 0;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #24292e;
            font-size: 10.5pt;
            line-height: 1.35;
            background-color: #ffffff;
        }

        .header-banner {
            margin: -18mm -15mm 25px -15mm;
            padding: 30px 15mm;
            background-color: #0d1117;
            color: #ffffff;
            border-bottom: 4px solid #1f6feb;
        }

        h1 {
            font-size: 20pt;
            margin: 0 0 8px 0;
            color: #ffffff;
            font-weight: 600;
        }

        .repo-link {
            font-size: 10pt;
            color: #58a6ff;
            text-decoration: none;
            font-family: monospace;
        }

        h2 {
            font-size: 13.5pt;
            color: #0d1117;
            border-left: 4px solid #1f6feb;
            padding-left: 10px;
            margin-top: 25px;
            margin-bottom: 12px;
            font-weight: 600;
            page-break-after: avoid;
        }

        h3 {
            font-size: 11pt;
            color: #24292e;
            margin-top: 15px;
            margin-bottom: 6px;
            font-weight: 600;
            page-break-after: avoid;
        }

        p {
            margin: 0 0 12px 0;
            text-align: justify;
        }

        ul, ol {
            margin: 0 0 14px 0;
            padding-left: 20px;
        }

        li {
            margin-bottom: 6px;
            text-align: justify;
        }

        .badge-container {
            margin-bottom: 15px;
        }

        .badge {
            display: inline-block;
            background-color: #f1f2f4;
            color: #24292e;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 8.5pt;
            font-weight: bold;
            margin-right: 5px;
            border: 1px solid #d0d7de;
        }

        .badge-tech {
            background-color: #ddf4ff;
            color: #0969da;
            border-color: #54aeff;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }

        th {
            background-color: #f6f8fa;
            color: #24292e;
            font-weight: 600;
            border: 1px solid #d0d7de;
            padding: 8px 12px;
            text-align: left;
            font-size: 9.5pt;
        }

        td {
            border: 1px solid #d0d7de;
            padding: 8px 12px;
            text-align: left;
            font-size: 9.5pt;
            vertical-align: top;
        }

        tr:nth-child(even) {
            background-color: #fafbfc;
        }

        .alert-box {
            background-color: #fff8c5;
            border-left: 4px solid #d4a72c;
            padding: 12px;
            margin: 15px 0;
            border-radius: 0 4px 4px 0;
            page-break-inside: avoid;
        }

        .alert-box p {
            margin: 0;
            color: #4d3800;
            font-size: 9.5pt;
        }

        code {
            font-family: 'Courier New', Courier, monospace;
            background-color: #afb8c133;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 9pt;
        }

        pre {
            font-family: 'Courier New', Courier, monospace;
            background-color: #f6f8fa;
            padding: 12px;
            border-radius: 6px;
            border: 1px solid #d0d7de;
            font-size: 9pt;
            overflow: hidden;
            margin: 12px 0;
            page-break-inside: avoid;
        }
    </style>
</head>
<body>

    <div class="header-banner">
        <h1>⚙️ FactoryTrack</h1>
        <div class="repo-link">📦 https://github.com/GustavoNunes7/MetalTech.git</div>
    </div>

    <div class="badge-container">
        <span class="badge">Sprint 3 (Finalizado)</span>
        <span class="badge badge-tech">Web System</span>
        <span class="badge badge-tech">Back-end API</span>
        <span class="badge badge-tech">Front-end</span>
        <span class="badge">Metalurgia</span>
    </div>

    <p>O <strong>FactoryTrack</strong> é um Sistema de Gestão de Ordens de Produção desenvolvido especificamente para suprir as necessidades de modernização de uma empresa metalúrgica. O projeto surgiu para solucionar falhas administrativas severas decorrentes do uso exclusivo de recursos manuais, onde o fluxo de ordens de produção impressas ou anotadas em papel gerava atrasos, extravios e sérios gargalos operacionais no chão de fábrica.</p>

    <h2>🎯 Objetivo Geral</h2>
    <p>Transitar o modelo de gestão obsoleto e manual da indústria metalúrgica para uma arquitetura digital integrada, centralizada e escalável. O foco principal está na melhoria da experiência do usuário, organização de informações e estruturação do código preparada para expansões futuras (como integração nativa com dispositivos móveis).</p>

    <h2>📐 Arquitetura do Sistema</h2>
    <p>O ecossistema do FactoryTrack foi estruturado em camadas independentes para garantir a modularidade e a manutenibilidade do código:</p>
    <ul>
        <li><strong>Back-end:</strong> API estruturada para gerenciamento de dados, comunicação entre servidores e regras de negócio da fábrica.</li>
        <li><strong>Front-end / Sistema Web:</strong> Interface administrativa moderna voltada para o controle de pedidos, gerenciamento de usuários e acompanhamento da produção em tempo real.</li>
        <li><strong>Estrutura Multi-Conta:</strong> Lógica integrada para suporte a múltiplos usuários simultâneos, permitindo acessos restritos e segurança nos perfis.</li>
    </ul>

    <h2>🚀 Evolução: Sprint 2 vs. Sprint 3</h2>
    <p>A transição para a etapa final (Sprint 3) concentrou-se na resolução de instabilidades críticas identificadas na Sprint 2 e no aprimoramento da comunicação global da plataforma:</p>
    
    <table>
        <thead>
            <tr>
                <th style="width: 30%;">Funcionalidade</th>
                <th style="width: 35%;">Status na Sprint 2</th>
                <th style="width: 35%;">Melhoria Implementada na Sprint 3</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Fluxo de Pedidos</strong></td>
                <td>Botões de <code>Novo Pedido</code>, <code>Adicionar</code> e <code>Alterar</code> quebrados por falhas no fluxo de telas.</td>
                <td>Varredura de código completa e correção da exibição da área de cadastro de informações.</td>
            </tr>
            <tr>
                <td><strong>Catálogo Ativo</strong></td>
                <td>Inativo ou apresentando falhas crônicas de renderização externa.</td>
                <td>Ativação e comunicação normalizada com a listagem atualizada de produtos.</td>
            </tr>
            <tr>
                <td><strong>Sincronização</strong></td>
                <td>Novos pedidos não eram listados ou geravam loopings visuais na página.</td>
                <td>Otimização da comunicação servidor-servidor e consistência dos dados em tempo real.</td>
            </tr>
        </tbody>
    </table>

    <h2>🛠️ Desafios Técnicos e Soluções</h2>
    <ol>
        <li><strong>Engenharia Reversa de Código Base:</strong> A equipe iniciou o projeto com uma estrutura pré-existente. Foi necessário decifrar a lógica legada antes de adaptá-la e adicionar as novas regras de negócio.</li>
        <li><strong>Conflitos Estilísticos (CSS):</strong> Divergências de escopo na estilização causavam loopings de carregamento e travavam a execução de funções Javascript prontas. A folha de estilos foi tratada e isolada para estabilização dos componentes visuais.</li>
        <li><strong>Gerenciamento de Escopo (Módulo Mobile):</strong> Visando assegurar a integridade e a entrega da plataforma web com máxima estabilidade, a equipe optou estrategicamente por postergar o desenvolvimento do app mobile nativo do zero.</li>
    </ol>

    <div class="alert-box">
        <p><strong>💡 Lição Prática de Mercado:</strong> O desenvolvimento do FactoryTrack simulou rigorosamente a realidade do mercado de trabalho, exigindo resiliência contra prazos rígidos, autonomia no estudo de ferramentas inéditas fora da sala de aula e alinhamento constante em equipe para balancear o ritmo individual de cada integrante.</p>
    </div>

    <h2>🔮 Perspectivas e Visão de Futuro</h2>
    <ul>
        <li><strong>Automação de Processos:</strong> Reduzir tarefas humanas repetitivas no ambiente industrial, mitigando gargalos e acúmulo de funções operacionais.</li>
        <li><strong>Expansão de Impacto Social (Gestão Escolar):</strong> Aplicar o ecossistema tecnológico do FactoryTrack na burocracia escolar (secretarias e salas de aula), desonerando o corpo docente para focar estritamente no ensino e no cuidado dos alunos.</li>
    </ul>

    <h2>💻 Como Executar o Projeto</h2>
    
    <h3>Pré-requisitos</h3>
    <p>Certifique-se de possuir instalado em sua máquina as ferramentas básicas de desenvolvimento (como runtime correspondente ao backend e gerenciador de pacotes apropriado).</p>

    <h3>Instalação</h3>
    <pre># 1. Clone o repositório
git clone https://github.com/GustavoNunes7/MetalTech.git

# 2. Acesse o diretório do projeto
cd MetalTech

# 3. Instale as dependências estruturais do sistema
# (Execute os comandos de instalação conforme o ecossistema do código)</pre>

</body>
</html>
"""

from weasyprint import HTML
input_path = "readme_factorytrack.html"
output_path = "README_FactoryTrack.pdf"

with open(input_path, "w", encoding="utf-8") as f:
    f.write(html_content)

HTML(filename=input_path).write_pdf(output_path)
print("PDF gerado com sucesso!")



```

```text
PDF gerado com sucesso!


```
---


```markdown
# ⚙️ FactoryTrack — Sistema de Gestão de Ordens de Produção

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado%20%28Sprint%203%29-success?style=for-the-badge)
![Escopo](https://img.shields.io/badge/Ambiente-Web-blue?style=for-the-badge)
![Segmento](https://img.shields.io/badge/Ind%C3%BAstria-Metal%C3%Bargica-orange?style=for-the-badge)

O **FactoryTrack** é uma solução digital desenvolvida para sanar os dilemas operacionais e administrativos de uma empresa metalúrgica. O sistema substitui o modelo de gestão obsoleto baseado em anotações manuais e ordens de produção físicas em papel — propensas a perdas e atrasos — por uma plataforma robusta, integrada e focada na experiência do usuário.

🔗 **Link do Repositório Oficial:** [MetalTech no GitHub](https://github.com/GustavoNunes7/MetalTech.git)

---

## 🎯 Objetivo do Projeto
O sistema tem como meta modernizar o fluxo de trabalho industrial, organizando e centralizando informações de pedidos e produção. A arquitetura foi projetada visando escalabilidade e facilidade de manutenção, servindo como uma fundação estável para futuras expansões modulares.

## 📐 Arquitetura e Organização Geral
A estrutura do projeto foi planejada englobando a integração das seguintes verticais técnicas:
* **Back-end:** Camada responsável pela inteligência de negócio, segurança, persistência e comunicação entre servidores.
* **Front-end / Sistema Web:** Interface do usuário voltada ao setor administrativo e gerenciamento do chão de fábrica.
* **Lógica Multi-Contas:** Sistema capaz de gerenciar e aceitar múltiplos perfis e contas independentes com segurança.

---

## 🚀 Evolução Histórica (Sprint 2 vs. Sprint 3)
Durante o ciclo final de desenvolvimento (Sprint 3), o foco principal foi a correção de instabilidades críticas e a ativação de fluxos de dados essenciais que apresentavam falhas na etapa anterior.

| Funcionalidade / Fluxo | Estado na Sprint 2 | Solução / Resultado na Sprint 3 |
| :--- | :--- | :--- |
| **Fluxo de Telas de Cadastro** | Travado. Botões de `Novo Pedido`, `Adicionar` e `Alterar` não exibiam as áreas de entrada de dados. | **Corrigido.** Varredura completa realizada, restabelecendo o fluxo visual e o envio correto de registros. |
| **Catálogo de Produtos** | Apresentava falhas na comunicação e inatividade. | **Ativo.** Integração concluída, operando como catálogo dinâmico de itens. |
| **Sincronização de Novos Pedidos** | Falha de exibição e comunicação interna inadequada. | **Normalizado.** Exibição em tempo real otimizada sem perda de integridade dos dados. |

---

## 🛠️ Desafios Técnicos Enfrentados
O processo de desenvolvimento exigiu esforço técnico contínuo e maturidade no gerenciamento de escopo por parte da equipe:

1.  **Engenharia Reversa de Código Legado:** O projeto partiu de uma base de código preexistente. A equipe dedicou a fase inicial para decifrar a lógica construída e adaptá-la às novas diretrizes do sistema.
2.  **Gerenciamento Estilístico (CSS):** Conflitos de estilo causavam travamento de rotinas JavaScript prontas, gerando loops infinitos de carregamento de páginas ou quebras nos botões. A folha de estilos foi higienizada para estabilizar o comportamento da interface.
3.  **Comunicação Servidor-Servidor:** Aprender e implementar na prática arquiteturas complexas de autenticação, lógica multiusuário e tráfego de dados autônomo.
4.  **Escopo e Pragmatismo (Módulo Mobile):** Como o desenvolvimento mobile demandaria a criação de conceitos do zero, a equipe optou estrategicamente por postergá-lo, focando todos os esforços na estabilidade e entrega de excelência da plataforma Web.

---

## 💡 Lições Aprendidas
O desenvolvimento do FactoryTrack funcionou como um laboratório prático para o mercado de trabalho real, trazendo ensinamentos essenciais:
* **Resiliência e Inteligência Emocional:** Gerenciamento do estresse, cansaço e pressão psicológica decorrentes do cumprimento de prazos rígidos.
* **Trabalho em Equipe:** Entendimento de que cada colaborador possui seu próprio ritmo produtivo e que a chave para o sucesso coletivo reside no diálogo transparente.
* **Autonomia Técnica:** Capacidade de buscar soluções independentes na internet para implementar recursos de programação não ministrados em sala de aula.

---

## 🔮 Sugestões e Visão de Futuro
Com o encerramento bem-sucedido do ecossistema fabril, abrem-se novos horizontes para o uso prático dessa tecnologia:
* **Automação Repetitiva:** Direcionar sistemas futuros para mitigação da sobrecarga humana por meio de rotinas automatizadas e mais leves.
* **Impacto Social em Gestão Escolar:** Adaptar a inteligência do FactoryTrack para colégios, secretarias e salas de aula, eliminando a alta burocracia de papéis manuais e devolvendo tempo livre para que os educadores foquem exclusivamente no ensino.

---

## 🏁 Como Executar este Projeto

```bash
# 1. Clone este repositório
git clone [https://github.com/GustavoNunes7/MetalTech.git](https://github.com/GustavoNunes7/MetalTech.git)

# 2. Acesse a pasta do projeto
cd MetalTech

# 3. Instale as dependências correspondentes
# (Insira aqui os comandos de instalação de dependências do seu ecossistema, ex: npm install ou pip install)

# 4. Inicie o servidor localmente
# (Insira aqui o comando para rodar o app, ex: npm start ou python main.py)

```

## 👥 Equipe (Membros da COD)

* 🧑‍💻 **Felipe Chagas Machado**
* 👩‍💻 **Giovanna Alves de Almeida**
* 👩‍💻 **Carina Cristina Teixeira de Souza**
* 🧑‍💻 **Gustavo Nunes da Silva**</p>
