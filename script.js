let dados = JSON.parse(localStorage.getItem("caixa")) || [];

function salvar() {
  localStorage.setItem("caixa", JSON.stringify(dados));
}

function adicionar() {

  const descricao = document.getElementById("descricao").value;
  const valor = Number(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;
  const data = document.getElementById("data").value;
  const file = document.getElementById("comprovante").files[0];

  if (!descricao || !valor || !data) {
    alert("Preencha tudo!");
    return;
  }

  const criar = (img) => {
    dados.push({
      id: Date.now(),
      descricao,
      valor,
      tipo,
      data,
      comprovante: img || null
    });

    salvar();
    render();
  };

  if (file) {
    const reader = new FileReader();
    reader.onload = e => criar(e.target.result);
    reader.readAsDataURL(file);
  } else {
    criar(null);
  }
}

function apagarComprovante(id) {
  const item = dados.find(d => d.id === id);

  if (confirm("Deseja apagar o comprovante? 🗑️")) {
    item.comprovante = null;
    salvar();
    render();
  }
}

function render() {

  let entradas = 0;
  let saidas = 0;

  dados.forEach(d => {
    if (d.tipo === "entrada") entradas += d.valor;
    else saidas += d.valor;
  });

  document.getElementById("entradas").innerText = entradas.toFixed(2);
  document.getElementById("saidas").innerText = saidas.toFixed(2);
  document.getElementById("total").innerText = (entradas - saidas).toFixed(2);

  const meses = document.getElementById("meses");
  meses.innerHTML = "";

  const grupos = {};

  dados.forEach(d => {
    const mes = d.data.slice(0,7);
    if (!grupos[mes]) grupos[mes] = [];
    grupos[mes].push(d);
  });

  for (let m in grupos) {

    const div = document.createElement("div");
    div.className = "mes";

    div.innerHTML = `<h3>📅 ${m}</h3>`;

    grupos[m].forEach(d => {

      const item = document.createElement("div");

      item.innerHTML = `
        <b>${d.descricao}</b> - R$ ${d.valor}
      `;

      if (d.comprovante) {

        const wrap = document.createElement("div");
        wrap.className = "comprovante-wrapper";

        const img = document.createElement("img");
        img.src = d.comprovante;
        img.className = "comprovante";

        const btn = document.createElement("button");
        btn.innerHTML = "🗑️";
        btn.className = "btn-delete";
        btn.onclick = () => apagarComprovante(d.id);

        wrap.appendChild(img);
        wrap.appendChild(btn);
        item.appendChild(wrap);
      }

      div.appendChild(item);
    });

    meses.appendChild(div);
  }
}

render();