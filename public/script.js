const API = "/api";

let cMetais = [];
let cClientes = [];
let carrinhoCliente = [];

let TOKEN = localStorage.getItem("pz_token") || "";
let USUARIO_LOGADO = JSON.parse(localStorage.getItem("pz_usuario") || "null");
let entregaEmFechamento = null;
//essas linhas a cima criam boa parte das variaveis

//esse inicio é sobre o login
async function fazerLogin() {
  const email = document.getElementById("l-email").value.trim();
  const senha = document.getElementById("l-senha").value;
  const btn = document.getElementById("btn-login");
  const erro = document.getElementById("login-erro");

  //valida senha
  if (!email || !senha) {
    erro.style.display = "block";
    erro.textContent = "Preencha e-mail e senha.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Entrando...";
  erro.style.display = "none";

  try {
    const res = await fetch(API + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || "Credenciais inválidas");

    TOKEN = data.token;
    USUARIO_LOGADO = data.usuario;
    localStorage.setItem("pz_token", TOKEN);
    localStorage.setItem("pz_usuario", JSON.stringify(data.usuario));

    aplicarPerfil(data.usuario);
    document.body.classList.add("logado");
  } catch (e) {
    erro.style.display = "block";
    erro.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = "Entrar";
  }
}

//limpa o status de armazenamento
function sair() {
  TOKEN = "";
  USUARIO_LOGADO = null;
  localStorage.removeItem("pz_token");
  localStorage.removeItem("pz_usuario");
  document.body.classList.remove("logado");
  document.getElementById("l-senha").value = "";
}

//ativa o usuario quando loga
if (TOKEN && USUARIO_LOGADO) {
  aplicarPerfil(USUARIO_LOGADO);
  document.body.classList.add("logado");
}

//adiicona uma classe para exebição

function toast(msg, tipo = "ok") {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.className = `show ${tipo}`;
  setTimeout(() => (el.className = ""), 3000);
}

//essas duas linhas adicionam ou removem itens do html, isso é usado para mudar a tela da pagina para a nova pagina do usuario
function abrir(id) {
  document.getElementById(id).classList.add("open");
}
function fechar(id) {
  document.getElementById(id).classList.remove("open");
}

document.querySelectorAll(".modal-bg").forEach((bg) =>
  bg.addEventListener("click", (e) => {
    if (e.target === bg) bg.classList.remove("open");
  }),
);

function R$(v) {
  return (
    "R$ " +
    Number(v || 0)
      .toFixed(2)
      .replace(".", ",")
  );
}
function nomeCategoria(cat) {
  const categorias = {
    aco: "Aço",
    cobre: "Cobre",
    aluminio: "Alumínio",
    ferro: "Ferro",
  };

  return categorias[cat] || cat;
}

//atualiza o status do pedido, dizendo se ja tão fazendo, entregando, etc
function badge(s) {
  const r = {
    recebido: "📥 Recebido",
    em_preparo: "👨‍🍳 Em Preparo",
    saiu_entrega: "🛵 Saiu p/ Entrega",
    entregue: "✅ Entregue",
    cancelado: "❌ Cancelado",
  };
  return `<span class="badge b-${s}">${r[s] || s}</span>`;
}

//para casos de erros
async function api(method, url, body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API + url, opts);
  const data = await res.json();
  //caso de erro de conecção
  if (res.status === 401) {
    sair();
    throw new Error("Sessão expirada");
  }
  if (!res.ok) throw new Error(data.erro || "Erro na requisição");
  return data;
}

//permições ao tipo de perfil usuario
function aplicarPerfil(usuario) {
  document.getElementById("sb-nome").textContent = usuario.nome;
  document.getElementById("sb-perfil").textContent = usuario.perfil;

  const perfil = usuario.perfil;
  const isAdmin = perfil === "Administrador";
  const isGar = perfil === "Entregador";
  const isCliente = perfil === "Cliente";

  function show(id, visible, type = "flex") {
    const el = document.getElementById(id);
    if (el) el.style.display = visible ? type : "none";
  }

  function showEl(el, visible, type = "flex") {
    if (el) el.style.display = visible ? type : "none";
  }

  show("menu-usuarios", isAdmin, "block");
  if (isCliente) {

  document
    .querySelector('[onclick*="dashboard"]')
    ?.remove();

  document
    .querySelector('[onclick*="pedidos"]')
    ?.remove();

  document
    .querySelector('[onclick*="clientes"]')
    ?.remove();

  document
    .querySelector('[onclick*="usuarios"]')
    ?.remove();

  document
    .querySelector('[onclick*="entregas"]')
    ?.remove();

  const lbl = document.getElementById("nav-metais-label");

  if (lbl) {
    lbl.textContent = "Catálogo";
  }

  carregarCatalogoCliente();
  carregarMeusPedidos();
}
  show("btn-usuarios", isAdmin, "flex");
  show("sb-group-entregador", isGar, "block");
  show("btn-nav-entregas", isGar, "flex");

  showEl(document.querySelector('[onclick*="clientes"]'), !isGar);
  showEl(document.querySelector('[onclick*="pedidos"]'), !isGar);
  showEl(document.querySelector('[onclick*="dashboard"]'), !isGar);
  showEl(document.querySelector(".sb-group"), !isGar, "block");

  const labelMetais = document.getElementById("nav-metais-label");

  if (labelMetais) labelMetais.textContent = isGar ? "Cátalogo" : "Metais";

  const tituloMetais = document.getElementById("pg-metais-titulo");
  const subMetais = document.getElementById("pg-metais-sub");
  if (tituloMetais) tituloMetais.textContent = isGar ? "Cátalogo" : "Metais";
  if (subMetais)
    subMetais.textContent = isGar
      ? "Metais disponíveis hoje"
      : "Gerencie o cátalago";
  show("btn-novo-metais", !isGar, "inline-flex");

  show("stat-fat", !isGar, "block");
  show("stat-cli", !isGar, "block");

  // livres ou não entregas
  if (isCliente) {
    ir("metais");
  } else if (isGar) {
    ir("entregas", document.getElementById("btn-nav-entregas"));
  } else {
    ir("dashboard", document.querySelector('[onclick*="dashboard"]'));
  }
}

//exibe os pedidos em uma interface mais "bonita" para o usuario
async function carregarEntregas(entregaFiltro = null) {
  const grid = document.getElementById("grid-entregas");
  grid.innerHTML =
    '<div class="spin-wrap"><div class="spin"></div> Carregando...</div>';

  const subtitulo = document.getElementById("entregas-sub");

  if (subtitulo) {
    subtitulo.textContent = `Olá, ${USUARIO_LOGADO?.nome}! Seus pedidos ativos.`;
  }

  try {
    const url = `/pedidos?entregador=${USUARIO_LOGADO.id}`;
    const pedidos = await api("GET", url);

    const ativos = pedidos.filter(
      (p) => !["entregue", "cancelado"].includes(p.status),
    );

    const gPed = document.getElementById("g-ped");
    if (gPed) gPed.textContent = pedidos.length;

    document.getElementById("g-ped-sub").textContent =
      `${ativos.length} ativo(s)`;

    const entregasAtivas = new Set(
      ativos.map((p) => p.entrega).filter(Boolean),
    );
    document.getElementById("g-entregas").textContent = entregasAtivas.size;
    document.getElementById("g-preparo").textContent = ativos.filter(
      (p) => p.status === "em_preparo",
    ).length;
    document.getElementById("g-prontos").textContent = ativos.filter(
      (p) => p.status === "saiu_entrega",
    ).length;

    const botoes = document.getElementById("entrega-botoes");
    botoes.innerHTML = Array.from({ length: 10 }, (_, i) => {
      const n = i + 1;
      const temPed = entregasAtivas.has(n);
      const ativo = entregaFiltro === n;
      return `
        <button class="btn btn-sm ${
          ativo ? "btn-red" : temPed ? "btn-green" : "btn-ghost"
        }"
          onclick="carregarEntregas(${n})"
          title="${temPed ? "Entrega com pedido ativo" : "Entrega livre"}">
          ${n}${temPed ? " 🔴" : ""}
        </button>`;
    }).join("");
    //fitra os pedidos
    const pedidosFiltrados = entregaFiltro
      ? ativos.filter((p) => p.entrega === entregaFiltro)
      : ativos;

    if (!pedidosFiltrados.length) {
      grid.innerHTML = `
        <div class="empty" style="grid-column:1/-1">
          <span class="ei">📦</span>
          Nenhum pedido ativo no momento.<br>
          <button class="btn btn-red" style="margin-top:12px" onclick="abrirPedidoEntrega()">
            + Abrir primeiro pedido
          </button>
        </div>`;
      return;
    }

    //junta os pedidos os agrupando para cada entrega

    const porEntrega = {};
    pedidosFiltrados.forEach((p) => {
      const key = p.entrega || "balcão";
      if (!porEntrega[key]) porEntrega[key] = [];
      porEntrega[key].push(p);
    });
    //CRIA UM PAINEL DE PEDIDOS
    grid.innerHTML = Object.entries(porEntrega)
      .map(([entrega, peds]) => {
        const totalEntrega = peds.reduce((s, p) => s + (p.total || 0), 0);
        const todosItens = peds.flatMap((p) => p.itens);
        const itensAgrup = {};
        todosItens.forEach((it) => {
          const k = `${it.nomeMetal} (${it.tamanho})`;
          itensAgrup[k] = (itensAgrup[k] || 0) + it.quantidade;
        });
        const statusAtual = peds[peds.length - 1]?.status;

        return `
        <div class="entrega-card">
          <div class="entrega-card-head">
            <div>
              <div class="entrega-num">Entrega ${entrega}</div>
              <div style="font-size:.72rem;color:var(--muted);margin-top:2px">
                ${peds.length} pedido(s) · ${
                  peds[0]?.cliente?.nome || "Sem cadastro"
                }
              </div>
            </div>
            ${badge(statusAtual)}
          </div>
          <div class="entrega-card-body">
            ${Object.entries(itensAgrup)
              .map(
                ([nome, qtd]) => `
              <div class="entrega-item">
                <strong>${qtd}x ${nome}</strong>
              </div>`,
              )
              .join("")}
            <div class="entrega-total">
              <span style="color:var(--muted)">Total da entrega</span>
              <span style="color:var(--gold)">${R$(totalEntrega)}</span>
            </div>
          </div>
          <div class="entrega-card-foot">
            <button class="btn btn-ghost btn-sm" style="flex:1"
              onclick="abrirPedidoEntrega(${entrega})">
              + Item
            </button>
            <button class="btn btn-blue btn-sm"
              onclick="alterarStatusEntrega('${peds[peds.length - 1]?._id}')">
              📝 Status
            </button>
            <button class="btn btn-green btn-sm"
              onclick="abrirFecharEntrega(${entrega}, ${totalEntrega}, '${peds
                .map((p) => p._id)
                .join(",")}')">
              ✅ Fechar
            </button>
          </div>
        </div>`;
      })
      .join("");
  } catch (e) {
    grid.innerHTML = `<div class="empty" style="color:var(--red)">${e.message}</div>`;
  }
}

//cria o pedido da entrega
async function abrirPedidoEntrega(entregaNum = null) {
  try {
    if (!cMetais.length) cMetais = await api("GET", "/metais");
    if (!cClientes.length) cClientes = await api("GET", "/clientes");
  } catch (e) {
    toast("Erro ao carregar dados", "err");
    return [];
  }

  document.getElementById("pm-cli").innerHTML =
    '<option value="">— Sem cadastro —</option>' +
    cClientes
      .map((c) => `<option value="${c._id}">${c.nome} · ${c.telefone}</option>`)
      .join("");

  document.getElementById("pm-entrega").value = entregaNum || "";
  document.getElementById("itens-entrega-lista").innerHTML = "";
  document.getElementById("pm-obs").value = "";
  document.getElementById("pm-sub").textContent = "R$ 0,00";
  document.getElementById("pm-tot").textContent = "R$ 0,00";

  addItemEntrega();
  abrir("m-pedido-entrega");
}

//organiza os pedidos em uma tabela
function addItemEntrega() {
  const d = document.createElement("div");
  d.className = "item-row";
  const opts = cMetais
    .filter((p) => p.disponivel)
    .map(
      (p) => `<option value="${p._id}"
      data-p="${p.precos?.P || 0}" data-m="${p.precos?.M || 0}" data-g="${
        p.precos?.G || 0
      }">
      ${p.nome}</option>`,
    )
    .join("");
  d.innerHTML = `
    <select class="ip" onchange="recalcEntrega()"><option value="">Selecione...</option>${opts}</select>
    <select class="it" onchange="recalcEntrega()">
      <option value="P">P</option><option value="M">M</option><option value="G" selected>G</option>
    </select>
    <input class="iq" type="number" value="1" min="1" oninput="recalcEntrega()">
    <div class="is" style="font-size:.8rem;text-align:right;color:var(--muted)">R$ 0,00</div>
    <button class="btn-rm" onclick="this.parentElement.remove();recalcEntrega()">×</button>`;
  document.getElementById("itens-entrega-lista").appendChild(d);
}

//calcula a conta de cada entrega, conforme a pessoa que está na entrega vai pedindo vai sendo adicionado na conta da entrega, e no final se torna possivel cobrar o valor sem tanta demora no caixa para calcular tudo pois será feito automaticamente pelo nosso sistema.
function recalcEntrega() {
  let sub = 0;
  document.querySelectorAll("#itens-entrega-lista .item-row").forEach((row) => {
    const sel = row.querySelector(".ip");
    const tam = row.querySelector(".it").value.toLowerCase();
    const qtd = parseInt(row.querySelector(".iq").value) || 0;
    const pc = parseFloat(sel.options[sel.selectedIndex]?.dataset?.[tam] || 0);
    const s = pc * qtd;
    sub += s;
    row.querySelector(".is").textContent = R$(s);
  });
  document.getElementById("pm-sub").textContent = R$(sub);
  document.getElementById("pm-tot").textContent = R$(sub);
}

//verifica se está livre a entrega para fazer o pedido
async function salvarPedidoEntrega() {
  const entrega = parseInt(document.getElementById("pm-entrega").value) || 0;
  if (!entrega || entrega < 1) {
    toast("Selecione a entrega", "err");
    return;
  }

  const cliId = document.getElementById("pm-cli").value || null;
  const itens = [];
  let valido = true;
  document.querySelectorAll("#itens-entrega-lista .item-row").forEach((row) => {
    const pid = row.querySelector(".ip").value;
    if (!pid) {
      valido = false;
      return;
    }
    itens.push({
      metal: pid,
      tamanho: row.querySelector(".it").value,
      quantidade: parseInt(row.querySelector(".iq").value) || 1,
    });
  });

  //pede para adcionar algum item essa programação
  if (!valido || !itens.length) {
    toast("Adicione ao menos um item", "err");
    return;
  }

  //verifica e organiza os clientes em tabelas
  let clienteId = cliId;
  if (!clienteId) {
    try {
      const todos = await api("GET", `/clientes?busca=Entrega ${entrega}`);
      const existe = todos.find((c) => c.nome === `Entrega ${entrega}`);
      if (existe) {
        clienteId = existe._id;
      } else {
        const novo = await api("POST", "/clientes", {
          nome: `Entrega ${entrega}`,
          telefone: "Entrega",
        });
        clienteId = novo._id;
        cClientes = [];
      }
    } catch (e) {
      toast("Erro ao registrar entrega", "err");
      return;
    }
  }

  //fala essa parte sobre o cliente fazer o pedido e seu status
  try {
    await api("POST", "/pedidos", {
      cliente: clienteId,
      itens,
      taxaEntrega: 0,
      formaPagamento: "pix",
      observacoes: document.getElementById("pm-obs").value,
      entrega,
      origem: "entrega",
      entregador: USUARIO_LOGADO?.id,
    });
    toast(`Pedido lançado na Entrega ${entrega}! ⚙️`);
    fechar("m-pedido-entrega");
    carregarEntregas();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

function abrirFecharEntrega(entrega, total, ids) {
  entregaEmFechamento = { entrega, total, ids: ids.split(",") };
  document.getElementById("fm-titulo").textContent =
    `Fechar Entrega ${entrega}`;
  document.getElementById("fm-total").textContent = R$(total);
  document.getElementById("fm-resumo").innerHTML =
    `<p style="font-size:.82rem;color:var(--muted)">
      ${entregaEmFechamento.ids.length} pedido(s) serão marcados como <strong style="color:var(--green)">Entregue</strong>.
    </p>`;
  abrir("m-fechar-entrega");
}

//verifica a disponiblidade da entrega
async function confirmarFechamento() {
  if (!entregaEmFechamento) return;

  try {
    await Promise.all(
      entregaEmFechamento.ids.map((id) =>
        api("PATCH", `/pedidos/${id}/status`, { status: "entregue" }),
      ),
    );
    toast(`Entrega ${entregaEmFechamento.entrega} fechada! ✅`); //status da entrega
    fechar("m-fechar-entrega");
    entregaEmFechamento = null;
    carregarEntregas();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}
//envolve essa fuction a verificação de o usuario é administrador ou não , alem de dar permições e tirar dependendo do cargo
function ir(pg, btn) {
  const perfil = document.getElementById("sb-perfil").textContent;
  if (pg === "usuarios" && perfil !== "Administrador") {
    toast("Acesso restrito a Administradores", "err");
    return;
  }
  if (pg === "entregas" && perfil !== "Entregador") {
    toast("Área exclusiva para Entregador", "err");
    return;
  }
  if (perfil === "Entregador" && !["entregas", "metais"].includes(pg)) {
    toast("Acesso não permitido para Entregador", "err");
    return;
  }
  document
    .querySelectorAll(".secao")
    .forEach((s) => s.classList.remove("ativa"));
  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("ativo"));
  document.getElementById("pg-" + pg).classList.add("ativa");
  if (btn) btn.classList.add("ativo");
  const loaders = {
    dashboard: carregarDashboard,
    pedidos: carregarPedidos,
    metais: carregarMetais,
    clientes: carregarClientes,
    usuarios: carregarUsuarios,
    entregas: carregarEntregas,
  };
  if (loaders[pg]) loaders[pg]();
}

// Essa função é responsável por utilizada para navegar entre seções com base no tipo de perfil
async function carregarDashboard() {
  const h = new Date().getHours();
  const s = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";

  const dashSub = document.getElementById("dash-sub");
  if (dashSub) {
    dashSub.textContent = `${s}! Aqui está o resumo.`;
  }

  try {
    const [metais, clientes, pedidos] = await Promise.all([
      api("GET", "/metais"),
      api("GET", "/clientes"),
      api("GET", "/pedidos"),
    ]);

    cMetais = metais;
    cClientes = clientes;

    const setText = (id, valor) => {
      const el = document.getElementById(id);
      if (el) el.textContent = valor;
    };

    setText("s-piz", metais.length);
    setText("s-cli", clientes.length);
    setText("s-ped", pedidos.length);
    setText("s-ent", pedidos.filter((p) => p.status === "saiu_entrega").length);
    setText("s-fat", R$(pedidos.reduce((acc, p) => acc + (p.total || 0), 0)));

    const pend = pedidos.filter(
      (p) => !["entregue", "cancelado"].includes(p.status),
    ).length;

    setText("s-ped-sub", `${pend} pendente(s)`);

    const elP = document.getElementById("dash-pedidos");

    if (elP) {
      elP.innerHTML =
        pedidos
          .slice(0, 8)
          .map(
            (p) => `
            <div class="mini-row">
              <div>
                <div class="mn">
                  #${String(p.numeroPedido || "?").padStart(3, "0")}
                  · ${p.cliente?.nome || "—"}
                </div>
                <div class="mc">
                  ${new Date(p.createdAt).toLocaleString("pt-BR")}
                </div>
              </div>
              <div style="text-align:right">
                ${badge(p.status)}<br>
                <small style="color:var(--muted)">
                  ${R$(p.total)}
                </small>
              </div>
            </div>
          `,
          )
          .join("") ||
        '<div class="empty"><span class="ei">📋</span>Nenhum pedido ainda</div>';
    }

    // ATENÇÃO:
    // confira no HTML se o id é dash-catalago ou dash-catalogo

    const elC =
      document.getElementById("dash-catalogo") ||
      document.getElementById("dash-catalogo");

    if (elC) {
      elC.innerHTML =
        metais
          .filter((p) => p.disponivel)
          .slice(0, 8)
          .map(
            (p) => `
            <div class="mini-row">
              <span>⚙️ ${p.nome}</span>
              <small style="color:var(--muted)">
                ${R$(p.precos?.G)}
              </small>
            </div>
          `,
          )
          .join("") ||
        '<div class="empty"><span class="ei">⚙️</span>Nenhum metal</div>';
    }
  } catch (e) {
    console.error(e);
    toast("Erro dashboard: " + e.message, "err");
  }
}

//--------------------------------------------------------------------------------
//é responsável por buscar uma lista de metais de uma API e exibi-las dinamicamente em uma tabela HTML
async function carregarMetais() {
  const el = document.getElementById("tbl-metais");

  el.innerHTML =
    '<div class="spin-wrap"><div class="spin"></div> Carregando...</div>';

  try {
    cMetais = await api("GET", "/metais");

    if (!cMetais.length) {
      el.innerHTML =
        '<div class="empty"><span class="ei">⚙️</span>Nenhum metal</div>';

      return;
    }

    const cliente = USUARIO_LOGADO?.perfil === "Cliente";

    el.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>P</th>
            <th>M</th>
            <th>G</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>

          ${cMetais
            .map(
              (p) => `

            <tr>

              <td>
                <strong>${p.nome}</strong>
                <br>
                <small style="color:var(--muted)">
                  ${p.descricao || ""}
                </small>
              </td>

              <td>
                <span class="badge b-cat">
                  ${nomeCategoria(p.categoria)}
                </span>
              </td>

              <td>${R$(p.precos?.P)}</td>

              <td>${R$(p.precos?.M)}</td>

              <td>
                <strong style="color:var(--gold)">
                  ${R$(p.precos?.G)}
                </strong>
              </td>

              <td>
                <span class="badge ${p.disponivel ? "b-on" : "b-off"}">
                  ${p.disponivel ? "✅ Disponível" : "❌ Off"}
                </span>
              </td>

              <td>

                ${
                  cliente
                    ? `
                  <button
                    class="btn btn-red btn-sm"
                    onclick="comprarMetal('${p._id}')">
                    Pedir
                  </button>
                  `
                    : `
                  <div style="display:flex;gap:5px">

                    <button
                      class="btn btn-ghost btn-sm"
                      onclick="editarMetal('${p._id}')">
                      ✏️
                    </button>

                    <button
                      class="btn btn-danger btn-sm"
                      onclick="deletarMetal('${p._id}','${p.nome}')">
                      🗑️
                    </button>

                  </div>
                  `
                }

              </td>

            </tr>

          `,
            )
            .join("")}

        </tbody>

      </table>
    `;
  } catch (e) {
    el.innerHTML = `<div class="empty" style="color:var(--red)">
        ${e.message}
      </div>`;
  }
}
// Strong = é um elemento semântico usado para indicar que um texto tem forte importância
//getElementById= vai atras de um elemento pelo id

//_____________________________________________________________________________
// essa fuction é responsável por limpar os cadastros de pedidos de metais, quando já entregue a metal para liberar espaço
function abrirMetal() {
  const titulo = document.getElementById("modal-metais-titulo");

  if (titulo) {
    titulo.textContent = "Novo Metal";
  }

  const campos = [
    "m-id",
    "m-nome",
    "m-desc",
    "m-preco-p",
    "m-preco-m",
    "m-preco-g",
  ];

  const cat = document.getElementById("m-categoria");
  if (cat) cat.value = "aco";

  campos.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  const disp = document.getElementById("m-disp");
  if (disp) disp.value = "true";

  abrir("m-modal-metais");
}

//_____________________________________________________________________________

//edita valores e coisas da metal

// ============================= LOGICA DE EDICAO DE METAIS =============================

// ============================= SISTEMA DE EDIÇÃO CORRIGIDO =============================

function editarMetal(id) {
  const metal = cMetais.find(
    (m) => String(m.id) === String(id) || String(m._id) === String(id),
  );
  if (!metal) {
    toast("Metal não encontrado!", "err");
    return;
  }

  document.getElementById("m-id").value = metal.id || metal._id;
  document.getElementById("m-nome").value = metal.nome;

  if (metal.precos) {
    document.getElementById("m-preco-p").value = metal.precos.P || 0;
    document.getElementById("m-preco-m").value = metal.precos.M || 0;
    document.getElementById("m-preco-g").value = metal.precos.G || 0;
  } else if (metal.preco) {
    document.getElementById("m-preco-g").value = metal.preco;
  }
  document.getElementById("m-categoria").value = metal.categoria || "aco";

  document.getElementById("modal-metais-titulo").textContent = "Editar Metal";
  abrir("m-modal-metais");
}

async function salvarMetal(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const id = document.getElementById("m-id").value;
  const nome = document.getElementById("m-nome").value.trim();

  const dadosMetal = {
    nome,
    categoria: document.getElementById("m-categoria").value,
    precos: {
      P: parseFloat(document.getElementById("m-preco-p").value) || 0,
      M: parseFloat(document.getElementById("m-preco-m").value) || 0,
      G: parseFloat(document.getElementById("m-preco-g").value) || 0,
    },
  };

  try {
    if (id) {
      await api("PUT", `/metais/${id}`, dadosMetal);
      toast("Metal atualizado com sucesso! ⚙️");
    } else {
      await api("POST", "/metais", dadosMetal);
      toast("Metal cadastrado com sucesso! ⚙️");
    }

    fechar("m-modal-metais");
    await carregarMetais();
  } catch (e) {
    toast("Erro no servidor: " + e.message, "err");
    console.error(e);
  }
}

//essa função busca as informações sobre os clientes
async function carregarClientes(busca = "") {
  const el = document.getElementById("tbl-clientes");
  el.innerHTML =
    '<div class="spin-wrap"><div class="spin"></div> Carregando...</div>';
  try {
    const url = busca
      ? `/clientes?busca=${encodeURIComponent(busca)}`
      : "/clientes";
    cClientes = await api("GET", url);

    if (!cClientes.length) {
      el.innerHTML =
        '<div class="empty"><span class="ei">👥</span>Nenhum cliente</div>';
      return;
    }

    el.innerHTML = `
      <table>
        <thead><tr><th>Nome</th><th>Telefone</th><th>Endereço</th><th>Obs</th><th>Ações</th></tr></thead>
        <tbody>
          ${cClientes
            .map(
              (c) => `
            <tr>
              <td><strong>${c.nome}</strong></td>
              <td>${c.telefone}</td>
              <td style="font-size:.76rem;color:var(--muted)">${
                [
                  c.endereco?.rua,
                  c.endereco?.numero,
                  c.endereco?.bairro,
                  c.endereco?.cidade,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"
              }</td>
              <td style="font-size:.76rem;color:var(--muted)">${
                c.observacoes || "—"
              }</td>
              <td><div style="display:flex;gap:5px"><button class="btn btn-ghost btn-sm" onclick="editarCliente('${
                c._id
              }')">✏️</button><button class="btn btn-danger btn-sm" onclick="deletarCliente('${
                c._id
              }','${c.nome}')">🗑️</button></div></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  } catch (e) {
    el.innerHTML = `<div class="empty" style="color:var(--red)">${e.message}</div>`;
  }
}

//ese codigo serve para otimizar o desempenho de funções que são chamadas com muita frequência (que é o que mais tem nessa programação ksksks)
let _t;
function buscarCli(v) {
  clearTimeout(_t);
  _t = setTimeout(() => carregarClientes(v), 400);
}

//---------------------------------------------------
//cria e abre um novo cliente
function abrirCliente() {
  document.getElementById("m-cli-t").textContent = "Novo Cliente";
  [
    "c-id",
    "c-nome",
    "c-tel",
    "c-rua",
    "c-num",
    "c-bairro",
    "c-cidade",
    "c-cep",
    "c-comp",
    "c-obs",
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  abrir("m-cliente");
}

//informações do cliente e editar ele
function editarCliente(id) {
  const c = cClientes.find(
    (x) => String(x.id) === String(id) || String(x._id) === String(id),
  );
  if (!c) return;
  document.getElementById("m-cli-t").textContent = "Editar Cliente";
  document.getElementById("c-id").value = c.id;
  document.getElementById("c-nome").value = c.nome;
  document.getElementById("c-tel").value = c.telefone;
  document.getElementById("c-rua").value = c.endereco?.rua || "";
  document.getElementById("c-num").value = c.endereco?.numero || "";
  document.getElementById("c-bairro").value = c.endereco?.bairro || "";
  document.getElementById("c-cidade").value = c.endereco?.cidade || "";
  document.getElementById("c-cep").value = c.endereco?.cep || "";
  document.getElementById("c-comp").value = c.endereco?.complemento || "";
  document.getElementById("c-obs").value = c.observacoes || "";
  abrir("m-cliente");
}

//essa função pode salvar alterações de um cliente ou criar contas de novos clientes.

async function salvarCliente() {
  const id = document.getElementById("c-id").value;
  const nome = document.getElementById("c-nome").value.trim();
  const tel = document.getElementById("c-tel").value.trim();
  if (!nome || !tel) {
    toast("Nome e telefone são obrigatórios", "err");
    return;
  }

  const d = {
    nome,
    telefone: tel,
    endereco: {
      rua: document.getElementById("c-rua").value.trim(),
      numero: document.getElementById("c-num").value.trim(),
      bairro: document.getElementById("c-bairro").value.trim(),
      cidade: document.getElementById("c-cidade").value.trim(),
      cep: document.getElementById("c-cep").value.trim(),
      complemento: document.getElementById("c-comp").value.trim(),
    },
    observacoes: document.getElementById("c-obs").value.trim(),
  };

  try {
    id
      ? await api("PUT", "/clientes/" + id, d)
      : await api("POST", "/clientes", d);
    toast(id ? "Cliente atualizado!" : "Cliente cadastrado!");
    fechar("m-cliente");
    carregarClientes();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

//----------------------------------------
//deleta o cliente
async function deletarCliente(id, nome) {
  if (!confirm(`Deletar "${nome}"?`)) return;
  try {
    await api("DELETE", "/clientes/" + id);
    toast("Cliente deletado!");
    carregarClientes();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

//ajuda na administração de pedidos e suas entregas
async function carregarPedidos() {
  const el = document.getElementById("tbl-pedidos");
  el.innerHTML =
    '<div class="spin-wrap"><div class="spin"></div> Carregando...</div>';
  try {
    const pedidos = await api("GET", "/pedidos");
    if (!pedidos.length) {
      el.innerHTML =
        '<div class="empty"><span class="ei">📋</span>Nenhum pedido</div>';
      return;
    }
    el.innerHTML = `
      <table>
        <thead>
          <tr><th>#</th><th>Cliente</th><th>Itens</th><th>Subtotal</th><th>Entrega</th><th>Total</th><th>Pagamento</th><th>Status</th><th>Data</th><th>Ações</th>
        </thead>
        <tbody>
          ${pedidos
            .map(
              (p) => `
            <tr>
              <td><strong style="color:var(--red)">#${String(
                p.numeroPedido || "?",
              ).padStart(3, "0")}</strong></td>
              <td><strong>${
                p.cliente?.nome || "—"
              }</strong><br><small style="color:var(--muted)">${
                p.cliente?.telefone || ""
              }</small></td>
              <td style="font-size:.76rem">${p.itens
                .map(
                  (it) =>
                    `${it.quantidade}x ${it.nomeMetal || "?"} (${it.tamanho})`,
                )
                .join("<br>")}</td>
              <td>${R$(p.subtotal)}</td><td>${R$(p.taxaEntrega)}</td>
              <td><strong style="color:var(--gold)">${R$(p.total)}</strong></td>
              <td style="font-size:.76rem">${(p.formaPagamento || "—").replace(
                "_",
                " ",
              )}</td>
              <td>${badge(p.status)}</td>
              <td style="font-size:.7rem;color:var(--muted)">${new Date(
                p.createdAt,
              ).toLocaleString("pt-BR")}</td>
              <td><div style="display:flex;gap:5px"><button class="btn btn-blue btn-sm" onclick="abrirStatus('${
                p._id
              }','${
                p.status
              }')">📝</button><button class="btn btn-danger btn-sm" onclick="deletarPedido('${
                p._id
              }')">🗑️</button></div></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  } catch (e) {
    el.innerHTML = `<div class="empty" style="color:var(--red)">${e.message}</div>`;
  }
}

//abre o pedido para fazer a compra
async function abrirPedido() {
  try {
    if (!cMetais.length) cMetais = await api("GET", "/metais");
    if (!cClientes.length) cClientes = await api("GET", "/clientes");
  } catch (e) {
    toast("Erro ao carregar dados", "err");
    return;
  }

  document.getElementById("ped-cli").innerHTML =
    '<option value="">— Selecione o cliente —</option>' +
    cClientes
      .map((c) => `<option value="${c._id}">${c.nome} · ${c.telefone}</option>`)
      .join("");

  document.getElementById("itens-lista").innerHTML = "";
  document.getElementById("ped-taxa").value = "0";
  document.getElementById("ped-obs").value = "";
  document.getElementById("ped-pag").value = "pix";
  document.getElementById("ped-sub").textContent = "R$ 0,00";
  document.getElementById("ped-tot").textContent = "R$ 0,00";
  document.getElementById("wrap-troco").style.display = "none";

  addItem();
  abrir("m-pedido");
}

//isso adiciona os itens a compra
function addItem() {
  const d = document.createElement("div");
  d.className = "item-row";
  const opts = cMetais
    .filter((p) => p.disponivel)
    .map(
      (p) =>
        `<option value="${p._id}" data-p="${p.precos?.P || 0}" data-m="${
          p.precos?.M || 0
        }" data-g="${p.precos?.G || 0}">${p.nome}</option>`,
    )
    .join("");

  d.innerHTML = `
    <select class="ip" onchange="recalc()"><option value="">Selecione...</option>${opts}</select>
    <select class="it" onchange="recalc()"><option value="P">P</option><option value="M">M</option><option value="G" selected>G</option></select>
    <input class="iq" type="number" value="1" min="1" oninput="recalc()">
    <div class="is" style="font-size:.8rem;text-align:right;color:var(--muted)">R$ 0,00</div>
    <button class="btn-rm" onclick="this.parentElement.remove(); recalc()">×</button>`;

  document.getElementById("itens-lista").appendChild(d);
}
//--------------------------------------------------------------------------

//calcula o subtotal e o total de um pedido online, desde o pedido até a taixa de entrega

function recalc() {
  let sub = 0;
  document.querySelectorAll("#itens-lista .item-row").forEach((row) => {
    const sel = row.querySelector(".ip");
    const tam = row.querySelector(".it").value.toLowerCase();
    const qtd = parseInt(row.querySelector(".iq").value) || 0;
    const opt = sel.options[sel.selectedIndex];
    const pc = parseFloat(opt?.dataset?.[tam] || 0);
    const s = pc * qtd;
    sub += s;
    row.querySelector(".is").textContent = R$(s);
  });

  const taxa = parseFloat(document.getElementById("ped-taxa").value) || 0;
  document.getElementById("ped-sub").textContent = R$(sub);
  document.getElementById("ped-tot").textContent = R$(sub + taxa);
}

//--------------------------------------------------------------------------
//esse cdogo exibe ou oculta um campo de troco baseado na forma de pagamento selecionada pelo usuário.
function toggleTroco() {
  const pag = document.getElementById("ped-pag").value;

  document.getElementById("wrap-troco").style.display =
    pag === "dinheiro" ? "block" : "none";
}

//esse codigo guarda os dados do pedido, como qual sabor, tamanho e quantidade
async function salvarPedido() {
  const cliId = document.getElementById("ped-cli").value;
  if (!cliId) {
    toast("Selecione um cliente", "err");
    return;
  }

  const itens = [];
  let valido = true;

  // Captura os itens da lista
  document.querySelectorAll("#itens-lista .item-row").forEach((row) => {
    const pid = row.querySelector(".ip").value;
    if (!pid) {
      valido = false;
      return;
    }
    itens.push({
      metal: pid, // Certifique-se que o backend espera 'metal'
      tamanho: row.querySelector(".it").value,
      quantidade: parseInt(row.querySelector(".iq").value) || 1,
    });
  });

  if (!valido || !itens.length) {
    toast("Adicione ao menos um item válido", "err");
    return;
  }

  try {
    // Captura os valores finais
    const taxaEntrega =
      parseFloat(document.getElementById("ped-taxa").value) || 0;
    const formaPagamento = document.getElementById("ped-pag").value;
    const trocoInput = document.getElementById("ped-troco");
    const troco = trocoInput ? parseFloat(trocoInput.value) || 0 : 0;
    const observacoes = document.getElementById("ped-obs").value;

    // Chamada para a API
    await api("POST", "/pedidos", {
      cliente: cliId,
      itens: itens,
      taxaEntrega: taxaEntrega,
      formaPagamento: formaPagamento,
      troco: troco,
      observacoes: observacoes,
    });

    toast("Pedido criado com sucesso! ⚙️");
    fechar("m-pedido");
    carregarPedidos(); // Atualiza a tabela de pedidos

    // Opcional: recarregar dashboard se estiver nela
    if (typeof carregarDashboard === "function") carregarDashboard();
  } catch (e) {
    console.error("Erro ao salvar pedido:", e);
    toast("Erro ao salvar: " + e.message, "err");
  }
}

//exibe o status abrindo uma interface de visualização e tal
function abrirStatus(id, statusAtual) {
  document.getElementById("st-id").value = id;
  document.getElementById("st-val").value = statusAtual;

  document.getElementById("m-status").classList.add("show");
}

//salva o pedido
async function salvarStatus() {
  try {
    const id = document.getElementById("st-id").value;
    const status = document.getElementById("st-val").value;

    await api("PATCH", `/pedidos/${id}/status`, { status });

    fechar("m-status");

    toast("Status atualizado!");
    carregarEntregas();
  } catch (e) {
    toast(e.message, true);
  }
}

//apaga o pedido
async function deletarPedido(id) {
  if (!confirm("Deletar este pedido?")) return;
  try {
    await api("DELETE", "/pedidos/" + id);
    toast("Pedido deletado!");
    carregarPedidos();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

// procura o usuario entre os já registrados e os exibe em uma tabela
async function carregarUsuarios() {
  const el = document.getElementById("tbl-usuarios");
  el.innerHTML =
    '<div class="spin-wrap"><div class="spin"></div> Carregando...</div>';
  try {
    const us = await api("GET", "/usuarios");

    if (!us.length) {
      el.innerHTML =
        '<div class="empty"><span class="ei">🔐</span>Nenhum usuário</div>'; //caso encontre o usuario
      return;
    }
    el.innerHTML = `
      <table>
        <thead><tr><th>Nome</th><th>E-mail</th><th>Perfil</th><th>Status</th><th>Criado em</th><th>Ações</th></tr></thead>
        <tbody>
          ${us
            .map(
              (u) => `
            <tr>
              <td><strong>${u.nome}</strong></td>
              <td>${u.email}</td>
              <td><span class="badge ${
                u.perfil === "Administrador" ? "b-admin" : "b-atend"
              }">${u.perfil}</span></td>
              <td><span class="badge ${u.ativo ? "b-on" : "b-off"}">${
                u.ativo ? "Ativo" : "Inativo"
              }</span></td>
              <td style="font-size:.73rem;color:var(--muted)">${new Date(
                u.createdAt,
              ).toLocaleDateString("pt-BR")}</td>
              <td><button class="btn btn-danger btn-sm" onclick="deletarUsuario('${
                u._id
              }','${u.nome}')">🗑️</button></td>
            </tr>`,
            )
            .join("")}
        </tbody>
      </table>`;
  } catch (e) {
    el.innerHTML = `<div class="empty" style="color:var(--red)">${e.message}</div>`;
  }
}
//ativa o perfil ao ele entrar no site / ser conectado
function abrirUsuario() {
  ["u-nome", "u-email", "u-senha"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("u-perfil").value = "Atendente";
  abrir("m-usuario");
}

//adiciona um usuario e mantem salvo para a pessoa mais tarde poder acessar o site

async function salvarUsuario() {
  const nome = document.getElementById("u-nome").value.trim();
  const email = document.getElementById("u-email").value.trim();
  const senha = document.getElementById("u-senha").value;
  if (!nome || !email || !senha) {
    toast("Preencha todos os campos", "err");
    return;
  }

  try {
    await api("POST", "/usuarios", {
      nome,
      email,
      senha,
      perfil: document.getElementById("u-perfil").value,
    });
    toast("Usuário criado!");
    fechar("m-usuario");
    carregarUsuarios();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

//deleta usuario
async function deletarUsuario(id, nome) {
  if (!confirm(`Deletar "${nome}"?`)) return;
  try {
    await api("DELETE", "/usuarios/" + id);
    toast("Usuário deletado!");
    carregarUsuarios();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

async function deletarMetal(id, nome) {
  if (!confirm(`Deletar "${nome}"?`)) return;

  try {
    await api("DELETE", "/metais/" + id);
    toast("Metal deletado!");
    carregarMetais();
  } catch (e) {
    toast("Erro: " + e.message, "err");
  }
}

async function alterarStatusEntrega(idPedido) {
  const status = prompt(
    "Digite o novo status:\n\n" +
      "recebido\n" +
      "em_preparo\n" +
      "saiu_entrega\n" +
      "entregue\n" +
      "cancelado",
  );

  if (!status) return;

  try {
    await api("PATCH", `/pedidos/${idPedido}/status`, { status });

    carregarEntregas();
  } catch (e) {
    alert(e.message);
  }
}



async function carregarCatalogoCliente() {
  const res = await fetch("/api/metais");

  const metais = await res.json();

  let html = "";

  metais.forEach((metal) => {
    const precos = JSON.parse(metal.precos);

    html += `
      <div class="card" style="margin-bottom:10px">

        <h3>${metal.nome}</h3>

        <p>${metal.descricao}</p>

        <p>
          P: R$ ${precos.P}
          |
          M: R$ ${precos.M}
          |
          G: R$ ${precos.G}
        </p>

        <button
          class="btn btn-red"
          onclick="adicionarAoCarrinho(${metal.id})"
        >
          Pedir
        </button>

      </div>
    `;
  });

  document.getElementById("catalogo-cliente").innerHTML = html;
}

function adicionarAoCarrinho(idMetal) {
  carrinhoCliente.push({
    metal_id: idMetal,
    quantidade: 1,
    tamanho: "M",
  });

  toast("Metal adicionado!");
}
async function enviarPedidoCliente() {

  try {

    await api("POST", "/pedidos", {

      cliente: USUARIO_LOGADO.id,

      itens: carrinhoCliente,

      taxaEntrega: 5,

      formaPagamento: "pix",

      observacoes: "",

      origem: "cliente"

    });

    toast("Pedido realizado!");

    carrinhoCliente = [];

    carregarMeusPedidos();

  }
  catch(e){

    toast(e.message,"err");

  }

}


async function carregarMeusPedidos() {
  const token = localStorage.getItem("token");

  const res = await fetch("/api/meus-pedidos", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const pedidos = await res.json();

  document.getElementById("tbl-meus-pedidos").innerHTML = pedidos
    .map(
      (p) => `

    <div class="card">

      <b>Pedido #${p.id}</b>

      <br>

      Status:
      <b>${p.status}</b>

      <br>

      Total:
      R$ ${p.total}

    </div>

    <br>

  `,
    )
    .join("");

  function abrirPedidoCliente() {
    abrirPedido();
  }

  if (usuario.perfil === "Cliente") {
    ir("cliente");

    carregarMeusPedidos();
  }
}

function configurarTelaCliente() {
  // esconder menus do gestor
  document.querySelector('[onclick*="dashboard"]').style.display = "none";

  document.querySelector('[onclick*="clientes"]').style.display = "none";

  document.querySelector('[onclick*="usuarios"]').style.display = "none";

  document.querySelector('[onclick*="entregas"]').style.display = "none";

  // renomear
  document.getElementById("nav-metais-label").innerText = "Catálogo";
}


function comprarMetal(idMetal){

  carrinhoCliente = [];

  carrinhoCliente.push({

    metal: idMetal,

    tamanho: "M",

    quantidade: 1

  });

  enviarPedidoCliente();

}

