// 1. Configuração dos Dados (Antigo bloco <setup>)
const labels = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];

const data = {
  labels: labels,
  datasets: [{
    label: 'Meu Primeiro Dataset',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
};

// 2. Objeto de Configuração do Gráfico (Antigo bloco <config>)
const config = {
  type: 'bar', // Tipo barra vertical
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true // Garante que o eixo Y comece do zero
      }
    }
  }
};

// 3. Renderização final no Canvas do HTML
const ctx = document.getElementById('graficoFaturamento').getContext('2d');
new Chart(ctx, config);