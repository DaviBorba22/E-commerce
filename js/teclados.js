
// Função para renderizar um array de produtos
function renderizarProdutos(produtoArray, divId) {
  const listaDiv = document.getElementById(divId);
  if (!listaDiv) {
    console.error(`O elemento com o ID "${divId}" não foi encontrado.`);
    return;
  }

  listaDiv.innerHTML = "";

  produtoArray.forEach((produto) => {
    const produtoLink = document.createElement("a");
    produtoLink.className = "produto-card-link";
    // Usa o slug para criar o link genérico que vai para a página de produto
    produtoLink.href = `./produto.html?slug=${produto.slug}`;

    const produtoCard = document.createElement("div");
    produtoCard.className = "produto-card";

    const produtoImagem = document.createElement("img");
    produtoImagem.src = produto.image ?? "caminho/para/uma/imagem/padrao.png";
    produtoImagem.alt = produto.name ?? "Produto sem nome";

    const produtoNome = document.createElement("h3");
    produtoNome.textContent = produto.name ?? "Produto sem nome";

    const produtoPreco = document.createElement("p");
    const precoFormatado = produto.price?.toFixed(2) ?? "Preço indisponível";
    produtoPreco.textContent = `R$ ${precoFormatado}`;

    produtoCard.appendChild(produtoImagem);
    produtoCard.appendChild(produtoNome);
    produtoCard.appendChild(produtoPreco);

    produtoLink.appendChild(produtoCard);
    listaDiv.appendChild(produtoLink);
  });
}
// Função assíncrona para buscar e renderizar produtos com base em uma categoria
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
      renderizarProdutos(produtosArray, `lista-${categoria}`);
    } else {
      console.error("Dados da API não são um array para", categoria, data);
    }
  } catch (error) {
    console.error("Erro na busca:", error);
  }
}

// Evento para carregar as categorias quando a página é carregada
document.addEventListener("DOMContentLoaded", () => {
  buscarProdutos("keyboards");
});

// Adiciona um evento de clique a todos os botões de categoria
const categoriaBotoes = document.querySelectorAll(".categoria-btn");

categoriaBotoes.forEach((botao) => {
  botao.addEventListener("click", (event) => {
    const categoria = event.currentTarget.dataset.categoria;
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

