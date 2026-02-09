const encomendas = JSON.parse(localStorage.getItem("encomendas")) || [];

// Cadastro
const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", e => {
    e.preventDefault();

    encomendas.push({
      id: id.value,
      destinatario: destinatario.value,
      empresa: empresa.value,
      docRecebeu: docRecebeu.value,
      dataRecebimento: dataRecebimento.value,
      retirou: "",
      dataEntrega: ""
    });

    localStorage.setItem("encomendas", JSON.stringify(encomendas));
    alert("Encomenda cadastrada!");
    formCadastro.reset();
  });
}

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
