// ============================================================
// Pizza.js — Model de Pizza (sql.js)
// ============================================================


const { ready, query, run, get } = require('../database/sqlite'); //Parte que organiza os dados do banco para: registrar, atualizar, buscar e deletar. Realizado
                                                                  //isso por meio do requerimento da rota do banco de dados.


//Tabela do banco de dados para organizar e registrar os dados usado SQLite da pizza
function formatarPizza(row) {
  if (!row) return null;
  return {
    _id:         row.id,
    id:          row.id,
    nome:        row.nome,
    descricao:   row.descricao,
    ingredientes: row.ingredientes,
    precos:      JSON.parse(row.precos || '{"P":0,"M":0,"G":0}'),
    disponivel:  row.disponivel === 1,
    categoria:   row.categoria,
    createdAt:   row.created_at,
    updatedAt:   row.updated_at,
  };
}


//Bloco com os dados da pizza
const Pizza = {


  //Busca todas as pizzas do menu , organizadas por categoria e nome
  async findAll() {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    return query('SELECT * FROM pizzas ORDER BY categoria, nome').map(formatarPizza); // Ele vai retornar
  },


  //Procura a pizza atraves do ID
  async findById(id) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    return formatarPizza(get('SELECT * FROM pizzas WHERE id = ?', [id])); // Retorna a buscado da pizza pelo ID, usado o map como forma de deixar os dados prontos para o JSOM
  },


  //Adiciona no menu uma nova pizza a partir das categorias
  async create({ nome, descricao = '', ingredientes, precos = {}, disponivel = true, categoria = 'tradicional' }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const info = run(
      'INSERT INTO pizzas (nome, descricao, ingredientes, precos, disponivel, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [nome.trim(), descricao.trim(), ingredientes.trim(),
       JSON.stringify({ P: precos.P || 0, M: precos.M || 0, G: precos.G || 0 }),
       disponivel ? 1 : 0, categoria]
    );
    return this.findById(info.lastInsertRowid); //Retorna as informações para conferir os dados inseridos da nova pizza
  },
 //Atualiza os dados de uma pizza que ja existe no menu
  async update(id, { nome, descricao, ingredientes, precos, disponivel, categoria }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const atual = get('SELECT * FROM pizzas WHERE id = ?', [id]);
    if (!atual) return null; //Caso não encontre a pizza , ela não dará prosseguimento


    //Caso deseje alterar o nome o preço não será alterado
    const precosAtuais = JSON.parse(atual.precos || '{"P":0,"M":0,"G":0}');
    const precosFinal  = precos
      ? { P: precos.P ?? precosAtuais.P, M: precos.M ?? precosAtuais.M, G: precos.G ?? precosAtuais.G }
      : precosAtuais;


    run(`
      UPDATE pizzas SET
        nome         = ?,
        descricao    = ?,
        ingredientes = ?,
        precos       = ?,
        disponivel   = ?,
        categoria    = ?,
        updated_at   = datetime('now')
      WHERE id = ?
    `, [
      nome         ?? atual.nome,
      descricao    ?? atual.descricao,
      ingredientes ?? atual.ingredientes,
      JSON.stringify(precosFinal),
      disponivel   !== undefined ? (disponivel ? 1 : 0) : atual.disponivel,
      categoria    ?? atual.categoria,
      id
    ]);


    return this.findById(id); // Retorna com as novas informações inseridas
  },
  //Delta uma pizza através do ID
  async delete(id) {
    await ready;
    const info = run('DELETE FROM pizzas WHERE id = ?', [id]); // seleciona o ID da pizza que será eliminada do menu
    return info.changes > 0; // Se houver alguma alteração no banco de dados , ela voltara o dado como true
  },
};


module.exports = Pizza; // Modulo para executar a pizza
