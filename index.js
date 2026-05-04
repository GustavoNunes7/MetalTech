require('dotenv').config() // Requerimento utilizado para funcionar o código dentro do arquivo no Node.js


const express = require('express') // Requerimento para criar o servidor
const cors = require('cors') // Requerimento é ativado para que o front-end acesse ou funcione na API
const path = require('path') // Requerimento dos caminhos dos diretorios


const app = express() // Rota onde vai funcionar o servidor
const PORT = process.env.PORT || 3001 // número da porta do servidor, onde ela vai rodar


app.use(cors()) // Libera o acesso externo da API
app.use(express.json()) // Traduz para que os dados em formato de JSOM , possam ser entendido pelo servidor
app.use(express.static(path.join(__dirname, 'public'))) //Faz com que a programação se torne público


const { ready } = require('./src/database/sqlite') // importa os dados dentro do banco de dados
const routes = require('./src/routes/index') // importa os arquivos e as rotas que serão utilizadas
//Bloco para poder executar a programação
ready.then(() => {
  app.use('/api', routes) // Local que juntas as rotas da API
  //
  app.get('/teste', (req, res) => {
    res.json({ mensagem: 'API do sistema funcionando!', status: 'online', porta: PORT }) // Rota teste que vai testa se o sistema está funcionado ou ligado
  })
  //
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')) //Caso a rota não seja uma API, o usuário vai automaticamente receber "index.html"
  })
  // Mostra quando o servidor estiver funcionado ou rodado
  app.listen(PORT, () => {
    console.log('=================================')
    console.log('Servidor rodando na porta ' + PORT)
    console.log('API: http://localhost:' + PORT + '/api')
    console.log('Front-end: http://localhost:' + PORT)
    console.log('=================================')
  })
  //Caso ele não funcione , aparecerá a mensagem informando o erro
}).catch(err => {
  console.error('Erro ao inicializar banco:', err)
  process.exit(1) //Encerra a programação
})
    