// ============================================================
// Pedido.js — Model de Pedido (sql.js)
// ============================================================

const { ready, query, run, get } = require('../database/sqlite');

const SELECT_PEDIDO = `
  SELECT
    p.*,
    c.nome     AS cliente_nome,
    c.telefone AS cliente_telefone
  FROM pedidos p
  LEFT JOIN clientes c ON c.id = p.cliente_id
`;

//dados do pedido
function formatarPedido(row, itens = []) {
  if (!row) return null;
  return {
    _id:           row.id,
    id:            row.id,
    numeroPedido:  row.numero_pedido,
    cliente: {
      _id:      row.cliente_id,
      id:       row.cliente_id,
      nome:     row.cliente_nome,
      telefone: row.cliente_telefone,
    },
    itens: itens.map(it => ({
      _id:           it.id,
      metal:         it.metal_id,
      nomeMetal:     it.nome_metal,
      tamanho:       it.tamanho,
      quantidade:    it.quantidade,
      precoUnitario: it.preco_unitario,
      subtotal:      it.subtotal,
    })),
    subtotal:       row.subtotal,
    taxaEntrega:    row.taxa_entrega,
    total:          row.total,
    formaPagamento: row.forma_pagamento,
    troco:          row.troco,
    status:         row.status,
    observacoes:    row.observacoes,
    endereço:       row.endereço,
    origem:         row.origem,
    entregador:     row.entregador_id,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  };
}

const Pedido = {
  //seleciona pedidos

  async findAll({ entregadorId } = {}) {
    await ready;
    let rows;
    if (entregadorId) {
      rows = query(`${SELECT_PEDIDO} WHERE p.entregador_id = ? ORDER BY p.created_at DESC`, [entregadorId]);
    } else {
      rows = query(`${SELECT_PEDIDO} ORDER BY p.created_at DESC`);
    }
    return rows.map(row => {
      const itens = query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [row.id]);
      return formatarPedido(row, itens);
    });
  },

  async findById(id) {
    //procura os pedidos pelo id
    await ready;
    const row = get(`${SELECT_PEDIDO} WHERE p.id = ?`, [id]);
    if (!row) return null;
    const itens = query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);
    return formatarPedido(row, itens);
  },

  async create({ clienteId, itens, taxaEntrega = 0, formaPagamento, troco = 0, observacoes = '', endereço = null, origem = 'balcao', entregadorId = null }) {
    await ready;
    //cria pedidos de metais

    const Metal = require('./Metal');
    let subtotal = 0;
    const itensProcessados = [];

    for (const item of itens) {
      const Metal = await Metal.findById(item.Metal);
      if (!metal) throw new Error(`Metal ID ${item.metal} não encontrada`);

      const preco   = metal.precos[item.tamanho] || 0;
      const subItem = preco * item.quantidade;
      subtotal     += subItem;

      itensProcessados.push({
        metalId:       metal.id,
        nomeMetal:     metal.nome,
        tamanho:       item.tamanho,
        quantidade:    item.quantidade,
        precoUnitario: preco,
        subtotal:      subItem,
      });
    }

    const total        = subtotal + (taxaEntrega || 0);
    const contagem     = get('SELECT COUNT(*) as total FROM pedidos');
    const numeroPedido = (contagem?.total || 0) + 1;

    const infoPedido = run(`
      INSERT INTO pedidos
        (numero_pedido, cliente_id, subtotal, taxa_entrega, total,
         forma_pagamento, troco, observacoes, endereco, origem, entregador_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [numeroPedido, clienteId, subtotal, taxaEntrega || 0, total,
        formaPagamento, troco || 0, observacoes, endereco, origem, entregadorId]);

    const pedidoId = infoPedido.lastInsertRowid;

    for (const it of itensProcessados) {
      run(`
        INSERT INTO itens_pedido
          (pedido_id, metal_id, nome_metal, tamanho, quantidade, preco_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [pedidoId, it.metalId, it.nomeMetal, it.tamanho, it.quantidade, it.precoUnitario, it.subtotal]);
    }

    return this.findById(pedidoId);
  },

  //atualiza dados
  async updateStatus(id, status) {
    await ready;
    const info = run(
      "UPDATE pedidos SET status = ?, updated_at = datetime('now') WHERE id = ?",
      [status, id]
    );
    return info.changes > 0 ? this.findById(id) : null;
  },

  async delete(id) {
    await ready;
    // Deleta itens primeiro (sem CASCADE no sql.js)
    run('DELETE FROM itens_pedido WHERE pedido_id = ?', [id]);
    const info = run('DELETE FROM pedidos WHERE id = ?', [id]);
    return info.changes > 0;
  },
}; //deleta o pedido

module.exports = Pedido;
