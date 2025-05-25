async function getReceitas() {
    const response = await fetch("http://localhost:3000/receitas")
    const receitas = await response.json()
    return receitas
}

async function getReceita(id) {
    const response = await fetch(`http://localhost:3000/receitas/${id}`)
    const receitas = await response.json()
    return receitas

}
function receitaItem(receita) {
    return `<div class="mb-4 col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                    <a href="detalhes.html?id=${receita.id}" class="text-decoration-none text-dark">
                        <div class="card h-250">
                            <img src="${receita.imagem}" class="card-img-top img-fluid rounded" alt="${receita.titulo}">
                            <div class="card-body">
                                <h5 class="card-title">${receita.titulo}</h5>
                                <p class="card-text">${receita.descricao}</p>
                            </div>
                        </div>
                    </a>
            </div>
            `
}

function receitaItemCarrosel(receita, active = false) {
    return `<div class="carousel-item ${active ? "active" : null}">
                <a href="detalhes.html?id=${receita.id}" class="text-decoration-none text-dark">
                    <img src="${receita.imagem}" class="d-block w-100 rounded" alt="${receita.titulo}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5 class="text-weight-bold">${receita.titulo}</h5>
                        <p class="card-text">${receita.descricao}</p>
                    </div>
                </a>
            </div> `
}

async function init() {
    const url = window.location.pathname
    //Montar a lista de receitas na homepage
    if (url.endsWith("index.html")) {
        const receitas = document.querySelector(".receitas")
        const dados = await getReceitas()
        const dadosDestaque = dados.filter((receita) => receita.destaque === true)
        const carrosel = document.querySelector("#carrosel")
        receitas.innerHTML = dados.map(function (receita) {
            const html = receitaItem(receita)
            return html
        })
            .join("")
        carrosel.querySelector(".carousel-inner").innerHTML = dadosDestaque.map((receita, index) => receitaItemCarrosel(receita, index === 0))
            .join("")
    }
    //Buscar id da URL
    //Buscar dentro de dados a receita com o mesmo ID
    //Montar os elementos na pagina de detalhes
    else if (url.endsWith("detalhes.html")) {
        const titulo = document.querySelector("#titulo")
        const imagem = document.querySelector("#imagem")
        console.log(imagem)
        const ingredientes = document.querySelector("#ingredientes")
        const modoPreparo = document.querySelector("#modopreparo")
        const queryParams = new URLSearchParams(window.location.search)
        const id = Number(queryParams.get("id"))

        const receita = await getReceita(id)
        titulo.textContent = receita.titulo
        imagem.src = receita.imagem
        console.log(receita)
        ingredientes.innerHTML = receita.ingredientes.map((ingrediente) => `<li>${ingrediente}</li>`).join("")
        modoPreparo.innerHTML = receita.modoPreparo.map((modopreparo) => `<li>${modopreparo}</li>`).join("")
    }
}

async function salvarReceita(event) {
  event.preventDefault();

  const id = document.querySelector("#receita-id").value;
  const titulo = document.querySelector("#titulo").value;
  const descricao = document.querySelector("#descricao").value;
  const imagem = document.querySelector("#imagem").value;
  const ingredientes = document.querySelector("#ingredientes").value.split(",");
  const modoPreparo = document.querySelector("#modoPreparo").value.split(",");
  const destaque = document.querySelector("#destaque").checked;

  const receita = { titulo, descricao, imagem, ingredientes, modoPreparo, destaque };

  const url = id
    ? `http://localhost:3000/receitas/${id}`
    : "http://localhost:3000/receitas";

  const metodo = id ? "PUT" : "POST";

  await fetch(url, {
    method: metodo,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(receita)
  });

  document.getElementById("form-receita").reset();
  carregarReceitas();
}

async function carregarReceitas() {
  const response = await fetch("http://localhost:3000/receitas");
  const receitas = await response.json();

  const tbody = document.querySelector("#tabela-receitas tbody");
  tbody.innerHTML = receitas.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.titulo}</td>
      <td>
        <button class="btn btn-sm btn-warning" onclick="editarReceita(${r.id})">Editar</button>
        <button class="btn btn-sm btn-danger" onclick="deletarReceita(${r.id})">Excluir</button>
      </td>
    </tr>
  `).join("");
}

async function editarReceita(id) {
  const response = await fetch(`http://localhost:3000/receitas/${id}`);
  const r = await response.json();

  document.querySelector("#receita-id").value = r.id;
  document.querySelector("#titulo").value = r.titulo;
  document.querySelector("#descricao").value = r.descricao;
  document.querySelector("#imagem").value = r.imagem;
  document.querySelector("#ingredientes").value = r.ingredientes.join(",");
  document.querySelector("#modoPreparo").value = r.modoPreparo.join(",");
  document.querySelector("#destaque").checked = r.destaque;
}

async function deletarReceita(id) {
  if (!confirm("Deseja realmente excluir esta receita?")) return;
  await fetch(`http://localhost:3000/receitas/${id}`, { method: "DELETE" });
  carregarReceitas();
}

// Detecta se está na página de cadastro
if (window.location.pathname.endsWith("cadastro_receitas.html")) {
  document
    .getElementById("form-receita")
    .addEventListener("submit", salvarReceita);
  carregarReceitas();
}
init ();


