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

init ();
