// ============================================================
// Metal.js — Model de Metal (sql.js)
// ============================================================


const { ready, query, run, get } = require('../database/sqlite'); //Parte que organiza os dados do banco para: registrar, atualizar, buscar e deletar. Realizado
                                                                  //isso por meio do requerimento da rota do banco de dados.


//Tabela do banco de dados para organizar e registrar os dados usado SQLite da metais
function formatarMetal(row) {
  if (!row) return null;
  return {
    _id:         row.id,
    id:          row.id,
    nome:        row.nome,
    descricao:   row.descricao,
    produtos:    row.produtos,
    precos:      JSON.parse(row.precos || '{"P":0,"M":0,"G":0}'),
    disponivel:  row.disponivel === 1,
    categoria:   row.categoria,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}


//Bloco com os dados da metal
const Metal = {


  //Busca todas as metais do menu , organizadas por categoria e nome
  async findAll() {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    return query('SELECT * FROM metais ORDER BY categoria, nome').map(formatarMetal); // Ele vai retornar
  },


  //Procura a metal atraves do ID
  async findById(id) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    return formatarMetal(get('SELECT * FROM metais WHERE id = ?', [id])); // Retorna a buscado da metal pelo ID, usado o map como forma de deixar os dados prontos para o JSOM
  },


  //Adiciona no menu uma nova metal a partir das categorias
  async create({ nome, descricao = '', produtos, precos = {}, disponivel = true, categoria = 'tradicional' }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const info = run(
      'INSERT INTO metais (nome, descricao, produtos, precos, disponivel, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nome.trim(), descricao.trim(), produtos.trim(),
       JSON.stringify({ P: precos.P || 0, M: precos.M || 0, G: precos.G || 0 }),
       disponivel ? 1 : 0, categoria]
    );
    return this.findById(info.lastInsertRowid); //Retorna as informações para conferir os dados inseridos da nova metal
  },
 //Atualiza os dados de uma metal que ja existe no menu
  async update(id, { nome, descricao, produto, precos, disponivel, categoria }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const atual = get('SELECT * FROM metais WHERE id = ?', [id]);
    if (!atual) return null; //Caso não encontre a metal , ela não dará prosseguimento


    //Caso deseje alterar o nome o preço não será alterado
    const precosAtuais = JSON.parse(atual.precos || '{"P":0,"M":0,"G":0}');
    const precosFinal  = precos
      ? { P: precos.P ?? precosAtuais.P, M: precos.M ?? precosAtuais.M, G: precos.G ?? precosAtuais.G }
      : precosAtuais;


    run(`
      UPDATE metais SET
        nome         = ?,
        descricao    = ?,
        produtos = ?,
        precos       = ?,
        disponivel   = ?,
        categoria    = ?,
        updated_at   = datetime('now')
      WHERE id = ?
    `, [
      nome         ?? atual.nome,
      descricao    ?? atual.descricao,
      produto      ?? atual.produtos,
      JSON.stringify(precosFinal),
      disponivel   !== undefined ? (disponivel ? 1 : 0) : atual.disponivel,
      categoria    ?? atual.categoria,
      id
    ]);


    return this.findById(id); // Retorna com as novas informações inseridas
  },
  //Delta uma metal através do ID
  async delete(id) {
    await ready;
    const info = run('DELETE FROM metais WHERE id = ?', [id]); // seleciona o ID da metal que será eliminada do menu
    return info.changes > 0; // Se houver alguma alteração no banco de dados , ela voltara o dado como true
  },
};


module.exports = Metal; // Modulo para executar a metal
