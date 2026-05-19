// ================= CONFIG =================

const API = "/api";

let cMetais = [];
let cClientes = [];
let itensPedido = [];
let itensEntrega = [];

let TOKEN = localStorage.getItem("pz_token") || "";

let USUARIO_LOGADO = JSON.parse(
  localStorage.getItem("pz_usuario") || "null"
);

let entregaEmFechamento = null;
let entregaFiltro = null;

// ================= AUTO LOGIN =================

window.addEventListener("DOMContentLoaded", async () => {

  if (TOKEN && USUARIO_LOGADO) {

    const telaLogin =
      document.getElementById("tela-login");

    const app =
      document.getElementById("app");

    if (telaLogin) {
      telaLogin.style.display = "none";
    }

    if (app) {
      app.style.display = "flex";
    }

    aplicarPerfil(USUARIO_LOGADO);

    try {

      await carregarMetais();

      carregarDashboard();

    } catch (e) {

      console.log(e);

    }

  }

  // ================= TELEFONE =================

  const inputTelefone =
    document.getElementById("l-telefone");

  if (inputTelefone) {

    inputTelefone.addEventListener("input", (e) => {

      let valor = e.target.value;

      valor = valor.replace(/\D/g, "");

      if (valor.length > 2) {

        valor =
          `(${valor.substring(0, 2)}) ${valor.substring(2)}`;

      } else if (valor.length > 0) {

        valor = `(${valor}`;
      }

      if (valor.length > 10) {

        valor =
          `${valor.substring(0, 10)}-${valor.substring(10, 15)}`;
      }

      e.target.value = valor;

    });

  }

});

// ================= LOGIN =================

async function fazerLogin() {

  const email =
    document.getElementById("l-email").value.trim();

  const senha =
    document.getElementById("l-senha").value;

  const btn =
    document.getElementById("btn-login");

  const erro =
    document.getElementById("login-erro");

  if (!email || !senha) {

    erro.style.display = "block";

    erro.textContent =
      "Preencha e-mail e senha.";

    return;
  }

  btn.disabled = true;

  btn.textContent = "Entrando...";

  try {

    const res = await fetch(API + "/auth/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        senha,
      }),
    });

    const data = await res.json();

    if (!res.ok) {

      throw new Error(data.erro || "Erro login");
    }

    TOKEN = data.token;

    USUARIO_LOGADO = data.usuario;

    localStorage.setItem("pz_token", TOKEN);

    localStorage.setItem(
      "pz_usuario",
      JSON.stringify(data.usuario)
    );

    aplicarPerfil(data.usuario);

    document.body.classList.add("logado");

    document.getElementById("tela-login").style.display =
      "none";

    document.getElementById("app").style.display =
      "flex";

    await carregarMetais();

    carregarDashboard();

    toast("Login realizado!");

  } catch (e) {

    erro.style.display = "block";

    erro.textContent = e.message;

  } finally {

    btn.disabled = false;

    btn.textContent = "Entrar";
  }
}

// ================= CRIAR LOGIN =================

async function criarLogin() {

  const nome =
    document.getElementById("l-name").value.trim();

  const telefone =
    document.getElementById("l-telefone").value.trim();

  const email =
    document.getElementById("l-email").value.trim();

  const endereco =
    document.getElementById("l-endereco").value.trim();

  const senha =
    document.getElementById("l-senha").value;

  const erro =
    document.getElementById("login-erro");

  const btn =
    document.getElementById("btn-login");

  if (
    !nome ||
    !telefone ||
    !email ||
    !endereco ||
    !senha
  ) {

    erro.style.display = "block";

    erro.textContent =
      "Preencha todos os campos.";

    return;
  }

  erro.style.display = "none";

  btn.disabled = true;

  btn.textContent = "Criando conta...";

  try {

    const resUser = await fetch(API + "/usuarios", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nome,
        email,
        senha,
        perfil: "Cliente",
      }),
    });

    const dataUser = await resUser.json();

    if (!resUser.ok) {

      throw new Error(
        dataUser.erro ||
        "Erro ao criar usuário"
      );
    }

    const resCliente = await fetch(API + "/clientes", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        nome,
        telefone,

        endereco: {
          rua: endereco,
        },

        observacoes:
          "Cliente criado automaticamente",
      }),
    });

    const dataCliente = await resCliente.json();

    if (!resCliente.ok) {

      throw new Error(
        dataCliente.erro ||
        "Erro ao criar cliente"
      );
    }

    toast("Conta criada com sucesso!");

    setTimeout(() => {

      window.location.href = "index.html";

    }, 1500);

  } catch (e) {

    erro.style.display = "block";

    erro.textContent = e.message;

  } finally {

    btn.disabled = false;

    btn.textContent = "Novo Login";
  }
}

// ================= API =================

async function api(method, url, body) {

  const res = await fetch(API + url, {

    method,

    headers: {

      "Content-Type": "application/json",

      Authorization: `Bearer ${TOKEN}`,
    },

    body: body
      ? JSON.stringify(body)
      : undefined,
  });

  const data = await res.json();

  if (!res.ok) {

    throw new Error(
      data.erro || "Erro API"
    );
  }

  return data;
}

// ================= UTIL =================

function abrir(id) {

  const el =
    document.getElementById(id);

  if (el) {
    el.classList.add("open");
  }
}

function fechar(id) {

  const el =
    document.getElementById(id);

  if (el) {
    el.classList.remove("open");
  }
}

function toast(msg) {

  const el =
    document.getElementById("toast");

  if (!el) return;

  el.textContent = msg;

  el.className = "show";

  setTimeout(() => {

    el.className = "";

  }, 3000);
}

function R$(v) {

  return (
    "R$ " +
    Number(v || 0)
      .toFixed(2)
      .replace(".", ",")
  );
}

// ================= SAIR =================

function sair() {

  TOKEN = "";

  USUARIO_LOGADO = null;

  localStorage.clear();

  location.reload();
}

// ================= SENHA =================

function togglePassword() {

  const inputSenha =
    document.getElementById("l-senha");

  const btnOlho =
    document.getElementById("btn-show-pass");

  if (!inputSenha) return;

  if (inputSenha.type === "password") {

    inputSenha.type = "text";

    if (btnOlho) {
      btnOlho.textContent = "🙈";
    }

  } else {

    inputSenha.type = "password";

    if (btnOlho) {
      btnOlho.textContent = "👁️";
    }
  }
}

// ================= PERFIL =================

function aplicarPerfil(usuario) {

  const nome =
    document.getElementById("sb-nome");

  const perfil =
    document.getElementById("sb-perfil");

  if (nome) {
    nome.textContent = usuario.nome;
  }

  if (perfil) {
    perfil.textContent = usuario.perfil;
  }
}

// ================= NAVEGAÇÃO =================

function ir(pg, btn) {

  document
    .querySelectorAll(".secao")
    .forEach((s) =>
      s.classList.remove("ativa")
    );

  const pagina =
    document.getElementById("pg-" + pg);

  if (pagina) {
    pagina.classList.add("ativa");
  }

  document
    .querySelectorAll(".nav-btn")
    .forEach((b) =>
      b.classList.remove("ativo")
    );

  if (btn) {
    btn.classList.add("ativo");
  }

  const loaders = {
    metais: carregarMetais,
    dashboard: carregarDashboard,
  };

  if (loaders[pg]) {
    loaders[pg]();
  }
}

// ================= DASHBOARD =================

function carregarDashboard() {

  const ped =
    document.getElementById("s-ped");

  const cli =
    document.getElementById("s-cli");

  const piz =
    document.getElementById("s-piz");

  if (ped) {
    ped.textContent = "0";
  }

  if (cli) {
    cli.textContent = cClientes.length;
  }

  if (piz) {
    piz.textContent = cMetais.length;
  }
}

// ================= METAIS =================

function abrirMetal() {
  abrir("m-metal");
}

function fecharMetal(id) {
  fechar(id);
}

async function carregarMetais() {

  const el =
    document.getElementById("tbl-metais");

  if (!el) return;

  el.innerHTML = `
    <div class="spin-wrap">
      Carregando...
    </div>
  `;

  try {

    cMetais = await api(
      "GET",
      "/metais"
    );

    el.innerHTML = `

      <table>

        <thead>

          <tr>
            <th>Nome</th>
            <th>P</th>
            <th>M</th>
            <th>G</th>
          </tr>

        </thead>

        <tbody>

          ${cMetais.map(p => `

            <tr>

              <td>${p.nome}</td>

              <td>${R$(p.precos?.P)}</td>

              <td>${R$(p.precos?.M)}</td>

              <td>${R$(p.precos?.G)}</td>

            </tr>

          `).join("")}

        </tbody>

      </table>

    `;

  } catch (e) {

    el.innerHTML =
      "Erro ao carregar metais";

    console.log(e);
  }
}

// ================= MODAIS =================

function abrirCliente() {
  abrir("m-cliente");
}

function abrirPedido() {
  abrir("m-pedido");
}

function abrirUsuario() {
  abrir("m-usuario");
}

function abrirPedidoEntregas() {
  abrir("m-pedido-entrega");
}

// ================= SALVAR =================

function salvarMetal() {

  toast("Metal salvo!");

  fechar("m-metal");
}

function salvarCliente() {

  toast("Cliente salvo!");

  fechar("m-cliente");
}

function salvarPedido() {

  toast("Pedido salvo!");

  fechar("m-pedido");
}

function salvarUsuario() {

  toast("Usuário criado!");

  fechar("m-usuario");
}

function salvarPedidoEntrega() {

  toast("Pedido de entrega salvo!");

  fechar("m-pedido-entrega");
}

function salvarStatus() {

  toast("Status atualizado!");

  fechar("m-status");
}

// ================= CLIENTES =================

function buscarCli(valor) {

  console.log(valor);
}

// ================= PEDIDOS =================

function addItem() {

  toast("Item adicionado!");
}

function addItemEntrega() {

  toast("Item entrega adicionado!");
}

function toggleTroco() {

  const pag =
    document.getElementById("ped-pag");

  const wrap =
    document.getElementById("wrap-troco");

  if (!pag || !wrap) return;

  if (pag.value === "dinheiro") {

    wrap.style.display = "block";

  } else {

    wrap.style.display = "none";
  }
}

function recalc() {

  const total =
    document.getElementById("ped-tot");

  if (total) {
    total.textContent = "R$ 0,00";
  }
}

// ================= ENTREGAS =================

function confirmarFechamento() {

  toast("Entrega finalizada!");

  fechar("m-fechar-entrega");
}