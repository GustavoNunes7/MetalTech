const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/rastreamento/:codigo", (req, res) => {

    const codigo = req.params.codigo;

    const etapas = [
        {
            status: "Objeto postado",
            local: "São Paulo/SP",
            data: "08/06/2026 09:00"
        },
        {
            status: "Objeto em trânsito",
            local: "Rio de Janeiro/RJ",
            data: "08/06/2026 14:30"
        },
        {
            status: "Saiu para entrega",
            local: "Rio de Janeiro/RJ",
            data: "09/06/2026 08:00"
        },
        {
            status: "Entregue ao destinatário",
            local: "Rio de Janeiro/RJ",
            data: "09/06/2026 14:20"
        }
    ];

    const progresso =
        Math.floor(Math.random() * etapas.length) + 1;

    res.json({
        codigo,
        historico: etapas.slice(0, progresso)
    });

});

app.listen(3001, () => {
    console.log("Servidor rodando em http://localhost:3001");
});