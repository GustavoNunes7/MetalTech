// ============================================================
// Cliente.js — Model de Cliente (sql.js)
// ============================================================

const { ready, query, run, get } = require('../database/sqlite');
const bcrypt = require('bcryptjs');

function formatarCliente(row) {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    email: row.email,
    endereco: JSON.parse(row.endereco || '{}'),
    observacoes: row.observacoes,
    ativo: row.ativo === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const Cliente = {

  // ==========================================================
  // LISTAR CLIENTES
  // ==========================================================
  async findAll(busca = '') {
    await ready;

    let rows;

    if (busca) {
      const t = `%${busca}%`;

      rows = query(
        `
        SELECT *
        FROM clientes
        WHERE ativo = 1
        AND (nome LIKE ? OR telefone LIKE ?)
        ORDER BY nome
        `,
        [t, t]
      );
    } else {
      rows = query(
        `
        SELECT *
        FROM clientes
        WHERE ativo = 1
        ORDER BY nome
        `
      );
    }

    return rows.map(formatarCliente);
  },

  // ==========================================================
  // BUSCAR POR ID
  // ==========================================================
  async findById(id) {
    await ready;

    const row = get(
      'SELECT * FROM clientes WHERE id = ?',
      [id]
    );

    return formatarCliente(row);
  },

  // ==========================================================
  // BUSCAR POR EMAIL
  // ==========================================================
  async findByEmail(email) {
    await ready;

    return get(
      'SELECT * FROM clientes WHERE email = ?',
      [email.toLowerCase().trim()]
    );
  },

  // ==========================================================
  // CRIAR CLIENTE
  // ==========================================================
  async create({
    nome,
    telefone,
    email,
    senha,
    endereco = {},
    observacoes = ''
  }) {

    await ready;

    const hash = await bcrypt.hash(senha, 10);

    const info = run(
      `
      INSERT INTO clientes
      (
        nome,
        telefone,
        email,
        senha,
        endereco,
        observacoes
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        nome.trim(),
        telefone.trim(),
        email.toLowerCase().trim(),
        hash,
        JSON.stringify(endereco),
        observacoes
      ]
    );

    return this.findById(info.lastInsertRowid);
  },

  // ==========================================================
  // VERIFICAR SENHA
  // ==========================================================
  verificarSenha(senhaDigitada, hash) {
    return bcrypt.compare(senhaDigitada, hash);
  },

  // ==========================================================
  // ATUALIZAR CLIENTE
  // ==========================================================
  async update(
    id,
    {
      nome,
      telefone,
      endereco,
      observacoes,
      ativo
    }
  ) {

    await ready;

    const atual = get(
      'SELECT * FROM clientes WHERE id = ?',
      [id]
    );

    if (!atual) return null;

    const endAtual = JSON.parse(
      atual.endereco || '{}'
    );

    const endFinal = endereco
      ? { ...endAtual, ...endereco }
      : endAtual;

    run(
      `
      UPDATE clientes SET
        nome = ?,
        telefone = ?,
        endereco = ?,
        observacoes = ?,
        ativo = ?,
        updated_at = datetime('now')
      WHERE id = ?
      `,
      [
        nome ?? atual.nome,
        telefone ?? atual.telefone,
        JSON.stringify(endFinal),
        observacoes ?? atual.observacoes,
        ativo !== undefined
          ? (ativo ? 1 : 0)
          : atual.ativo,
        id
      ]
    );

    return this.findById(id);
  },

  // ==========================================================
  // EXCLUIR CLIENTE
  // ==========================================================
  async delete(id) {
    await ready;

    const info = run(
      'DELETE FROM clientes WHERE id = ?',
      [id]
    );

    return info.changes > 0;
  }

};

module.exports = Cliente;