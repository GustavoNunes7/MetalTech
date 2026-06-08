// Importar frameworks
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middlewares/auth");

// Caminho para os Models JS
const Usuario = require("../models/Usuario");
const Metal = require("../models/Metal");
const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");

// Manipulador de Rotas
router.post("/auth/login", async (req, res) => {
  try {

    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "E-mail e senha são obrigatórios"
      });
    }

    // FUNCIONÁRIOS
    let usuario = await Usuario.findByEmail(email);

    if (usuario) {

      const ok = await Usuario.verificarSenha(
        senha,
        usuario.senha
      );

      if (!ok) {
        return res.status(401).json({
          erro: "Credenciais inválidas"
        });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          perfil: usuario.perfil
        },
        process.env.JWT_SECRET,
        { expiresIn: "8h" }
      );

      return res.json({
        token,
        usuario
      });
    }

    // CLIENTES
    const cliente = await Cliente.findByEmail(email);

    if (!cliente) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    const senhaValida =
      await Cliente.verificarSenha(
        senha,
        cliente.senha
      );

    if (!senhaValida) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      });
    }

    const token = jwt.sign(
      {
        id: cliente.id,
        perfil: "Cliente"
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      token,
      usuario: {
        id: cliente.id,
        nome: cliente.nome,
        email: cliente.email,
        perfil: "Cliente"
      }
    });

  } catch (e) {
    res.status(500).json({
      erro: e.message
    });
  }
});

//  Requisição da Json no Caminho das metais no banco de dados caso dê erro
router.get("/metais", auth, async (req, res) => {
  try {
    res.json(await Metal.findAll());
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho das metais consultando pelo id da Metal caso dê erro
router.get("/metais/:id", auth, async (req, res) => {
  try {
    const p = await Metal.findById(req.params.id);
    if (!p) return res.status(404).json({ erro: "Metal não encontrada" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho das metais verificando se foi digitado o Nome e composição do metal
router.post("/metais", auth, async (req, res) => {
  try {
    if (!req.body.nome || req.body.nome.trim() === "") {
      return res.status(400).json({
        erro: "Nome é obrigatório",
      });
    }

    res.status(201).json(await Metal.create(req.body));
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// Requisição da Json no caminho das metais consultando pelo id da Metal caso dê erro, e tentando atualizar
router.put("/metais/:id", auth, async (req, res) => {
  try {
    // CORREÇÃO: Mudado de 'Metais.update' para 'Metal.update' (no singular)
    const p = await Metal.update(req.params.id, req.body);
    if (!p) return res.status(404).json({ erro: "Metal não encontrada" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho das metais consultando pelo id da Metais caso dê erro, e depois deletando a metal como opção
router.delete("/metais/:id", auth, async (req, res) => {
  try {
    const ok = await Metal.delete(req.params.id);
    if (!ok) return res.status(404).json({ erro: "Metal não encontrada" });
    res.json({ mensagem: "Metal deletada" });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes no banco de dados caso dê erro
router.get("/clientes", auth, async (req, res) => {
  try {
    res.json(await Cliente.findAll(req.query.busca));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes consultando pelo id do cliente caso dê erro
router.get("/clientes/:id", auth, async (req, res) => {
  try {
    const c = await Cliente.findById(req.params.id);
    if (!c) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(c);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes verificando se foi digitado o Nome e o telefone do cliente
router.post("/clientes", auth, async (req, res) => {
  try {
    if (!req.body.nome || !req.body.telefone)
      return res.status(400).json({ erro: "Nome e telefone são obrigatórios" });
    res.status(201).json(await Cliente.create(req.body));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes consultando pelo id do cliente caso dê erro, e tentando atualizar
router.put("/clientes/:id", auth, async (req, res) => {
  try {
    const c = await Cliente.update(req.params.id, req.body);
    if (!c) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json(c);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes consultando pelo id do cliente caso dê erro, e depois deletando o cliente como opção
router.delete("/clientes/:id", auth, async (req, res) => {
  try {
    const ok = await Cliente.delete(req.params.id);
    if (!ok) return res.status(404).json({ erro: "Cliente não encontrado" });
    res.json({ mensagem: "Cliente deletado" });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos pedidos no banco de dados caso dê erro
router.get("/pedidos", auth, async (req, res) => {
  try {
    const filtros = {};

    if (req.query.entregador) filtros.entregadorId = req.query.entregador;

    res.json(await Pedido.findAll(filtros));
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos pedidos consultando pelo id do pedido caso dê erro
router.get("/pedidos/:id", auth, async (req, res) => {
  try {
    const p = await Pedido.findById(req.params.id);
    if (!p) return res.status(404).json({ erro: "Pedido não encontrado" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos clientes verificando se foi digitado o Nome ddo cliente, os itens e a forma de pagamento
router.post("/pedidos", auth, async (req, res) => {
  try {
    const { cliente, itens, formaPagamento } = req.body;
    if (!cliente || !itens?.length || !formaPagamento)
      return res
        .status(400)
        .json({ erro: "cliente, itens e formaPagamento são obrigatórios" });

    // Criação de novo pedido um novo e caso dê erro na criaçã
    const novo = await Pedido.create({
      clienteId: cliente,
      itens,
      taxaEntrega: req.body.taxaEntrega,
      formaPagamento,
      troco: req.body.troco,
      observacoes: req.body.observacoes,
      entrega: req.body.entrega,
      origem: req.body.origem,
      entregadorId: req.body.entregador || null,
    });
    res.status(201).json(novo);
  } catch (e) {
    res.status(400).json({ erro: e.message });
  }
});

// Atualizar parcialmente o status de um pedido específico.
router.patch("/pedidos/:id/status", auth, async (req, res) => {
  try {
    const validos = [
      "recebido",
      "em_preparo",
      "saiu_entrega",
      "entregue",
      "cancelado",
    ];
    if (!validos.includes(req.body.status))
      return res.status(400).json({ erro: "Status inválido" });
    const p = await Pedido.updateStatus(req.params.id, req.body.status);
    if (!p) return res.status(404).json({ erro: "Pedido não encontrado" });
    res.json(p);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição da Json no caminho dos pedidos consultando pelo id do pedido0 caso dê erro, e depois deletando o pedido como opção

router.delete("/pedidos/:id", auth, async (req, res) => {
  try {
    const ok = await Pedido.delete(req.params.id);
    if (!ok) return res.status(404).json({ erro: "Pedido não encontrado" });
    res.json({ mensagem: "Pedido deletado" });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição para apenas os Administradores poderem acessar
router.get("/usuarios", auth, async (req, res) => {
  try {
    if (req.usuario.perfil !== "Administrador")
      return res
        .status(403)
        .json({ erro: "Acesso restrito a Administradores" });
    res.json(await Usuario.findAll());
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição para apenas os Administradores poderem acessar e o gerenciamento de cadastros
router.post("/usuarios", auth, async (req, res) => {
  try {
    if (req.usuario.perfil !== "Administrador")
      return res
        .status(403)
        .json({ erro: "Acesso restrito a Administradores" });
    const { nome, email, senha, perfil } = req.body;
    if (!nome || !email || !senha)
      return res
        .status(400)
        .json({ erro: "Nome, email e senha são obrigatórios" });
    res.status(201).json(await Usuario.create({ nome, email, senha, perfil }));
  } catch (e) {
    if (e.message?.includes("UNIQUE"))
      return res.status(400).json({ erro: "E-mail já cadastrado" });
    res.status(500).json({ erro: e.message });
  }
});

// Requisição para apenas os Administradores poderem acessar e o gerenciamento de cadastros, como atualizar cadastros
router.put("/usuarios/:id", auth, async (req, res) => {
  try {
    if (req.usuario.perfil !== "Administrador")
      return res
        .status(403)
        .json({ erro: "Acesso restrito a Administradores" });
    const u = await Usuario.update(req.params.id, req.body);
    if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json(u);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

// Requisição para apenas os Administradores poderem acessar e o gerenciamento de cadastros, como deletar cadastros

router.delete("/usuarios/:id", auth, async (req, res) => {
  try {
    if (req.usuario.perfil !== "Administrador")
      return res
        .status(403)
        .json({ erro: "Acesso restrito a Administradores" });
    const ok = await Usuario.delete(req.params.id);
    if (!ok) return res.status(404).json({ erro: "Usuário não encontrado" });
    res.json({ mensagem: "Usuário deletado" });
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.post("/usuarios", async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);

    res.status(201).json(usuario);
  } catch (erro) {
    res.status(400).json({
      erro: erro.message
    });
  }
});


router.post("/cadastro", async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);

    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});


router.post('/clientes/login', async (req, res) => {

  try {

    const { email, senha } = req.body;

    const cliente = await Cliente.findByEmail(email);

    if (!cliente) {
      return res.status(401).json({
        erro: 'Cliente não encontrado'
      });
    }

    const ok = await Cliente.verificarSenha(
      senha,
      cliente.senha
    );

    if (!ok) {
      return res.status(401).json({
        erro: 'Senha incorreta'
      });
    }

    res.json({
      sucesso: true,
      cliente
    });

  } catch (erro) {

    res.status(500).json({
      erro: erro.message
    });

  }

});


router.post('/clientes/login', async (req, res) => {

  try {

    const { email, senha } = req.body;

    const cliente =
      await Cliente.findByEmail(email);

    if (!cliente) {
      return res.status(401).json({
        erro: 'Cliente não encontrado'
      });
    }

    const senhaOk =
      await Cliente.verificarSenha(
        senha,
        cliente.senha
      );

    if (!senhaOk) {
      return res.status(401).json({
        erro: 'Senha inválida'
      });
    }

    const token = jwt.sign(
      {
        id: cliente.id,
        tipo: 'cliente'
      },
      process.env.JWT_SECRET
    );

    res.json({
      token,
      cliente
    });

  } catch (erro) {

    console.error(erro);

    res.status(500).json({
      erro: 'Erro no login'
    });

  }

});


router.get('/cliente/:id', async (req,res)=>{

  const pedidos = await Pedido.findByCliente(
    req.params.id
  );

  res.json(pedidos);

});

router.get('/meus-pedidos', auth, async (req, res) => {

  try {

    if (req.usuario.perfil !== 'Cliente') {
      return res.status(403).json({
        erro: 'Acesso permitido apenas para clientes'
      });
    }

    const pedidos = await Pedido.findByCliente(
      req.usuario.id
    );

    res.json(pedidos);

  } catch (erro) {

    res.status(500).json({
      erro: erro.message
    });

  }

});

// Exportar um objeto de rotas
module.exports = router;
