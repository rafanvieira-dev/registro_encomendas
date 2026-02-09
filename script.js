const encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

// Cadastro
document.getElementById("formCadastro").addEventListener("submit", function (e) {
  e.preventDefault();

  const encomenda = {
    destinatario: document.getElementById("destinatario").value,
    apartamento: document.getElementById("apartamento").value,
    bloco: document.getElementById("bloco").value,
    idEncomenda: document.getElementById("idEncomenda").value,
    transportadora: document.getElementById("transportadora").value,
    funcionario: document.getElementById("funcionario").value,
    documento: document.getElementById("documento").value,
    dataHora: document.getElementById("dataHora").value,
    entregue: false
  };

  let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  lista.push(encomenda);
  localStorage.setItem("encomendas", JSON.stringify(lista));

  alert("Encomenda cadastrada com sucesso!");
  this.reset();
});


// Entrega
const formEntrega = document.getElementById("formEntrega");
if (formEntrega) {
  formEntrega.addEventListener("submit", e => {
    e.preventDefault();

    const enc = encomendas.find(e => e.id === idEntrega.value);
    if (!enc) {
      alert("Encomenda não encontrada");
      return;
    }

    enc.retirou = retirou.value + " (" + docRetirou.value + ")";
    enc.dataEntrega = dataEntrega.value;

    localStorage.setItem("encomendas", JSON.stringify(encomendas));
    alert("Entrega registrada!");
    formEntrega.reset();
  });
}

// Consulta
const tabela = document.getElementById("tabela");
if (tabela) {
  encomendas.forEach(e => {
    tabela.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.destinatario}</td>
        <td>${e.empresa}</td>
        <td>${e.docRecebeu}</td>
        <td>${e.dataRecebimento}</td>
        <td>${e.retirou || "-"}</td>
        <td>${e.dataEntrega || "-"}</td>
      </tr>
    `;
  });
}
