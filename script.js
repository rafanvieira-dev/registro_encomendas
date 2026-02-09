// GERAR ID
function gerarIdEncomenda() { return "ENC-" + Date.now(); }

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  const idCampo = document.getElementById("idEncomenda");
  if (idCampo) idCampo.value = gerarIdEncomenda();

  if (document.getElementById("listaEncomendas")) carregarEncomendasPendentes();
  if (document.getElementById("tabela")) mostrarConsulta();
});

// CADASTRO
const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", function (e) {
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
    window.location.href = "entrega.html"; // redireciona
  });
}

// ENTREGAS
function carregarEncomendasPendentes() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.getElementById("listaEncomendas");
  if (!tbody) return;
  tbody.innerHTML = "";
  lista.forEach(e => {
    if (!e.entregue) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.id}</td>
        <td>${e.rastreio}</td>
        <td>${e.destinatario}</td>
        <td>${e.apartamento}</td>
        <td>${e.bloco}</td>
        <td><button onclick="registrarEntrega('${e.id}')">Registrar Entrega</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function registrarEntrega(idEncomenda) {
  let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const encomenda = lista.find(e => e.id === idEncomenda);
  if (!encomenda) return alert("Encomenda não encontrada.");
  const retirante = prompt("Nome de quem retirou:");
  const documento = prompt("Documento de quem retirou:");
  if (!retirante || !documento) return alert("Entrega cancelada.");
  encomenda.entregue = true;
  encomenda.entrega = { retirante, documento, dataHora: new Date().toISOString() };
  localStorage.setItem("encomendas", JSON.stringify(lista));
  carregarEncomendasPendentes();
}

// CONSULTA
function mostrarConsulta() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.getElementById("tabela");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12">Nenhuma encomenda registrada</td></tr>`;
    return;
  }
  lista.forEach(e => {
    const status = e.entregue ? "✅ Entregue" : "📦 Pendente";
    const dataEntrega = e.entrega ? new Date(e.entrega.dataHora).toLocaleString("pt-BR") : "-";
    const retirante = e.entrega ? e.entrega.retirante : "-";
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.rastreio}</td>
        <td>${e.destinatario}</td>
        <td>${e.apartamento}</td>
        <td>${e.bloco}</td>
        <td>${e.transportadora}</td>
        <td>${e.funcionario}</td>
        <td>${e.documentoFuncionario}</td>
        <td>${new Date(e.dataHoraCadastro).toLocaleString("pt-BR")}</td>
        <td>${retirante}</td>
        <td>${dataEntrega}</td>
        <td>${status}</td>
      </tr>
    `;
  });
}
