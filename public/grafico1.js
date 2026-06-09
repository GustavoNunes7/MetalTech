document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("graficoPedidos");

    if (!canvas) return;

    new Chart(canvas, {
        type: "bar",
        data: {
            labels: [
                "Jan",
                "Fev",
                "Mar",
                "Abr",
                "Mai",
                "Jun"
            ],
            datasets: [{
                label: "Pedidos",
                data: [12, 19, 8, 15, 10, 20]
            }]
        },
        options: {
            responsive: true
        }
    });

});