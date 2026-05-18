const API = '/api';

let cMetais = [];
let cClientes = [];

let TOKEN = localStorage.getItem('pz_token') || '';
let USUARIO_LOGADO = JSON.parse(localStorage.getItem('pz_usuario') || 'null');

let entregaEmFechamento = null;
let entregaFiltro = null;

// ================= LOGIN =================
async function fazerLogin() {
  const email = document.getElementById('l-email').value.trim();
  const senha = document.getElementById('l-senha').value;
  const btn = document.getElementById('btn-login');
  const erro = document.getElementById('login-erro');

  if (!email || !senha) {
    erro.style.display = 'block';
    erro.textContent = 'Preencha e-mail e senha.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Entrando...';

  try {
    const res = await fetch(API + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.erro || 'Erro login');

    TOKEN = data.token;
    USUARIO_LOGADO = data.usuario;

    localStorage.setItem('pz_token', TOKEN);
    localStorage.setItem('pz_usuario', JSON.stringify(data.usuario));

    aplicarPerfil(data.usuario);
    document.body.classList.add('logado');

  } catch (e) {
    erro.style.display = 'block';
    erro.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.textContent = 'Entrar';
  }
}

function sair() {
  TOKEN = '';
  USUARIO_LOGADO = null;
  localStorage.clear();
  document.body.classList.remove('logado');
}

// ================= API =================
async function api(method, url, body) {
  const res = await fetch(API + url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || 'Erro API');
  return data;
}

// ================= UTIL =================
function abrir(id) {
  document.getElementById(id).classList.add('open');
}

function fechar(id) {
  document.getElementById(id).classList.remove('open');
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'show';
  setTimeout(() => el.className = '', 3000);
}

function R$(v) {
  return 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',');
}

// ================= PERFIL =================
function aplicarPerfil(usuario) {
  document.getElementById('sb-nome').textContent = usuario.nome;
  document.getElementById('sb-perfil').textContent = usuario.perfil;
}

// ================= METAL (CORRIGIDO EDITAR) =================

// ABRIR NOVO
function abrirMetal() {
  document.getElementById('m-metal-t').textContent = 'Novo Metal';

  ['p-id','p-nome','p-desc','p-pp','p-pm','p-pg']
    .forEach(id => document.getElementById(id).value = '');

  document.getElementById('p-cat').value = 'ferro';
  document.getElementById('p-fdisp').value = 'true';

  abrir('m-metal');
}

// ⭐ EDITAR (CORRIGIDO)
function editarMetal(id) {
  const p = cMetais.find(x => String(x._id) === String(id));
  if (!p) return;

  document.getElementById('m-metal-t').textContent = 'Editar Metal';

  document.getElementById('p-id').value = p._id;
  document.getElementById('p-nome').value = p.nome;
  document.getElementById('p-desc').value = p.descricao || '';
  document.getElementById('p-pp').value = p.precos?.P || '';
  document.getElementById('p-pm').value = p.precos?.M || '';
  document.getElementById('p-pg').value = p.precos?.G || '';
  document.getElementById('p-cat').value = p.categoria || 'ferro';
  document.getElementById('p-fdisp').value = String(p.disponivel);

  abrir('m-metal');
}

// SALVAR
async function salvarMetal() {
  const id = document.getElementById('p-id').value;

  const d = {
    nome: document.getElementById('p-nome').value,
    descricao: document.getElementById('p-desc').value,
    categoria: document.getElementById('p-cat').value,
    disponivel: document.getElementById('p-fdisp').value === 'true',
    precos: {
      P: +document.getElementById('p-pp').value || 0,
      M: +document.getElementById('p-pm').value || 0,
      G: +document.getElementById('p-pg').value || 0,
    }
  };

  if (id) await api('PUT', '/metais/' + id, d);
  else await api('POST', '/metais', d);

  toast('Salvo!');
  fechar('m-metal');
  carregarMetais();
}

// DELETAR
async function deletarMetal(id, nome) {
  if (!confirm(`Deletar ${nome}?`)) return;
  await api('DELETE', '/metais/' + id);
  toast('Deletado!');
  carregarMetais();
}

// LISTAR
async function carregarMetais() {
  const el = document.getElementById('tbl-metais');

  el.innerHTML = 'Carregando...';

  cMetais = await api('GET', '/metais');

  el.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th><th>P</th><th>M</th><th>G</th><th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${cMetais.map(p => `
          <tr>
            <td>${p.nome}</td>
            <td>${R$(p.precos?.P)}</td>
            <td>${R$(p.precos?.M)}</td>
            <td>${R$(p.precos?.G)}</td>
            <td>
              <button onclick="editarMetal('${p._id}')">✏️</button>
              <button onclick="deletarMetal('${p._id}','${p.nome}')">🗑️</button>
            </td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// ================= NAVEGAÇÃO =================
function ir(pg, btn) {
  document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
  document.getElementById('pg-' + pg).classList.add('ativa');

  if (btn) btn.classList.add('ativo');

  const loaders = {
    metais: carregarMetais,
  };

  if (loaders[pg]) loaders[pg]();
}