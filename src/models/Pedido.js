const { ready, query, run, get } = require('../database/sqlite');

const SELECT_PEDIDO = `
  SELECT p.*, c.nome AS cliente_nome, c.telefone AS cliente_telefone
  FROM pedidos p
  LEFT JOIN clientes c ON c.id = p.cliente_id
`;

function formatarPedido(row, itens = []) {
  if (!row) return null;
  return {
    id: row.id,
    numeroPedido: row.numero_pedido,
    cliente: { id: row.cliente_id, nome: row.cliente_nome, telefone: row.cliente_telefone },
    itens: itens.map(it => ({
      metal: it.metal_id,
      nomeMetal: it.nome_metal,
      tamanho: it.tamanho,
      quantidade: it.quantidade,
      precoUnitario: it.preco_unitario,
      subtotal: it.subtotal,
    })),
    total: row.total,
    status: row.status,
    entregador: row.entregador_id
  };
}

const Pedido = {
  async findAll() {
    await ready;
    const rows = query(`${SELECT_PEDIDO} ORDER BY p.created_at DESC`);
    return rows.map(row => {
      const itens = query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [row.id]);
      return formatarPedido(row, itens);
    });
  },

  async findById(id) {
    await ready;
    const row = get(`${SELECT_PEDIDO} WHERE p.id = ?`, [id]);
    if (!row) return null;
    const itens = query('SELECT * FROM itens_pedido WHERE pedido_id = ?', [id]);
    return formatarPedido(row, itens);
  },

  async create({ clienteId, itens, taxaEntrega = 0, formaPagamento, entregadorId = null }) {
    await ready;
    const MetalModel = require('./Metal'); // Nome alterado para evitar erro
    let subtotal = 0;
    const itensProcessados = [];

    for (const item of itens) {
      const metalInfo = await MetalModel.findById(item.metal); // Nome alterado aqui também
      if (!metalInfo) throw new Error(`Metal ${item.metal} não encontrado`);

      const preco = metalInfo.precos[item.tamanho] || 0;
      const subItem = preco * item.quantidade;
      subtotal += subItem;

      itensProcessados.push({
        metalId: metalInfo.id,
        nomeMetal: metalInfo.nome,
        tamanho: item.tamanho,
        quantidade: item.quantidade,
        precoUnitario: preco,
        subtotal: subItem
      });
    }

    const total = subtotal + taxaEntrega;
    const infoPedido = run(`
      INSERT INTO pedidos (cliente_id, subtotal, taxa_entrega, total, forma_pagamento, entregador_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [clienteId, subtotal, taxaEntrega, total, formaPagamento, entregadorId]);

    const pedidoId = infoPedido.lastInsertRowid;
    for (const it of itensProcessados) {
      run(`
        INSERT INTO itens_pedido (pedido_id, metal_id, nome_metal, tamanho, quantidade, preco_unitario, subtotal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [pedidoId, it.metalId, it.nomeMetal, it.tamanho, it.quantidade, it.precoUnitario, it.subtotal]);
    }
    return this.findById(pedidoId);
  }
};

module.exports = Pedido;
