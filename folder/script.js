let modoManualCorFundo = false;

function atualizarPreview() {
  const notaInput = document.getElementById("nota");
  const corInput = document.getElementById("cor");
  const corFonteInput = document.getElementById("cor-fonte");
  const preview = document.getElementById("preview");
  const descricao = document.getElementById("descricao-cor");

  let nota = parseInt(notaInput.value);
  if (isNaN(nota)) nota = 0;
  const notaTexto = nota.toString().padStart(2, '0');

  // Se não estiver no modo manual, aplicar cor de fundo padrão
  if (!modoManualCorFundo) {
    let corPadraoFundo = "#00ce7a"; // verde
    if (nota < 50) {
      corPadraoFundo = "#ff6874";
    } else if (nota < 75) {
      corPadraoFundo = "#ffbd3f";
    }
    corInput.value = corPadraoFundo;
    preview.style.backgroundColor = corPadraoFundo;

    if (nota < 50) {
    corFonte = "#ffffff";
    } else {
   corFonte = "#222222";
    }
    document.getElementById("cor-fonte").value = corFonte;

  } else {
    // Se o usuário escolheu manualmente, respeitamos
    preview.style.backgroundColor = corInput.value;
  }

  // Cor da fonte (branco automático se for vermelho e fonte default)
  const corFinalFonte = (nota < 50 && corFonteInput.value === "#222222")
    ? "#ffffff"
    : corFonteInput.value;

  preview.style.color = corFinalFonte;
  preview.textContent = notaTexto;

  // Texto explicativo da cor padrão
  if (descricao) {
    if (nota >= 75) {
      descricao.textContent = "Cor padrão: Verde (nota ≥ 75)";
      descricao.style.color = "#00ce7a";
    } else if (nota >= 50) {
      descricao.textContent = "Cor padrão: Amarelo (nota entre 50 e 74)";
      descricao.style.color = "#ffbd3f";
    } else {
      descricao.textContent = "Cor padrão: Vermelho (nota < 50)";
      descricao.style.color = "#ff6874";
    }
  }
}

function baixarImagem() {
  const nota = document.getElementById("nota").value.padStart(2, '0');
  const corFundo = document.getElementById("cor").value;
  const corFonteInput = document.getElementById("cor-fonte").value;
  const tamanho = parseInt(document.getElementById("tamanho").value);
  const notaValor = parseInt(nota);

  const canvas = document.createElement("canvas");
  canvas.width = tamanho;
  canvas.height = tamanho;
  const ctx = canvas.getContext("2d");

  // Arredondamento do fundo
  const radius = 30 * (tamanho / 200);
  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.lineTo(tamanho - radius, 0);
  ctx.quadraticCurveTo(tamanho, 0, tamanho, radius);
  ctx.lineTo(tamanho, tamanho - radius);
  ctx.quadraticCurveTo(tamanho, tamanho, tamanho - radius, tamanho);
  ctx.lineTo(radius, tamanho);
  ctx.quadraticCurveTo(0, tamanho, 0, tamanho - radius);
  ctx.lineTo(0, radius);
  ctx.quadraticCurveTo(0, 0, radius, 0);
  ctx.closePath();
  ctx.clip();

  // Fundo
  ctx.fillStyle = corFundo;
  ctx.fillRect(0, 0, tamanho, tamanho);

  // Fonte
  const corFinalFonte = (notaValor < 50 && corFonteInput === "#222222") ? "#ffffff" : corFonteInput;
  ctx.fillStyle = corFinalFonte;
  ctx.font = `bold ${tamanho * 0.45}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(nota, tamanho / 2, tamanho / 2);

  // Download
  const link = document.createElement("a");
  link.download = `nota_${nota}_${tamanho}px.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function setCor(hex) {
  document.getElementById("cor").value = hex;
  modoManualCorFundo = true;
  atualizarPreview();
}

function setCorFonte(hex) {
  document.getElementById("cor-fonte").value = hex;
  atualizarPreview();
}

function resetarCorAutomatica() {
  modoManualCorFundo = false;
  modoManualCorFonte = false;
  atualizarPreview();
}

// Atualiza dinamicamente ao mudar os campos
window.onload = () => {
  atualizarPreview();

  document.getElementById("nota").addEventListener("input", atualizarPreview);
  document.getElementById("cor").addEventListener("input", atualizarPreview);
  document.getElementById("cor-fonte").addEventListener("input", atualizarPreview);
  document.getElementById("tamanho").addEventListener("input", atualizarPreview);
  document.getElementById("cor").addEventListener("input", () => {
  modoManualCorFundo = true;
  atualizarPreview();
});
};
