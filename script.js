// ======================
// UTIL
// ======================
function gerarId() {
  return "ENC-" + Date.now();
}

function obterEncomendas() {
  return JSON.parse(localStorage.getItem("encomendas")) || [];
}

function salvarEncomendas(lista) {
  localStorage.setItem("encomendas", JSON.stringify(lista));
}

// ======================
// CADASTRO
// ======================
function cadastrarEncomenda(dados) {
  const lista = obterEncomendas();

  lista.push({
    id: gerarId(),
    rastreio: dados.rastreio,
    destinatario: dados.destinatario,
    apartamento: dados.apartamento,
    bloco: dados.bloco,
    transportadora: dados.transportadora,
    funcionario: dados.funcionario,
    documentoFuncionario: dados.documentoFuncionario,
    dataHoraCadastro: new Date().toISOString(),
    entregue: false,
    entrega: null
  });

  salvarEncomendas(lista);
  alert("Encomenda cadastrada!");
  window.location.href = "consulta.html";
}

// ======================
// REGISTRAR ENTREGA
// ======================
let assinaturaPad = null;
let encomendaSelecionada = null;

function carregarPendentes() {
  const lista = obterEncomendas();
  const tbody = document.getElementById("listaPendentes");
  if (!tbody) return;

  tbody.innerHTML = "";

  lista.filter(e => !e.entregue).forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.rastreio}</td>
        <td>${e.destinatario}</td>
        <td>${e.apartamento}</td>
        <td>${e.bloco}</td>
        <td>
          <button onclick="abrirEntrega('${e.id}')">Registrar entrega</button>
        </td>
      </tr>
    `;
  });
}

function abrirEntrega(id) {
  const lista = obterEncomendas();
  encomendaSelecionada = lista.find(e => e.id === id);

  document.getElementById("modalEntrega").style.display = "flex";

  const canvas = document.getElementById("assinatura");
  assinaturaPad = new SignaturePad(canvas);
  assinaturaPad.clear();
}

function limparAssinatura() {
  if (assinaturaPad) assinaturaPad.clear();
}

function confirmarEntrega() {
  if (!encomendaSelecionada) return;

  const nome = document.getElementById("nomeRecebedor").value;
  const doc = document.getElementById("docRecebedor").value;

  if (!nome || !doc || assinaturaPad.isEmpty()) {
    alert("Preencha todos os campos e assine.");
    return;
  }

  const lista = obterEncomendas();
  const index = lista.findIndex(e => e.id === encomendaSelecionada.id);

  lista[index].entregue = true;
  lista[index].entrega = {
    nome,
    documento: doc,
    assinatura: assinaturaPad.toDataURL(),
    dataHora: new Date().toISOString()
  };

  salvarEncomendas(lista);
  alert("Entrega registrada com sucesso!");
  window.location.reload();
}

// ======================
// CONSULTA
// ======================
function carregarConsulta() {
  const lista = obterEncomendas();
  const tbody = document.getElementById("tabelaConsulta");
  if (!tbody) return;

  tbody.innerHTML = "";

  lista.forEach(e => {
    tbody.innerHTML += `
      <tr>
        <td>${e.id}</td>
        <td>${e.rastreio}</td>
        <td>${e.destinatario}</td>
        <td>${e.apartamento}</td>
        <td>${e.bloco}</td>
        <td>
          <button onclick="verDetalhes('${e.id}')">Detalhes</button>
        </td>
      </tr>
    `;
  });
}

function verDetalhes(id) {
  const lista = obterEncomendas();
  const e = lista.find(x => x.id === id);

  const modal = document.getElementById("modalDetalhes");
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Encomenda ${e.id}</h2>
      <p><b>Destinatário:</b> ${e.destinatario}</p>
      <p><b>Status:</b> ${e.entregue ? "Entregue" : "Pendente"}</p>

      ${e.entrega ? `
        <p><b>Recebido por:</b> ${e.entrega.nome}</p>
        <p><b>Documento:</b> ${e.entrega.documento}</p>
        <img src="${e.entrega.assinatura}" style="width:100%;border:1px solid #ccc">
      ` : ""}

      <button onclick="fecharModal()">Fechar</button>
    </div>
  `;

  modal.style.display = "flex";
}

function fecharModal() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

// ======================
// PDF
// ======================
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lista = obterEncomendas();
  let y = 10;

  lista.forEach(e => {
    doc.text(`ID: ${e.id}`, 10, y); y+=6;
    doc.text(`Destinatário: ${e.destinatario}`, 10, y); y+=6;

    if (e.entrega) {
      doc.text(`Recebido por: ${e.entrega.nome}`, 10, y); y+=6;
      doc.addImage(e.entrega.assinatura, "PNG", 10, y, 60, 30);
      y+=40;
    }
    y+=10;
  });

  doc.save("relatorio-encomendas.pdf");
}

// ======================
// AUTOLOAD
// ======================
document.addEventListener("DOMContentLoaded", () => {
  carregarPendentes();
  carregarConsulta();
});
