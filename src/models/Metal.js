// ============================================================
// Metal.js — Model de Metal (sql.js)
// ============================================================

const { ready, query, run, get } = require('../database/sqlite');

// Formata os dados vindos do banco
function formatarMetal(row) {
  if (!row) return null;

  return {
    _id: row.id,
    id: row.id,
    nome: row.nome,
    descricao: row.descricao,
    precos: JSON.parse(row.precos || '{"P":0,"M":0,"G":0}'),
    disponivel: row.disponivel === 1,
    categoria: row.categoria,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const Metal = {

  // Buscar todos
  async findAll() {
    await ready;

    return query(
      'SELECT * FROM metais ORDER BY categoria, nome'
    ).map(formatarMetal);
  },

  // Buscar por ID
  async findById(id) {
    await ready;

    return formatarMetal(
      get('SELECT * FROM metais WHERE id = ?', [id])
    );
  },

  // Criar novo metal
  async create({
    nome,
    descricao = '',
    precos = {},
    disponivel = true,
    categoria = 'tradicional'
  }) {
    await ready;

    const info = run(
      `INSERT INTO metais
      (nome, descricao, precos, disponivel, categoria)
      VALUES (?, ?, ?, ?, ?)`,
      [
        nome.trim(),
        descricao.trim(),
        JSON.stringify({
          P: precos.P || 0,
          M: precos.M || 0,
          G: precos.G || 0
        }),
        disponivel ? 1 : 0,
        categoria
      ]
    );

    return this.findById(info.lastInsertRowid);
  },

  // Atualizar metal
  async update(id, {
    nome,
    descricao,
    precos,
    disponivel,
    categoria
  }) {
    await ready;

    const atual = get(
      'SELECT * FROM metais WHERE id = ?',
      [id]
    );

    if (!atual) return null;

    const precosAtuais = JSON.parse(
      atual.precos || '{"P":0,"M":0,"G":0}'
    );

    const precosFinal = precos
      ? {
          P: precos.P ?? precosAtuais.P,
          M: precos.M ?? precosAtuais.M,
          G: precos.G ?? precosAtuais.G
        }
      : precosAtuais;

    run(
      `UPDATE metais SET
        nome = ?,
        descricao = ?,
        precos = ?,
        disponivel = ?,
        categoria = ?,
        updated_at = datetime('now')
      WHERE id = ?`,
      [
        nome ?? atual.nome,
        descricao ?? atual.descricao,
        JSON.stringify(precosFinal),
        disponivel !== undefined
          ? (disponivel ? 1 : 0)
          : atual.disponivel,
        categoria ?? atual.categoria,
        id
      ]
    );

    return this.findById(id);
  },

  // Deletar metal
  async delete(id) {
    await ready;

    const info = run(
      'DELETE FROM metais WHERE id = ?',
      [id]
    );

    return info.changes > 0;
  }
};

module.exports = Metal;