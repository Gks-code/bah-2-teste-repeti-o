// Funções específicas para a página do carrinho

// Elementos do DOM
const itensCarrinho = document.getElementById('itens-carrinho');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

// Função para renderizar os itens do carrinho
function renderizarCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="produtos.html" class="btn">Ver Produtos</a>
            </div>
        `;
        finalizarCompraBtn.disabled = true;
        return;
    }

    itensCarrinho.innerHTML = carrinho.map(item => `
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

    // Adicionar eventos
    document.querySelectorAll('.diminuir').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const carrinho = JSON.parse(localStorage.getItem('carrinho'));
            const item = carrinho.find(item => item.id === id);
            
            if (item.quantidade > 1) {
                item.quantidade--;
                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                renderizarCarrinho();
                atualizarTotais();
            }
        });
    });

    document.querySelectorAll('.aumentar').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const carrinho = JSON.parse(localStorage.getItem('carrinho'));
            const item = carrinho.find(item => item.id === id);
            
            item.quantidade++;
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarTotais();
        });
    });

    document.querySelectorAll('.remover-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            let carrinho = JSON.parse(localStorage.getItem('carrinho'));
            carrinho = carrinho.filter(item => item.id !== id);
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarTotais();
        });
    });

    finalizarCompraBtn.disabled = false;
    atualizarTotais();
}

// Função para atualizar totais
function atualizarTotais() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    subtotalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    totalElement.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
}

// Finalizar compra
finalizarCompraBtn.addEventListener('click', () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    const total = calcularTotalCarrinho();
    
    // Criar mensagem para WhatsApp
    let mensagem = "Olá, gostaria de finalizar minha compra:\n\n";
    carrinho.forEach(item => {
        mensagem += `${item.nome} - ${item.quantidade}x - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
    });
    mensagem += `\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`;
    
    // Redirecionar para WhatsApp
    window.open(`https://wa.me/554491689598?text=${encodeURIComponent(mensagem)}`, '_blank');
    
    // Limpar carrinho (opcional)
    // localStorage.removeItem('carrinho');
    // renderizarCarrinho();
});

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizarCarrinho();
});

//MOBILE
// Versão otimizada para mobile
document.addEventListener('DOMContentLoaded', function() {
    // Elementos importantes
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('itens-carrinho');
    
    // Atualiza visualização do carrinho
    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        
        // Atualiza contador
        if (cartCount) {
            const total = cart.reduce((sum, item) => sum + item.quantidade, 0);
            cartCount.textContent = total;
            cartCount.style.display = total ? 'block' : 'none';
        }
        
        // Atualiza lista de itens
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="carrinho-vazio">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Seu carrinho está vazio</p>
                        <a href="produtos.html" class="btn">Ver Produtos</a>
                    </div>`;
                return;
            }
            
            cartItems.innerHTML = cart.map(item => `
                <div class="item-carrinho" data-id="${item.id}">
                    <div class="item-imagem">
                        <img src="${item.imagem}" alt="${item.nome}">
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
        }
        
        updateTotal();
    }
    
    // Adiciona produto ao carrinho (com tratamento para mobile)
    function addToCart(productId) {
        const cart = JSON.parse(localStorage.getItem('carrinho')) || [];
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantidade += 1;
        } else {
            const product = produtos.find(p => p.id === productId);
            if (product) {
                cart.push({
                    id: product.id,
                    nome: product.nome,
                    preco: product.preco,
                    imagem: product.imagem,
                    quantidade: 1
                });
            }
        }
        
        localStorage.setItem('carrinho', JSON.stringify(cart));
        updateCart();
        
        // Feedback visual para mobile
        const btn = document.querySelector(`[data-id="${productId}"]`);
        if (btn) {
            btn.classList.add('added-to-cart');
            setTimeout(() => btn.classList.remove('added-to-cart'), 2000);
        }
    }
    
    // Configura eventos (compatível com touch)
    function setupEvents() {
        // Adicionar ao carrinho
        document.querySelectorAll('.btn-comprar').forEach(btn => {
            btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                addToCart(parseInt(btn.dataset.id));
            });
        });
        
        // Controles de quantidade (delegação de eventos)
        document.addEventListener('click', handleQuantity);
        document.addEventListener('touchend', handleQuantity);
    }
    
    // Inicialização
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
    
    setupEvents();
    updateCart();
});

// Funções auxiliares (mantenha as que você já tem)