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

    const hash = await bcrypt.hash('123456', 10);
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
      ['Lucas Ferreira Santos',   '11991234501', {rua:'Rua das Acácias',numero:'142',bairro:'Vila Madalena',cidade:'São Paulo',cep:'05435-000'}, 'Apartamento'],
      ['Camila Rodrigues Lima',   '11991234502', {rua:'Av. Paulista',numero:'900',bairro:'Bela Vista',cidade:'São Paulo',cep:'01310-100'}, ''],
      ['Rafael Oliveira Costa',   '11991234503', {rua:'Rua Oscar Freire',numero:'55',bairro:'Jardins',cidade:'São Paulo',cep:'01426-001'}, ''],
      ['Isabela Martins Souza',   '11991234504', {rua:'Rua Consolação',numero:'310',bairro:'Consolação',cidade:'São Paulo',cep:'01302-000'}, 'Casa em viela'],
      ['Bruno Almeida Pereira',   '11991234505', {rua:'Rua Augusta',numero:'780',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01304-001'}, 'Condóminio'],
      ['Juliana Nascimento Dias', '11991234506', {rua:'Rua Haddock Lobo',numero:'220',bairro:'Jardim América',cidade:'São Paulo',cep:'01414-000'}, ''],
      ['Thiago Carvalho Mendes',  '11991234507', {rua:'Alameda Santos',numero:'415',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01419-000'}, 'Casa de Esquina'],
      ['Fernanda Gomes Ribeiro',  '11991234508', {rua:'Rua Fradique Coutinho',numero:'88',bairro:'Pinheiros',cidade:'São Paulo',cep:'05416-010'}, ''],
      ['Diego Barbosa Freitas',   '11991234509', {rua:'Rua Wisard',numero:'305',bairro:'Vila Madalena',cidade:'São Paulo',cep:'05434-080'}, 'Não tocar campanhinha'],
      ['Larissa Teixeira Moura',  '11991234510', {rua:'Rua Amauri',numero:'60',bairro:'Itaim Bibi',cidade:'São Paulo',cep:'01448-000'}, ''],
      ['Matheus Cardoso Nunes',   '11991234511', {rua:'Rua Pamplona',numero:'1200',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01405-002'}, ''],
      ['Patrícia Rocha Vieira',   '11991234512', {rua:'Av. Brigadeiro Faria Lima',numero:'2000',bairro:'Pinheiros',cidade:'São Paulo',cep:'01452-000'}, 'Prefere pagamento em dinheiro'],
      ['Anderson Silva Campos',   '11991234513', {rua:'Rua Estados Unidos',numero:'175',bairro:'Jardim América',cidade:'São Paulo',cep:'01427-000'}, ''],
      ['Natália Araújo Castro',   '11991234514', {rua:'Rua José Maria Lisboa',numero:'530',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01423-000'}, 'Alégico a cobre'],
      ['Felipe Cunha Rezende',    '11991234515', {rua:'Rua Ministro Rocha Azevedo',numero:'72',bairro:'Cerqueira César',cidade:'São Paulo',cep:'01410-001'}, ''],
      ['Vanessa Lopes Guimarães', '11991234516', {rua:'Rua Bela Cintra',numero:'450',bairro:'Consolação',cidade:'São Paulo',cep:'01415-000'}, ''],
      ['Gustavo Pires Andrade',   '11991234517', {rua:'Rua da Consolação',numero:'1800',bairro:'Higienópolis',cidade:'São Paulo',cep:'01301-100'}, ''],
      ['Aline Moreira Fonseca',   '11991234518', {rua:'Av. Higienópolis',numero:'618',bairro:'Higienópolis',cidade:'São Paulo',cep:'01238-001'}, 'Cliente frequente'],
      ['Rodrigo Tavares Monteiro','11991234519', {rua:'Rua Itapeva',numero:'286',bairro:'Bela Vista',cidade:'São Paulo',cep:'01332-000'}, ''],
      ['Carolina Batista Pinto',  '11991234520', {rua:'Rua Peixoto Gomide',numero:'1100',bairro:'Jardim Paulista',cidade:'São Paulo',cep:'01409-001'}, ''],
    ];

    for (const [nome, tel, end, obs] of clientes) {
      run('INSERT INTO clientes (nome, telefone, endereco, observacoes) VALUES (?, ?, ?, ?)',
        [nome, tel, JSON.stringify(end), obs]);
        //para criar os clientes
    }
    console.log('✅ 20 clientes criados');

    //aqui guarda todos os sabores, igredientes e tipos/tamanhos das metais
      // Padronizado: [Nome, Descrição, Composição/Detalhe, Preços, Categoria]
    const metais = [
      ['Aço Carbono', 'Metal versátil de alta resistência mecânica para estruturas.', 'Ferro e Carbono (até 2%)', {P:35, M:45, G:55}, 'aco'],
      ['Cobre Comercial', 'Excelente condutor térmico e elétrico com alta maleabilidade.', 'Cobre Puro', {P:34, M:44, G:54}, 'cobre'],
      ['Alumínio Naval', 'Material leve e com alta resistência à corrosão marítima.', 'Alumínio e Magnésio', {P:38, M:48, G:58}, 'aluminio'],
      ['Latão Amarelo', 'Liga metálica brilhante com excelente usinabilidade e brilho.', 'Cobre e Zinco', {P:33, M:43, G:53}, 'cobre'],
      ['Bronze Estrutural', 'Alta resistência ao desgaste, antifricção e ótima usinabilidade.', 'Cobre e Estanho', {P:40, M:50, G:60}, 'cobre'],
      ['Zinco Galvanizado', 'Usado para revestir o ferro e evitar a oxidação precoce.', 'Zinco Puro', {P:38, M:48, G:58}, 'ferro'],
      ['Aço Galvanizado', 'Chapa de aço revestida com camada protetora de zinco.', 'Aço e Revestimento de Zinco', {P:37, M:47, G:57}, 'aco'],
      ['Aço Inox 304', 'Alta resistência à oxidação e excelente para fins sanitários.', 'Aço, Cromo e Níquel', {P:45, M:55, G:65}, 'aco'],
      ['Aço Inox 316', 'Resistência superior a cloretos e ambientes químicos agressivos.', 'Aço, Cromo, Níquel e Molibidênio', {P:52, M:62, G:72}, 'aco'],
      ['Ferro Fundido Cinzento', 'Excelente amortecimento de vibrações e facilidade de usinagem.', 'Ferro, Carbono e Silício', {P:45, M:55, G:65}, 'ferro'],
      ['Ferro Nodular', 'Alta tenacidade e ductilidade próxima às propriedades do aço.', 'Ferro com Grafita Esferoidal', {P:50, M:65, G:80}, 'ferro'],
      ['Alumínio Anodizado', 'Alumínio com camada de óxido protetora e acabamento fosco.', 'Alumínio Anodizado', {P:48, M:58, G:68}, 'aluminio'],
      ['Ferro Gusa', 'Produto imediato da redução do minério de ferro em alto-forno.', 'Ferro com Alto Carbono', {P:28, M:38, G:48}, 'ferro'],
      ['Cobre Berílio', 'Liga de cobre de altíssima dureza e resistência mecânica.', 'Cobre e Berílio', {P:85, M:110, G:135}, 'cobre'],
      ['Alumínio Composto (ACM)', 'Painel formado por duas chapas de alumínio e núcleo de polietileno.', 'Alumínio e Polietileno', {P:55, M:70, G:85}, 'aluminio'],
      ['Aço Ferramenta H13', 'Alta tenacidade e resistência à fadiga térmica em trabalho a quente.', 'Liga de Cromo-Molibidênio-Vanádio', {P:68, M:85, G:102}, 'aco'],
      ['Aço Mola', 'Alta capacidade de sofrer deformação elástica sem perder a forma.', 'Aço de Alto Carbono', {P:42, M:52, G:62}, 'aco'],
      ['Ferro Forjado', 'Ferro purificado maleável que pode ser trabalhado em bigornas.', 'Ferro Comercial Puro', {P:36, M:46, G:56}, 'ferro'],
      ['Alumínio Duradural', 'Liga de alta resistência mecânica utilizada na aviação.', 'Alumínio e Cobre', {P:60, M:75, G:90}, 'aluminio'],
      ['Cobre Eletrolítico', 'Fios e cabos de cobre de pureza máxima para redes elétricas.', 'Cobre Comercial Puro (99.9%)', {P:52, M:62, G:72}, 'cobre']
    ];

    // ATENÇÃO: Caso sua tabela NÃO tenha a coluna de "composicao", remova o "composicao" e um "?" da query.
    for (const [nome, desc, comp, precos, cat] of metais) {
      run('INSERT INTO metais (nome, descricao, composicao, precos, categoria) VALUES (?, ?, ?, ?, ?)',
        [nome, desc, comp, JSON.stringify(precos), cat]);
    }
    console.log('✅ 20 metais criados');


    console.log('======================================');
    console.log('🔥 SEED EXECUTADO COM SUCESSO!');
    console.log('======================================');
    console.log('Login: admin@metaltech.com | Senha: 123456');
    console.log('======================================');
    //avisa se foi executado com sucesso e caso não o que está escrito abaixo avisa de erro
    process.exit(0);
  } catch (err) {
    console.error('❌ ERRO NO SEED:', err);
    process.exit(1);
  }
}

seed(); //ativa a função
