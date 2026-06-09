document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("graficoFaturamento");

    if (!canvas) return;

    new Chart(canvas, {
        type: "line",
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
                label: "Faturamento",
                data: [500, 800, 650, 1200, 900, 1400]
            }]
        },
        options: {
            responsive: true
        }
    });

});