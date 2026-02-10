let assinaturaPad;

// ====== ENTREGA ======
document.addEventListener("DOMContentLoaded", () => {
  carregarPendentes();
  carregarConsulta();
});

function carregarPendentes() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
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
        <td><button onclick="abrirEntrega('${e.id}')">Registrar</button></td>
      </tr>
    `;
  });
}

function abrirEntrega(id) {
  document.getElementById("modalEntrega").style.display = "flex";
  document.getElementById("entregaId").value = id;

  const canvas = document.getElementById("assinatura");
  assinaturaPad = new SignaturePad(canvas);
}

function limparAssinatura() {
  assinaturaPad.clear();
}

function fecharModal() {
  document.querySelectorAll(".modal").forEach(m => m.style.display = "none");
}

function confirmarEntrega() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const id = document.getElementById("entregaId").value;

  const encomenda = lista.find(e => e.id === id);
  encomenda.entregue = true;
  encomenda.entrega = {
    nome: document.getElementById("nomeRecebedor").value,
    documento: document.getElementById("docRecebedor").value,
    assinatura: assinaturaPad.toDataURL(),
    dataHora: new Date().toISOString()
  };

  localStorage.setItem("encomendas", JSON.stringify(lista));
  alert("Entrega registrada!");
  location.reload();
}

// ====== CONSULTA ======
function carregarConsulta() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
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
        <td><button onclick="detalhes('${e.id}')">Detalhes</button></td>
      </tr>
    `;
  });
}

function detalhes(id) {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const e = lista.find(x => x.id === id);

  document.getElementById("modalDetalhes").innerHTML = `
    <div class="modal-content">
      <h2>Detalhes</h2>
      <p><b>Destinatário:</b> ${e.destinatario}</p>
      <p><b>Status:</b> ${e.entregue ? "Entregue" : "Pendente"}</p>
      ${e.entrega ? `
        <p><b>Recebido por:</b> ${e.entrega.nome}</p>
        <p><b>Documento:</b> ${e.entrega.documento}</p>
        <img src="${e.entrega.assinatura}" style="width:100%">
      ` : ""}
      <button onclick="fecharModal()">Fechar</button>
    </div>
  `;
  document.getElementById("modalDetalhes").style.display = "flex";
}

// ====== PDF ======
function gerarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
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

  doc.save("encomendas.pdf");
}
