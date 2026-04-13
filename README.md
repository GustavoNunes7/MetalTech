<h1>Sistema da Pizzaria 🍕</h1>
<br>

<img src="./src/images/Interface.png" alt="Interface do Site" width="500" height="300">
<img src="./src/images/Gerenciamento do cardápio.png" alt="Interface do Site" width="500" height="300">

<h3>O site feito foi para uma pizzaria, onde a pessoa pode acessar e fazer o pedido, no site tambem é atualizado o starus do pedido, como "sendo feito" ou "saiu para a entrega".</h3> 


Para a criação do site foi usado as seguntes tecnologias:
+ HTML
+ JavaScript
+ Node.js
+ NPM
+ CSS
+ .env
+ Banco de dados
+ Json

Utilizamos o Node.js e o npm como pré requisitos, baixamos as bibliotecas para então poder utilizar as demais ferramentas, pois eles deram o suporte necessario para nosso código.

Na programação o  suario interage com tudo da pasta public, principalmente o Index.HTML e o Style.CSS, as funcionalidades do site são feitas sua maioria pelo script.js, src e os bancos de dados, o banco de dados armazenas sobre as pizzas, usuarios, clientes, etc, enquanto o script e outras funcionalidades do src e outros js estão auxiliando para criação de novos usuarios, pedidos, etc.

Para dar play na programação primeiramente precisamos: 
iniciar o seed.js, após isso dar play no script.js e depois o index.html
para dar play no seed.js e no script.js precisa digiar no propt de comando o "*node seed.js*" para o seed e o "*node script.js*" para o script

<h2> Passo a passo para instalação e execução </h2>
1. Clone o repositório:

```bash
git clone [link-do-repositorio]
```

2. Entre na pasta do projeto:

```bash
cd Sistema_Pizza_Engenharia_Reversa
```

3. Instale as dependências:
```bash
npm install
```

4. Configure  o arquivo .env
Abre o arquivo e personaliza as informações do seu jeito
```bash
PORT=3000  ->
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_db"
JWT_SECRET=sua_chave_secreta
```

5. Execute o comando seed.js
```bash
node seed.js
```

6. Execute o comando index.js que está na raiz
```bash
node index.js
```
7. Execute o localhost no navegador
```bash
http://localhost:' + PORT
```
<br>


<h2>Estrutura de Pastas Explicada</h2>
<img src="./src/images/Estrutura.png" alt="Interface do Site" >

```text

SIstema_Pizza_Engenharia_Reversa/
├── 📁 public/  #  Arquivos Estáticos
    |── index.html
    |── script.js
    |── style.css    
|        
├── 📁 src/  #Pasta Raiz
     |── 📁 database #Organiza o arquivos relacionados com dados
|           |── sqlite.js
|      
├── 📁 images/          # Imagens utilizado no README.md
├── 📁 middlewares/     # Software intermediário 
├── 📁 models/          # Armazenar estruturas de dados 
    |── Cliente.js
    |── Pedido.js
    |── Pizza.js
    |── Usuario.js
|   
├── 📁 routes/          # Definem caminhos
    |── index.js
|    
├── .env          # Armazenamento de variáveis de ambiente
├── .gitignore          # Arquivos ignorados pelo Git
├── README.md           # Documentação do projeto
├── index.js            # Servidor
├── seed.js             # Insere dados no banco de dados
├── pizzaria.db         # Banco de dados
├── README.md           # Documentação do projeto
├── package-lock.json   # Dependências do projet
└── package.json        # Dependências do projeto

```

<h2>Funcionalidades e como testá-las.</h2>
## 🚀 Endpoints da API


| Método | Endpoint | Descrição | Autenticado |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/login` | Login e geração de JWT | ❌ |
| `GET` | `/users` | Listar usuários | ✅ |
| `POST` | `/produtos` | Cadastrar novo produto | ✅ |


<h2>Credenciais de teste.</h2>
<img src="./src/images/credenciais.png" alt="Interface do Site" width="500" height="300">

<h2> Desafios encontrados durante a engenharia reversa e como foram solucionados.</h2>
 1- Erros no código. <br></br>
 2- Problemas com o JSOM. <br></br>
 3- Organizar os arquivos nas pastas.<br></br>
 4- Compreender o código. <br></br>

<h2>Possíveis melhorias futuras.</h2>
1- Seguranças de senha. <br></br>
2- Adicionar outros produtos. <br></br>
3- Adaptar para diferentes dispositivos móveis. <br></br>
