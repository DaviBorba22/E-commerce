document.addEventListener("DOMContentLoaded", () => {

    let carrinho = [];

    const cartItemsContainer = document.querySelector('.cart-items');
    const carrinhoLateral = document.querySelector('.carrinho-lateral');

    function carregarCarrinho() {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
            carrinho = JSON.parse(carrinhoSalvo);
            renderizarCarrinho();
        }
    }

    function adicionarAoCarrinho(produto) {
        const produtoExistente = carrinho.find(item => item.slug === produto.slug);
        if (produtoExistente) {
            alert(`O produto "${produto.name}" já está no carrinho.`);
            return;
        }
        carrinho.push({ ...produto, quantidade: 1 });
        salvarCarrinho();
        renderizarCarrinho();
    }

    function salvarCarrinho() {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    function removerDoCarrinho(slug) {
        carrinho = carrinho.filter(item => item.slug !== slug);
        salvarCarrinho();
        renderizarCarrinho();
    }

    function renderizarCarrinho() {
        if (!cartItemsContainer) {
            console.error("O elemento .cart-items não foi encontrado no HTML.");
            return;
        }

        cartItemsContainer.innerHTML = '';

        if (carrinho.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Seu carrinho está vazio.</p>';
            return;
        }

        let totalCompra = 0;

        carrinho.forEach(item => {
            const quantidade = item.quantidade || 1;
            const subtotal = item.price * quantidade;
            totalCompra += subtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'carrinho-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="carrinho-item-info">
                    <h4>${item.name}</h4>
                    <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
                    <div class="item-controls">
                        <label>Qtd:</label>
                        <input type="number" class="quantidade-input" data-slug="${item.slug}" min="1" value="${quantidade}">
                        <button class="remover-item" data-slug="${item.slug}" aria-label="Remover item">🗑️</button>
                    </div>
                    <p class="subtotal-item">Subtotal: R$ ${subtotal.toFixed(2)}</p>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        const totalElement = document.createElement('div');
        totalElement.className = 'total-compra';
        totalElement.innerHTML = `
            <hr>
            <h3>Total da compra: R$ ${totalCompra.toFixed(2)}</h3>
            <button id="finalizar-compra" class="btn-finalizar">Finalizar Compra</button>
        `;
        cartItemsContainer.appendChild(totalElement);

        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', () => {
                const slug = btn.getAttribute('data-slug');
                removerDoCarrinho(slug);
            });
        });

        document.querySelectorAll('.quantidade-input').forEach(input => {
            input.addEventListener('input', () => {
                const slug = input.getAttribute('data-slug');
                const novaQtd = parseInt(input.value);
                const item = carrinho.find(i => i.slug === slug);
                if (item && novaQtd > 0) {
                    item.quantidade = novaQtd;
                    salvarCarrinho();
                    renderizarCarrinho();
                }
            });
        });

        const finalizarBtn = document.getElementById('finalizar-compra');
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', () => {
                if (carrinho.length === 0) {
                    alert("Seu carrinho está vazio.");
                    return;
                }
                alert("Compra finalizada com sucesso!");
                carrinho = [];
                salvarCarrinho();
                renderizarCarrinho();
                carrinhoLateral.classList.remove('carrinho-aberto');
            });
        }
    }

    const cartButton = document.getElementById('cart');
    const closeCartButton = document.getElementById('close-cart');

    if (cartButton && closeCartButton && carrinhoLateral) {
        cartButton.addEventListener('click', () => {
            carrinhoLateral.classList.toggle('carrinho-aberto');
        });
        closeCartButton.addEventListener('click', () => {
            carrinhoLateral.classList.remove('carrinho-aberto');
        });
    }

    function getProductSlugFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get("slug");
    }

    async function buscarDetalhesProduto() {
        const produtoSlug = getProductSlugFromUrl();
        if (!produtoSlug) {
            document.getElementById("detalhes-produto").textContent = "Produto não encontrado.";
            return;
        }

        try {
            const categorias = ["keyboards", "mouses", "headphones", "mousepads", "monitors"];
            let todosOsProdutos = [];
            for (const categoria of categorias) {
                const response = await fetch(`https://store-api-2ul5.onrender.com/products?name=${categoria}`);
                const data = await response.json();
                if (Array.isArray(data.products)) {
                    todosOsProdutos = todosOsProdutos.concat(data.products);
                }
            }
            const produto = todosOsProdutos.find((p) => p.slug === produtoSlug);
            if (produto) {
                renderizarDetalhes(produto);
                adicionarListenerAoBotao(produto);
            } else {
                document.getElementById("detalhes-produto").
                textContent = "Produto não encontrado.";
            }
        } catch (error) {
            console.error("Erro ao buscar os detalhes do produto:", error);
        }
    }

    function renderizarDetalhes(produto) {
        const detalhesDiv = document.getElementById('detalhes-produto');
        detalhesDiv.innerHTML = `
            <div class="product-info-wrapper">
                <div class="image-wrapper">
                    <img class="product-image" src="${produto.image}" alt="${produto.name}">
                </div>
                <div class="product-text">
                    <h2>${produto.name}</h2>
                    <p class="product-price">R$ ${produto.price.toFixed(2)}</p>
                    <div class="description-box">
                        <p>Descrição lorem ipsum dolor sit amet consectetur. Lacinia venenatis nunc nullam enim nullam vel pulvinar metus.</p>
                    </div>
                    <button class="add-to-cart-btn" data-slug="${produto.slug}">ADICIONAR AO CARRINHO</button>
                    <div class="delivery-info">
                       <img src="../img/banner fspacket.png" alt="Entrega">
                    </div>
                </div>
            </div>
        `;
    }

    function adicionarListenerAoBotao(produto) {
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                adicionarAoCarrinho(produto);
                carrinhoLateral.classList.add('carrinho-aberto');
            });
        }
    }

    carregarCarrinho();
    buscarDetalhesProduto();
});