// ============================================================
// routes/index.js — ROTAS ARRUMADAS
// ============================================================

const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const auth = require("../middlewares/auth");

const Usuario = require("../models/Usuario");
const Metal = require("../models/Metal");
const Cliente = require("../models/Cliente");
const Pedido = require("../models/Pedido");

// ============================================================
// LOGIN
// ============================================================

router.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res
        .status(400)
        .json({ erro: "E-mail e senha são obrigatórios" });
    }

    const usuario = await Usuario.findByEmail(email);

    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const ok = await Usuario.verificarSenha(
      senha,
      usuario.senha
    );

    if (!ok) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// ============================================================
// METAIS
// ============================================================

router.get("/metais", auth, async (req, res) => {
  try {
    res.json(await Metal.findAll());
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.get("/metais/:id", auth, async (req, res) => {
  try {
    const metal = await Metal.findById(req.params.id);

    if (!metal) {
      return res
        .status(404)
        .json({ erro: "Metal não encontrado" });
    }

    res.json(metal);
  } catch (e) {
    res.status(500).json({ erro: e.message });
  }
});

router.post("/metais", auth, async (req, res) => {
  try {
    if (!req.body.nome || !req.body.produtos) {
      return res.status(400).json({
        erro: "Nome e produtos são obrigatórios",
      });
    }

    const novo = await Metal.create(req.body);

    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.put("/metais/:id", auth, async (req, res) => {
  try {
    const metal = await Metal.update(
      req.params.id,
      req.body
    );

    if (!metal) {
      return res
        .status(404)
        .json({ erro: "Metal não encontrado" });
    }

    res.json(metal);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.delete("/metais/:id", auth, async (req, res) => {
  try {
    const ok = await Metal.delete(req.params.id);

    if (!ok) {
      return res
        .status(404)
        .json({ erro: "Metal não encontrado" });
    }

    res.json({
      mensagem: "Metal deletado",
    });
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// ============================================================
// CLIENTES
// ============================================================

router.get("/clientes", auth, async (req, res) => {
  try {
    res.json(
      await Cliente.findAll(req.query.busca)
    );
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.get("/clientes/:id", auth, async (req, res) => {
  try {
    const cliente = await Cliente.findById(
      req.params.id
    );

    if (!cliente) {
      return res.status(404).json({
        erro: "Cliente não encontrado",
      });
    }

    res.json(cliente);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.post("/clientes", auth, async (req, res) => {
  try {
    if (!req.body.nome || !req.body.telefone) {
      return res.status(400).json({
        erro: "Nome e telefone são obrigatórios",
      });
    }

    const novo = await Cliente.create(req.body);

    res.status(201).json(novo);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.put("/clientes/:id", auth, async (req, res) => {
  try {
    const cliente = await Cliente.update(
      req.params.id,
      req.body
    );

    if (!cliente) {
      return res.status(404).json({
        erro: "Cliente não encontrado",
      });
    }

    res.json(cliente);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.delete("/clientes/:id", auth, async (req, res) => {
  try {
    const ok = await Cliente.delete(req.params.id);

    if (!ok) {
      return res.status(404).json({
        erro: "Cliente não encontrado",
      });
    }

    res.json({
      mensagem: "Cliente deletado",
    });
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// ============================================================
// PEDIDOS
// ============================================================

router.get("/pedidos", auth, async (req, res) => {
  try {
    const filtros = {};

    if (req.query.usuario_id) {
      filtros.usuario_id = req.query.usuario_id;
    }

    res.json(await Pedido.findAll(filtros));
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.get("/pedidos/:id", auth, async (req, res) => {
  try {
    const pedido = await Pedido.findById(
      req.params.id
    );

    if (!pedido) {
      return res.status(404).json({
        erro: "Pedido não encontrado",
      });
    }

    res.json(pedido);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.post("/pedidos", auth, async (req, res) => {
  try {
    const {
      cliente_id,
      itens,
      forma_pagamento,
    } = req.body;

    if (
      !cliente_id ||
      !itens?.length ||
      !forma_pagamento
    ) {
      return res.status(400).json({
        erro:
          "cliente_id, itens e forma_pagamento são obrigatórios",
      });
    }

    const novo = await Pedido.create({
      cliente_id,
      itens,

      taxa_entrega:
        req.body.taxa_entrega || 0,

      forma_pagamento,

      troco:
        req.body.troco || 0,

      observacoes:
        req.body.observacoes || "",

      endereco:
        req.body.endereco || "",

      origem:
        req.body.origem || "site",

      usuario_id:
        req.body.usuario_id ||
        req.usuario?.id,
    });

    res.status(201).json(novo);
  } catch (e) {
    res.status(400).json({
      erro: e.message,
    });
  }
});

router.patch(
  "/pedidos/:id/status",
  auth,
  async (req, res) => {
    try {
      const validos = [
        "recebido",
        "em_preparo",
        "saiu_entrega",
        "entregue",
        "cancelado",
      ];

      if (!validos.includes(req.body.status)) {
        return res.status(400).json({
          erro: "Status inválido",
        });
      }

      const pedido =
        await Pedido.updateStatus(
          req.params.id,
          req.body.status
        );

      if (!pedido) {
        return res.status(404).json({
          erro: "Pedido não encontrado",
        });
      }

      res.json(pedido);
    } catch (e) {
      res.status(500).json({
        erro: e.message,
      });
    }
  }
);

router.delete("/pedidos/:id", auth, async (req, res) => {
  try {
    const ok = await Pedido.delete(
      req.params.id
    );

    if (!ok) {
      return res.status(404).json({
        erro: "Pedido não encontrado",
      });
    }

    res.json({
      mensagem: "Pedido deletado",
    });
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// ============================================================
// USUÁRIOS
// ============================================================

router.get("/usuarios", auth, async (req, res) => {
  try {
    if (
      req.usuario.perfil !== "Administrador"
    ) {
      return res.status(403).json({
        erro:
          "Acesso restrito a Administradores",
      });
    }

    res.json(await Usuario.findAll());
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.post("/usuarios", auth, async (req, res) => {
  try {
    if (
      req.usuario.perfil !== "Administrador"
    ) {
      return res.status(403).json({
        erro:
          "Acesso restrito a Administradores",
      });
    }

    const {
      nome,
      email,
      senha,
      perfil,
    } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        erro:
          "Nome, email e senha são obrigatórios",
      });
    }

    const novo = await Usuario.create({
      nome,
      email,
      senha,
      perfil,
    });

    res.status(201).json(novo);
  } catch (e) {
    if (
      e.message?.includes("UNIQUE")
    ) {
      return res.status(400).json({
        erro: "E-mail já cadastrado",
      });
    }

    res.status(500).json({
      erro: e.message,
    });
  }
});

router.put("/usuarios/:id", auth, async (req, res) => {
  try {
    if (
      req.usuario.perfil !== "Administrador"
    ) {
      return res.status(403).json({
        erro:
          "Acesso restrito a Administradores",
      });
    }

    const usuario = await Usuario.update(
      req.params.id,
      req.body
    );

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    res.json(usuario);
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

router.delete("/usuarios/:id", auth, async (req, res) => {
  try {
    if (
      req.usuario.perfil !== "Administrador"
    ) {
      return res.status(403).json({
        erro:
          "Acesso restrito a Administradores",
      });
    }

    const ok = await Usuario.delete(
      req.params.id
    );

    if (!ok) {
      return res.status(404).json({
        erro: "Usuário não encontrado",
      });
    }

    res.json({
      mensagem: "Usuário deletado",
    });
  } catch (e) {
    res.status(500).json({
      erro: e.message,
    });
  }
});

// ============================================================

module.exports = router;