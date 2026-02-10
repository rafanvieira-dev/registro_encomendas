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

  // Salvar assinatura antes de registrar a entrega
  salvarAssinatura();

  localStorage.setItem("encomendas", JSON.stringify(lista));
  carregarEncomendasPendentes();
}

// =====================
// ASSINATURA
// =====================

// Configuração do canvas para assinatura
let canvas = document.getElementById("assinatura");
let signaturePad = new SignaturePad(canvas);

// Ajustar o tamanho do canvas para dispositivos móveis
function ajustarCanvas() {
  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  canvas.getContext("2d").scale(ratio, ratio);
}
window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

// Função para limpar a assinatura
function limparAssinatura() {
  signaturePad.clear();
}

// Função para salvar a assinatura em Base64 (apenas no momento do recebimento)
function salvarAssinatura() {
  const assinaturaBase64 = signaturePad.isEmpty() ? null : signaturePad.toDataURL("image/png");

  if (assinaturaBase64) {
    // Aqui você pode salvar no objeto da encomenda
    let lista = JSON.parse(localStorage.getItem("encomendas")) || [];
    const encomendaId = document.getElementById("idEncomenda").value; // ID da encomenda a ser registrada
    const encomenda = lista.find(e => e.id === encomendaId);

    if (encomenda) {
      encomenda.entrega.assinatura = assinaturaBase64; // Salva a assinatura
      localStorage.setItem("encomendas", JSON.stringify(lista));
      alert("Assinatura registrada com sucesso!");
    }
  } else {
    alert("Por favor, forneça uma assinatura.");
  }
}
