// Versão mobile-optimizada para o carrinho
document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial
    const CARRINHO_KEY = 'carrinho_premium_v2';
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('itens-carrinho');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const finalizarBtn = document.getElementById('finalizar-compra');

    // Inicialização
    initCarrinho();

    function initCarrinho() {
        if (!localStorage.getItem(CARRINHO_KEY)) {
            localStorage.setItem(CARRINHO_KEY, JSON.stringify([]));
        }
        updateCartUI();
        setupEventListeners();
    }

    function getCart() {
        return JSON.parse(localStorage.getItem(CARRINHO_KEY)) || [];
    }

    function saveCart(cart) {
        localStorage.setItem(CARRINHO_KEY, JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const cart = getCart();
        
        // Atualizar contador
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
        
        // Atualizar lista de itens
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="carrinho-vazio">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Seu carrinho está vazio</p>
                        <a href="produtos.html" class="btn">Ver Produtos</a>
                    </div>`;
                if (finalizarBtn) finalizarBtn.disabled = true;
                return;
            }
            
            cartItems.innerHTML = cart.map(item => `
                <div class="item-carrinho" data-id="${item.id}">
                    <div class="item-imagem">
                        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='assets/img/placeholder.jpg'">
                    </div>
                    <div class="item-info">
                        <h3>${item.nome}</h3>
                        <div class="item-preco">R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                        <button class="remover-item" data-id="${item.id}">
                            <i class="fas fa-trash"></i> Remover
                        </button>
                    </div>
                    <div class="item-controle">
                        <button class="diminuir" data-id="${item.id}">-</button>
                        <span class="quantidade">${item.quantidade}</span>
                        <button class="aumentar" data-id="${item.id}">+</button>
                    </div>
                </div>
            `).join('');
            
            if (finalizarBtn) finalizarBtn.disabled = false;
        }
        
        // Atualizar totais
        updateTotals();
    }

    function updateTotals() {
        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        
        if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        if (totalEl) totalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }

    function setupEventListeners() {
        // Adicionar ao carrinho (delegação de eventos)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-comprar')) {
                addToCart(parseInt(e.target.dataset.id));
            }
        });
        
        // Touch events para mobile
        document.addEventListener('touchend', function(e) {
            const touchTarget = e.changedTouches[0].target;
            if (touchTarget.classList.contains('btn-comprar')) {
                e.preventDefault();
                addToCart(parseInt(touchTarget.dataset.id));
            }
        }, { passive: false });

        // Controles do carrinho (delegação)
        if (cartItems) {
            cartItems.addEventListener('click', function(e) {
                const target = e.target.closest('[data-id]');
                if (!target) return;
                
                const id = parseInt(target.dataset.id);
                const cart = getCart();
                const item = cart.find(item => item.id === id);
                
                if (e.target.classList.contains('remover-item')) {
                    saveCart(cart.filter(item => item.id !== id));
                } 
                else if (e.target.classList.contains('diminuir')) {
                    if (item.quantidade > 1) {
                        item.quantidade--;
                        saveCart(cart);
                    } else {
                        saveCart(cart.filter(item => item.id !== id));
                    }
                }
                else if (e.target.classList.contains('aumentar')) {
                    item.quantidade++;
                    saveCart(cart);
                }
            });
        }

        // Finalizar compra
        if (finalizarBtn) {
            finalizarBtn.addEventListener('click', finalizarCompra);
        }
    }

    function addToCart(productId) {
        const cart = getCart();
        const product = produtos.find(p => p.id === productId);
        
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantidade++;
        } else {
            cart.push({
                id: product.id,
                nome: product.nome,
                preco: product.preco,
                imagem: product.imagem,
                quantidade: 1
            });
        }
        
        saveCart(cart);
        showAddFeedback(productId);
    }

    function showAddFeedback(productId) {
        const btn = document.querySelector(`.btn-comprar[data-id="${productId}"]`);
        if (!btn) return;
        
        btn.textContent = '✓ Adicionado';
        btn.classList.add('added-feedback');
        
        setTimeout(() => {
            btn.textContent = 'Adicionar ao Carrinho';
            btn.classList.remove('added-feedback');
        }, 2000);
    }

    function finalizarCompra() {
        const cart = getCart();
        if (cart.length === 0) return;
        
        const total = cart.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
        let message = "Olá, gostaria de finalizar minha compra:\n\n";
        
        cart.forEach(item => {
            message += `${item.nome} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
        });
        
        message += `\n*Total: R$ ${total.toFixed(2)}*`;
        
        window.open(`https://wa.me/554491689598?text=${encodeURIComponent(message)}`, '_blank');
    }
});