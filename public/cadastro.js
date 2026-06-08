async function criarLogin() {

  const nome = document.getElementById("l-name").value;
  const telefone = document.getElementById("l-telefone").value;
  const email = document.getElementById("l-email").value;
  const senha = document.getElementById("l-senha").value;

  const endereco = {
    rua: document.getElementById("c-rua").value,
    numero: document.getElementById("c-num").value,
    bairro: document.getElementById("c-bairro").value,
    cidade: document.getElementById("c-cidade").value,
    cep: document.getElementById("c-cep").value,
    complemento: document.getElementById("c-comp").value
  };

  const resposta = await fetch(
    "http://localhost:3001/api/cadastro",
    {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        nome,
        telefone,
        email,
        senha,
        endereco
      })
    }
  );

  if(resposta.ok){

    alert("Conta criada!");

    window.location.href="index.html";

  }else{

    const erro = await resposta.json();

    alert(erro.erro);

  }
}