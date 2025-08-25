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
