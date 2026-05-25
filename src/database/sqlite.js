// ============================================================
// sqlite.js — Conexão com SQLite usando sql.js
// ============================================================

const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_PATH =
  process.env.DB_PATH ||
  path.join(__dirname, "..", "..", "metalDados.db");

const state = {
  db: null,
};

const ready = (async () => {
  const SQL = await initSqlJs();

  // Carrega banco existente
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    state.db = new SQL.Database(fileBuffer);
  } else {
    state.db = new SQL.Database();
  }

  const db = state.db;

  // Ativa foreign keys
  db.run(`PRAGMA foreign_keys = ON`);

  // ============================================================
  // TABELA USUÁRIOS
  // ============================================================

  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,

      perfil TEXT NOT NULL DEFAULT 'Atendente',
      ativo INTEGER NOT NULL DEFAULT 1,

      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ============================================================
  // TABELA CLIENTES
  // ============================================================

  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nome TEXT NOT NULL,
      telefone TEXT NOT NULL,

      endereco TEXT NOT NULL DEFAULT '',
      observacoes TEXT NOT NULL DEFAULT '',

      ativo INTEGER NOT NULL DEFAULT 1,

      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ============================================================
  // TABELA METAIS
  // ============================================================

  db.run(`
    CREATE TABLE IF NOT EXISTS metais (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      nome TEXT NOT NULL,
      descricao TEXT NOT NULL DEFAULT '',

      produtos TEXT NOT NULL,

      precos TEXT NOT NULL DEFAULT '{"P":0,"M":0,"G":0}',

      disponivel INTEGER NOT NULL DEFAULT 1,

      categoria TEXT NOT NULL DEFAULT 'ferrosos',

      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ============================================================
  // TABELA PEDIDOS
  // ============================================================

  db.run(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      numero_pedido INTEGER,

      cliente_id INTEGER NOT NULL REFERENCES clientes(id),

      subtotal REAL NOT NULL DEFAULT 0,
      taxa_entrega REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL DEFAULT 0,

      forma_pagamento TEXT NOT NULL,
      troco REAL NOT NULL DEFAULT 0,

      status TEXT NOT NULL DEFAULT 'recebido',

      observacoes TEXT NOT NULL DEFAULT '',

      endereco TEXT NOT NULL DEFAULT '',

      origem TEXT NOT NULL DEFAULT 'site',

      usuario_id INTEGER REFERENCES usuarios(id),

      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // ============================================================
  // TABELA ITENS PEDIDO
  // ============================================================

  db.run(`
    CREATE TABLE IF NOT EXISTS itens_pedido (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      pedido_id INTEGER NOT NULL REFERENCES pedidos(id),

      metal_id INTEGER NOT NULL REFERENCES metais(id),

      nome_metal TEXT NOT NULL,

      tamanho TEXT NOT NULL,

      quantidade INTEGER NOT NULL DEFAULT 1,

      preco_unitario REAL NOT NULL DEFAULT 0,

      subtotal REAL NOT NULL DEFAULT 0
    )
  `);

  salvar();

  console.log("SQLite conectado:", DB_PATH);

  return db;
})();

// ============================================================
// SALVAR BANCO
// ============================================================

function salvar() {
  if (!state.db) return;

  const data = state.db.export();

  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

// ============================================================
// SELECT
// ============================================================

function query(sql, params = []) {
  const stmt = state.db.prepare(sql);

  const results = [];

  stmt.bind(params);

  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }

  stmt.free();

  return results;
}

// ============================================================
// INSERT / UPDATE / DELETE
// ============================================================

function run(sql, params = []) {
  state.db.run(sql, params);

  const meta = query(`
    SELECT
      last_insert_rowid() as id,
      changes() as changes
  `);

  salvar();

  return {
    lastInsertRowid: meta[0]?.id || null,
    changes: meta[0]?.changes || 0,
  };
}

// ============================================================
// GET UMA LINHA
// ============================================================

function get(sql, params = []) {
  const rows = query(sql, params);

  return rows[0] || null;
}

module.exports = {
  ready,
  query,
  run,
  get,
  salvar,
};