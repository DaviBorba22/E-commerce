
let tecladosData = [];
let mouseData = [];

function renderizarProdutos(produtoArray, divId) {
    const listaDiv = document.getElementById(divId);
    if (!listaDiv) {
        console.error(`O elemento com o ID "${divId}" não foi encontrado.`);
        return;
    }

    listaDiv.innerHTML = "";

    produtoArray.forEach((produto) => {
        const produtoCard = document.createElement("div");
        produtoCard.className = "produto-card";

        const produtoImagem = document.createElement("img");
        produtoImagem.src = produto.image ?? 'caminho/para/uma/imagem/padrao.png';
        produtoImagem.alt = produto.name ?? 'Produto sem nome';

        const produtoNome = document.createElement("h3");
        produtoNome.textContent = produto.name ?? 'Produto sem nome';

        const produtoPreco = document.createElement("p");
        const precoFormatado = produto.price?.toFixed(2) ?? "Preço indisponível";
        produtoPreco.textContent = `R$ ${precoFormatado}`;

        produtoCard.appendChild(produtoImagem);
        produtoCard.appendChild(produtoNome);
        produtoCard.appendChild(produtoPreco);

        listaDiv.appendChild(produtoCard);
    });
}

async function buscarProdutos(categoria) {
    try {
        const url = `https://store-api-2ul5.onrender.com/products?name=${categoria}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const produtosArray = data.products;

        if (Array.isArray(produtosArray)) {
            if (categoria === 'keyboards') {
                tecladosData = produtosArray;
                renderizarProdutos(tecladosData, "teclados");
            } else if (categoria === 'mouses') {
                mouseData = produtosArray;
                renderizarProdutos(mouseData, "mouses");
            }
        } else {
            console.error("Dados da API não são um array para", categoria, data);
        }
    } catch (error) {
        console.error("Erro na busca:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buscarProdutos('keyboards');
    buscarProdutos('mouses');
});

const categoriaBotoes = document.querySelectorAll(".categoria-btn");

categoriaBotoes.forEach(botao => {
    botao.addEventListener('click', (event) => {
        const categoria = event.currentTarget.dataset.categoria;
        console.log(`Buscando produtos da categoria: ${categoria}`);
        buscarProdutos(categoria);
    });
});


//carrinho
const cartButton = document.getElementById('cart');
const closeCartButton = document.getElementById('close-cart');
const carrinhoLateral = document.querySelector('.carrinho-lateral');

cartButton.addEventListener('click', () => {
    carrinhoLateral.classList.toggle('carrinho-aberto');
});

closeCartButton.addEventListener('click', () => {
    carrinhoLateral.classList.remove('carrinho-aberto');
});


