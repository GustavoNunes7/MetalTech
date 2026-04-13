// ============================================================
// Usuario.js — Model de Usuário (sql.js)
// ============================================================


const { ready, query, run, get } = require('../database/sqlite'); //Parte que organiza os dados do banco para: registrar, atualizar, buscar e deletar. Realizado
                                                                  //isso por meio do requerimento da rota do banco de dados.
const bcrypt = require('bcryptjs'); // Usado para fazer a Crepitação das senhas


//Tabela do banco de dados para organizar e registrar os dados usado SQLite do usuário
function formatarUsuario(row) {
  if (!row) return null;
  return {
    _id:       row.id,
    id:        row.id,
    nome:      row.nome,
    email:     row.email,
    perfil:    row.perfil,
    ativo:     row.ativo === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


//Bloco com os dados do usuário
const Usuario = {


  //Procura os dados  do usuário cadastro
  async findAll() {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const rows = query(`
      SELECT id, nome, email, perfil, ativo, created_at, updated_at
      FROM usuarios ORDER BY created_at DESC
    `);
    return rows.map(formatarUsuario); //Organiza as informações antes de enviar
  },


  //Procura o usuário pelo email
  async findByEmail(email) {
    await ready;//Executa quando o banco de dados estiver conectado, para evitar erros
    return get('SELECT * FROM usuarios WHERE email = ?', [email.toLowerCase().trim()]); // Retorna de volta transformado todas as letras em  maiúsculo para minúsculo e retira espaços vazios do email
  },


  //Procura um usuário específico pelo ID
  async findById(id) {
    await ready; //Executa quando o banco de dados estiver conectado, para evitar erros
    const row = get(`
      SELECT id, nome, email, perfil, ativo, created_at, updated_at
      FROM usuarios WHERE id = ?
    `, [id]);
    return formatarUsuario(row); // Retorna todos os dados organizados que foram encontrados no sistema
  },


  // A cada novo cadastro de usuário, ele vai registra ou salvar no banco de dados
  async create({ nome, email, senha, perfil = 'Atendente' }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const hash = await bcrypt.hash(senha, 10); //criptografa cada senha em um codigo de segura
    const info = run(
      'INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      [nome.trim(), email.toLowerCase().trim(), hash, perfil]
    );
    return this.findById(info.lastInsertRowid); // retorna
  },


  //Atualiza os dados dos usuários que já existem
  async update(id, { nome, email, senha, perfil, ativo }) {
    await ready;  //Executa quando o banco de dados estiver conectado, para evitar erros
    const atual = get('SELECT * FROM usuarios WHERE id = ?', [id]); // Procurar o usuário específico por meio do ID
    if (!atual) return null; // Caso ele não encontre esse usuário, ele não irá prosseguir


    //Se tiver uma nova senha ela será criptografa e se não apenas manterá a senha antiga no banco
    let senhaFinal = atual.senha;
    if (senha) senhaFinal = await bcrypt.hash(senha, 10);


    run(`
      UPDATE usuarios SET
        nome       = ?,
        email      = ?,
        senha      = ?,
        perfil     = ?,
        ativo      = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `, [
      nome   ?? atual.nome,
      email  ?? atual.email,
      senhaFinal,
      perfil ?? atual.perfil,
      ativo !== undefined ? (ativo ? 1 : 0) : atual.ativo,
      id
    ]);


    return this.findById(id); // Retorna com os novos dados atualizados
  },


  //Delta um usuário
  async delete(id) {
    await ready;//Executa quando o banco de dados estiver conectado, para evitar erros
    const info = run('DELETE FROM usuarios WHERE id = ?', [id]); // Pegar as informações do usuário que deseja ser deletado
    return info.changes > 0; // Se apagar ele retornará como true ou seja ("verdadeiro")
  },
//Faz a verificação da senha criptografada
  verificarSenha(senhaDigitada, hashSalvo) {
    return bcrypt.compare(senhaDigitada, hashSalvo); //retorna
  },
};


module.exports = Usuario; // Modulo para executar o usuario
