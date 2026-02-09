// =====================
// FUNÇÕES ÚTEIS
// =====================

// Gerar ID único
function gerarIdEncomenda() {
  return "ENC-" + Date.now();
}

// Converter imagem para Base64
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

  // Inicializa entrega e consulta, se estiver nas respectivas páginas
  if (document.getElementById("listaEncomendas")) carregarEncomendasPendentes();
  if (document.getElementById("tabela")) mostrarConsulta();
});

const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", async function (e) {
    e.preventDefault();

    let fotoBase64 = null;
    const arquivo = document.getElementById("foto").files[0];
    if (arquivo) fotoBase64 = await converterParaBase64(arquivo);

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
      foto: fotoBase64,
      entregue: false,
      entrega: { retirante: "", documento: "", dataHora: "" }
    };

    let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
    lista.push(encomenda);
    localStorage.setItem("encomendas", JSON.stringify(lista));

    alert("Encomenda cadastrada com sucesso!");
    window.location.href = "entrega.html"; // redireciona automaticamente
  });
}

// =====================
// ENTREGAS
// =====================
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
        <td>${e.entrega.retirante || ""}</td>
        <td>${e.entrega.documento || ""}</td>
        <td>${e.entrega.dataHora ? new Date(e.entrega.dataHora).toLocaleString("pt-BR") : ""}</td>
        <td><button onclick="registrarEntrega('${e.id}')">Registrar Entrega</button></td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function registrarEntrega(idEncomenda) {
  let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const e = lista.find(en => en.id === idEncomenda);
  if (!e) return;

  e.entrega.retirante = prompt("Nome de quem retirou:") || "";
  e.entrega.documento = prompt("Documento:") || "";
  e.entrega.dataHora = new Date().toISOString();
  e.entregue = true;

  localStorage.setItem("encomendas", JSON.stringify(lista));
  carregarEncomendasPendentes();
}

// =====================
// CONSULTA ENCOMENDAS
// =====================
function mostrarConsulta() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.getElementById("tabela");
  if (!tbody) return;
  tbody.innerHTML = "";

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6">Nenhuma encomenda registrada</td></tr>`;
    return;
  }

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

// =====================
// DETALHES EM POP-UP
// =====================
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
      <p><strong>Data Cadastro:</strong> ${new Date(e.dataHoraCadastro).toLocaleString("pt-BR")}</p>
      <p><strong>Status:</strong> ${e.entregue ? "✅ Entregue" : "📦 Pendente"}</p>
      ${e.entrega.retirante ? `<p><strong>Entregue por:</strong> ${e.entrega.retirante}</p>` : ""}
      ${e.entrega.documento ? `<p><strong>Documento:</strong> ${e.entrega.documento}</p>` : ""}
      ${e.entrega.dataHora ? `<p><strong>Data/Hora Entrega:</strong> ${new Date(e.entrega.dataHora).toLocaleString("pt-BR")}</p>` : ""}
      ${e.foto ? `<img src="${e.foto}" style="max-width:100%;border-radius:5px;margin-top:10px;">` : ""}
      <button id="fecharModal" style="margin-top:15px;padding:10px 20px;">Fechar</button>
    </div>
  `;

  document.body.appendChild(modal);
  document.getElementById("fecharModal").onclick = () => modal.remove();
}
