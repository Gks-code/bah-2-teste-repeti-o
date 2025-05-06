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
// Carrinho Mobile-Friendly
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa eventos para mobile
    initMobileEvents();
    
    // Carrega o carrinho
    renderizarCarrinho();
    atualizarContadorCarrinho();
    
    // Configura o debug mobile se necessário
    if (location.search.includes('debug=1')) {
        setupMobileDebug();
    }
});

function initMobileEvents() {
    // Eventos de toque
    document.body.addEventListener('touchstart', function() {}, {passive: true});
    
    // Botões de compra
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
        btn.addEventListener('touchend', handleAddToCart);
    });
    
    // Controles de quantidade
    document.addEventListener('click', handleQuantityControl);
    document.addEventListener('touchend', handleQuantityControl);
}

function handleAddToCart(event) {
    event.preventDefault();
    event.stopPropagation();
    
    const touchEvent = event.type === 'touchend';
    const target = touchEvent ? event.changedTouches[0].target : event.target;
    
    // Evita duplo clique/toque
    if (event.timeStamp - (target.lastClick || 0) < 1000) return;
    target.lastClick = event.timeStamp;
    
    const produtoId = parseInt(target.closest('[data-id]').dataset.id);
    // Restante da lógica do carrinho...
}

// Implemente as outras funções seguindo o mesmo padrão mobile-friendly

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se está em mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Eventos para mobile/desktop
    const addEvent = (el, event, fn) => {
        if (isMobile && event === 'click') {
            el.addEventListener('touchstart', fn, {passive: true});
        } else {
            el.addEventListener(event, fn);
        }
    };

    // Atualiza contador do carrinho
    function atualizarContador() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const total = carrinho.reduce((sum, item) => sum + item.quantidade, 0);
        if (cartCount) {
            cartCount.textContent = total;
            cartCount.style.display = total ? 'block' : 'none';
        }
    }

    // Renderiza os itens do carrinho
    function renderCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const container = document.getElementById('itens-carrinho');
        
        if (!container) return;
        
        if (carrinho.length === 0) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                    <a href="produtos.html" class="btn">Ver Produtos</a>
                </div>`;
            return;
        }
        
        container.innerHTML = carrinho.map(item => `
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
        
        // Adiciona eventos
        carrinho.forEach(item => {
            const id = item.id;
            
            // Botão diminuir
            const btnDiminuir = container.querySelector(`.diminuir[data-id="${id}"]`);
            if (btnDiminuir) {
                addEvent(btnDiminuir, 'click', () => atualizarQuantidade(id, -1));
            }
            
            // Botão aumentar
            const btnAumentar = container.querySelector(`.aumentar[data-id="${id}"]`);
            if (btnAumentar) {
                addEvent(btnAumentar, 'click', () => atualizarQuantidade(id, 1));
            }
            
            // Botão remover
            const btnRemover = container.querySelector(`.remover-item[data-id="${id}"]`);
            if (btnRemover) {
                addEvent(btnRemover, 'click', () => removerItem(id));
            }
        });
        
        atualizarTotal();
    }

    // Função para adicionar ao carrinho
    function adicionarAoCarrinho(id) {
        const produto = produtos.find(p => p.id === id);
        if (!produto) return;
        
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const itemIndex = carrinho.findIndex(item => item.id === id);
        
        if (itemIndex >= 0) {
            carrinho[itemIndex].quantidade += 1;
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContador();
        
        // Feedback visual
        if (isMobile) {
            const btn = document.querySelector(`.btn-comprar[data-id="${id}"]`);
            if (btn) {
                btn.textContent = '✔ Adicionado';
                setTimeout(() => {
                    btn.textContent = 'Adicionar ao Carrinho';
                }, 2000);
            }
        }
    }

    // Configura os botões "Adicionar ao Carrinho"
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        addEvent(btn, 'click', (e) => {
            e.preventDefault();
            adicionarAoCarrinho(id);
        });
    });

    // Inicializa o carrinho
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
    
    renderCarrinho();
    atualizarContador();
});

// Funções auxiliares (adicionar conforme necessário)
function atualizarQuantidade(id, change) {
    // Implementação da função
}

function removerItem(id) {
    // Implementação da função
}

function atualizarTotal() {
    // Implementação da função
}