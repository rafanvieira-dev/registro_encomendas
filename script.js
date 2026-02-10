// =====================
// FUNÇÕES ÚTEIS
// =====================
function gerarIdEncomenda() {
  return "ENC-" + Date.now();
}

function converterParaBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// =====================
// CADASTRO DE ENCOMENDAS
// =====================
document.addEventListener("DOMContentLoaded", () => {
  const idCampo = document.getElementById("idEncomenda");
  if (idCampo) idCampo.value = gerarIdEncomenda();

  if (document.getElementById("listaEncomendas")) carregarEncomendasPendentes();
  if (document.getElementById("tabela")) mostrarConsulta();
});

// =====================
// REGISTRAR ENTREGA
// =====================

function carregarEncomendasPendentes() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.querySelector("#listaEncomendas tbody");
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
        <td><button onclick='mostrarFormularioEntrega("${e.id}")'>Registrar Entrega</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function mostrarFormularioEntrega(idEncomenda) {
  // Exibe o formulário de entrega e a assinatura somente para a encomenda selecionada
  const formEntrega = document.getElementById("registroEntrega");
  formEntrega.style.display = "block";
  document.getElementById("idEncomendaEntrega").value = idEncomenda;
  
  // Inicializa a área de assinatura no canvas
  let canvas = document.getElementById("assinatura");
  signaturePad = new SignaturePad(canvas);
  signaturePad.clear();
}

function registrarEntrega() {
  let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const encomendaId = document.getElementById("idEncomendaEntrega").value;
  const encomenda = lista.find(e => e.id === encomendaId);

  if (!encomenda) {
    alert("Encomenda não encontrada!");
    return;
  }

  // Preenche os campos do formulário
  encomenda.entrega.retirante = document.getElementById("retirante").value;
  encomenda.entrega.documento = document.getElementById("documentoRetirante").value;
  encomenda.entrega.dataHora = document.getElementById("dataHoraEntrega").value || new Date().toISOString();
  encomenda.entregue = true;

  // Salvar assinatura
  if (!signaturePad.isEmpty()) {
    encomenda.entrega.assinatura = signaturePad.toDataURL("image/png");
  }

  localStorage.setItem("encomendas", JSON.stringify(lista));
  alert("Entrega registrada com sucesso!");

  window.location.href = "consulta.html"; // redireciona para consulta
}

// =====================
// CONSULTA E POP-UP DE DETALHES
// =====================
function mostrarConsulta() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.getElementById("tabela");
  if (!tbody) return;
  tbody.innerHTML = "";

  lista.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.rastreio}</td>
      <td>${e.destinatario}</td>
      <td>${e.apartamento}</td>
      <td>${e.bloco}</td>
      <td><button onclick='mostrarDetalhes("${e.id}")'>Detalhes</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function mostrarDetalhes(id) {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const e = lista.find(en => en.id === id);
  if (!e) return alert("Encomenda não encontrada.");

  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.background = "rgba(0,0,0,0.7)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "1000";

  modal.innerHTML = `
    <div style="background:#fff;padding:20px;border-radius:10px;max-width:600px;width:90%;max-height:90%;overflow:auto;">
      <h2>Detalhes da Encomenda ${e.id}</h2>
      <p><strong>Rastreio:</strong> ${e.rastreio}</p>
      <p><strong>Destinatário:</strong> ${e.destinatario}</p>
      <p><strong>Apto:</strong> ${e.apartamento}</p>
      <p><strong>Bloco:</strong> ${e.bloco}</p>
      <p><strong>Transportadora:</strong> ${e.transportadora}</p>
      <p><strong>Funcionário:</strong> ${e.funcionario}</p>
      <p><strong>Documento:</strong> ${e.documentoFuncionario}</p>
      <p><strong>Data Cadastro:</strong> ${new Date
