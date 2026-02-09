// CONSULTA ENCOMENDAS REDUZIDA
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

// DETALHES EM POP-UP
function mostrarDetalhes(id) {
  const lista = JSON.parse(localStorage.getItem("encomendas")) || [];
  const e = lista.find(en => en.id === id);
  if (!e) return alert("Encomenda não encontrada.");

  // Criar modal
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

// Inicializar consulta ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tabela")) mostrarConsulta();
});
