function gerarIdEncomenda() {
  return "ENC-" + Date.now();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("idEncomenda").value = gerarIdEncomenda();
});

document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  const encomenda = {
    id: document.getElementById("idEncomenda").value,
    rastreio: document.getElementById("rastreio").value,
    destinatario: document.getElementById("destinatario").value,
    apartamento: document.getElementById("apartamento").value,
    bloco: document.getElementById("bloco").value,
    transportadora: document.getElementById("transportadora").value,
    funcionario: document.getElementById("funcionario").value,
    documentoFuncionario: document.getElementById("documento").value,
    dataHoraCadastro: document.getElementById("dataHora").value,
    entregue: false,
    entrega: null
  };

  let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  lista.push(encomenda);
  localStorage.setItem("encomendas", JSON.stringify(lista));

  alert("Encomenda cadastrada com sucesso!");

  this.reset();
  document.getElementById("idEncomenda").value = gerarIdEncomenda();
});
