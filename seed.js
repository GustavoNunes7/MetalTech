require('dotenv').config();
//carrega variáveis de ambiente definidas em um arquivo chamado .env para o objeto process.env da aplicação

const { ready, run, query } = require('./src/database/sqlite');
const bcrypt = require('bcryptjs');

async function seed() {
  //limpa o banco de dados

  try {
    await ready;
    console.log('🧹 Limpando banco...');

    run('DELETE FROM itens_pedido');
    run('DELETE FROM pedidos');
    run('DELETE FROM metais');
    run('DELETE FROM clientes');
    run('DELETE FROM usuarios');

    try {
      run("DELETE FROM sqlite_sequence WHERE name IN ('itens_pedido','pedidos','metais','clientes','usuarios')");
    } catch(_) { }

    console.log('✅ Banco limpo');

    const hash = await bcrypt.hash('12345', 10);
    //para inserir informações sobre os usuarios para cirar as contas deles nas tabelas dos bancos de dados
    run('INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      ['Administrador Master', 'admin@metaltech.com', hash, 'Administrador']);
    run('INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      ['Atendente Oficial', 'atendente@metaltech.com', hash, 'Atendente']);
    run('INSERT INTO usuarios (nome, email, senha, perfil) VALUES (?, ?, ?, ?)',
      ['Entregador Oficial', 'entregador@metaltech.com', hash, 'Entregador']);
    

    console.log('✅ 3 usuários criados');
       //aqui temos os cadastros dos usuarios que já foram criados, aqui temos não só nome mas tambem numero, onde moram e qual as preferencias deles em seus pedidos
    const clientes = [
      ['Lucas Ferreira Santos',   '11991234501', {rua:'Rua das Acácias',numero:'142',bairro:'Vila Madalena',cidade:'São Paulo',cep:'05435-000'}, 'Alérgico a glúten'],
      ['Camila Rodrigues Lima',   '11991234502', {rua:'Av. Paulista',numero:'900',bairro:'Bela Vista',cidade:'São Paulo',cep:'01310-100'}, ''],
      ['Rafael Oliveira Costa',   '11991234503', {rua:'Rua Oscar Freire',numero:'55',bairro:'Jardins',cidade:'São Paulo',cep:'01426-001'}, 'Prefere entrega após 19h'],
      ['Isabela Martins Souza',   '11991234504', {rua:'Rua Consolação',numero:'310',bairro:'Consolação',cidade:'São Paulo',cep:'01302-000'}, ''],
      ['Bruno Almeida Pereira',   '11991234505', {rua:'Rua Augusta',numero:'780',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01304-001'}, 'Intolerante a lactose'],
      ['Juliana Nascimento Dias', '11991234506', {rua:'Rua Haddock Lobo',numero:'220',bairro:'Jardim América',cidade:'São Paulo',cep:'01414-000'}, ''],
      ['Thiago Carvalho Mendes',  '11991234507', {rua:'Alameda Santos',numero:'415',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01419-000'}, 'Cliente VIP'],
      ['Fernanda Gomes Ribeiro',  '11991234508', {rua:'Rua Fradique Coutinho',numero:'88',bairro:'Pinheiros',cidade:'São Paulo',cep:'05416-010'}, ''],
      ['Diego Barbosa Freitas',   '11991234509', {rua:'Rua Wisard',numero:'305',bairro:'Vila Madalena',cidade:'São Paulo',cep:'05434-080'}, 'Sem cebola nos pedidos'],
      ['Larissa Teixeira Moura',  '11991234510', {rua:'Rua Amauri',numero:'60',bairro:'Itaim Bibi',cidade:'São Paulo',cep:'01448-000'}, ''],
      ['Matheus Cardoso Nunes',   '11991234511', {rua:'Rua Pamplona',numero:'1200',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01405-002'}, ''],
      ['Patrícia Rocha Vieira',   '11991234512', {rua:'Av. Brigadeiro Faria Lima',numero:'2000',bairro:'Pinheiros',cidade:'São Paulo',cep:'01452-000'}, 'Prefere pagamento em dinheiro'],
      ['Anderson Silva Campos',   '11991234513', {rua:'Rua Estados Unidos',numero:'175',bairro:'Jardim América',cidade:'São Paulo',cep:'01427-000'}, ''],
      ['Natália Araújo Castro',   '11991234514', {rua:'Rua José Maria Lisboa',numero:'530',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01423-000'}, 'Vegetariana'],
      ['Felipe Cunha Rezende',    '11991234515', {rua:'Rua Ministro Rocha Azevedo',numero:'72',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01410-001'}, ''],
      ['Vanessa Lopes Guimarães', '11991234516', {rua:'Rua Bela Cintra',numero:'450',bairro:'Consolação',cidade:'São Paulo',cep:'01415-000'}, 'Sem pimenta'],
      ['Gustavo Pires Andrade',   '11991234517', {rua:'Rua da Consolação',numero:'1800',bairro:'Higienópolis',cidade:'São Paulo',cep:'01301-100'}, ''],
      ['Aline Moreira Fonseca',   '11991234518', {rua:'Av. Higienópolis',numero:'618',bairro:'Higienópolis',cidade:'São Paulo',cep:'01238-001'}, 'Cliente frequente'],
      ['Rodrigo Tavares Monteiro','11991234519', {rua:'Rua Itapeva',numero:'286',bairro:'Bela Vista',cidade:'São Paulo',cep:'01332-000'}, ''],
      ['Carolina Batista Pinto',  '11991234520', {rua:'Rua Peixoto Gomide',numero:'1100',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01409-001'}, 'Prefere bordas recheadas'],
    ];

    for (const [nome, tel, end, obs] of clientes) {
      run('INSERT INTO clientes (nome, telefone, endereco, observacoes) VALUES (?, ?, ?, ?)',
        [nome, tel, JSON.stringify(end), obs]);
        //para criar os clientes
    }
    console.log('✅ 20 clientes criados');

    const metais = [
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],
      ['Nome do Produto','Descrição','peça','tamanho EX:{P:35,M:45,G:55}','categoria'],

     
    ]

    for (const [nome, desc,pdt, precos, cat] of metais) {
      run('INSERT INTO metais (nome, descricao, produtos, precos, categoria) VALUES (?, ?, ?, ?, ?)',
        [nome, desc, pdt, JSON.stringify(precos), cat]);
        //para criar novos sabores de metais

    }
    console.log('✅ 20 metais criadas');

    console.log('======================================');
    console.log('🔥 SEED EXECUTADO COM SUCESSO!');
    console.log('======================================');
    console.log('Login: admin@metaltech.com | Senha: 12345');
    console.log('======================================');
    //avisa se foi executado com sucesso e caso não o que está escrito abaixo avisa de erro
    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO NO SEED:', err);
    process.exit(1);
  }
}

seed(); //ativa a função
