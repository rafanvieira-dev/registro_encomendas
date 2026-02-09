// GERAR ID
function gerarIdEncomenda() { return "ENC-" + Date.now(); }

// INICIALIZAÇÃO
document.addEventListener("DOMContentLoaded", () => {
  const idCampo = document.getElementById("idEncomenda");
  if (idCampo) idCampo.value = gerarIdEncomenda();

  if (document.getElementById("listaEncomendas")) carregarEncomendasPendentes();
  if (document.getElementById("tabela")) mostrarConsulta();
});

// CONVERTER IMAGEM PARA BASE64
function converterParaBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// CADASTRO
const formCadastro = document.getElementById("formCadastro");
if (formCadastro) {
  formCadastro.addEventListener("submit", async function (e) {
    e.preventDefault();

    let fotoBase64 = null;
    const arquivo = document.getElementById("foto").files[0];
    if (arquivo) {
      fotoBase64 = await converterParaBase64(arquivo);
    }

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

// CONSULTA COM BOTÃO DETALHES
function mostrarConsulta() {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const tbody = document.getElementById("tabela");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7">Nenhuma encomenda registrada</td></tr>`;
    return;
  }

  lista.forEach(e => {
    const status = e.entregue ? "✅ Entregue" : "📦 Pendente";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.rastreio}</td>
      <td>${e.destinatario}</td>
      <td>${e.apartamento}</td>
      <td>${e.bloco}</td>
      <td>${status}</td>
      <td><button onclick='mostrarDetalhes("${e.id}")'>Detalhes</button></td>
    `;
    tbody.appendChild(tr);
  });
}

// FUNÇÃO MOSTRAR DETALHES
function mostrarDetalhes(idEncomenda) {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const e = lista.find(en => en.id === idEncomenda);
  if (!e) return alert("Encomenda não encontrada.");

  let msg = `
ID: ${e.id}
Rastreio: ${e.rastreio}
Destinatário: ${e.destinatario}
Apartamento: ${e.apartamento}
Bloco: ${e.bloco}
Transportadora: ${e.transportadora}
Funcionário: ${e.funcionario}
Documento: ${e.documentoFuncionario}
Data Cadastro: ${new Date(e.dataHoraCadastro).toLocaleString("pt-BR")}
Status: ${e.entregue ? "✅ Entregue" : "📦 Pendente"}
`;

  if (e.entrega) {
    msg += `
Entregue para: ${e.entrega.retirante}
Documento: ${e.entrega.documento}
Data/Hora Entrega: ${new Date(e.entrega.dataHora).toLocaleString("pt-BR")}
`;
  }

  if (e.foto) {
    msg += "\n\n[Foto disponível abaixo]";
    // Criar modal simples para exibir a imagem
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.7)";
    modal.style.display = "flex";
    modal.style.flexDirection = "column";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "1000";
    modal.innerHTML = `
      <div style="background:#fff;padding:20px;border-radius:10px;max-width:90%;max-height:90%;overflow:auto;text-align:center;">
        <pre style="text-align:left;">${msg}</pre>
        <img src="${e.foto}" style="max-width:100%; max-height:400px; margin-top:10px; border-radius:5px;">
        <br><button id="fecharModal" style="margin-top:15px; padding:10px 20px;">Fechar</button>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById("fecharModal").onclick = () => modal.remove();
  } else {
    alert(msg);
  }
}
