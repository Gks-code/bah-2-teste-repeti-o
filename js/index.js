// Array completo de produtos
const produtos = [
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada. Perfeito para ocasiões especiais.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada. Perfeito para ocasiões especiais.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada. Perfeito para ocasiões especiais.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada. Perfeito para ocasiões especiais.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
   
    // ... (outros produtos permanecem iguais)
];

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const destaquesContainer = document.getElementById('destaques');
const categoriaSelect = document.getElementById('categoria');
const precoSelect = document.getElementById('preco');
const ordenarSelect = document.getElementById('ordenar');
const cartCount = document.getElementById('cart-count');
const itensCarrinho = document.getElementById('itens-carrinho');
const subtotalElement = document.getElementById('subtotal');
const totalElement = document.getElementById('total');
const finalizarCompraBtn = document.getElementById('finalizar-compra');

// ========== FUNÇÕES GERAIS ==========

function formatarPreco(preco) {
    return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

// ========== SISTEMA DE PRODUTOS ==========

function carregarDestaques() {
    if (!destaquesContainer) return;
    
    const produtosDestaque = produtos.filter(produto => produto.destaque);
    
    destaquesContainer.innerHTML = produtosDestaque.map(produto => `
        <div class="produto-card">
            <div class="produto-img">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='assets/img/placeholder.jpg'">
            </div>
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p>${produto.descricao}</p>
                <div class="preco">${formatarPreco(produto.preco)}</div>
                <button class="btn btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('#destaques .btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

function carregarProdutos() {
    if (!produtosContainer) return;
    
    const categoria = categoriaSelect.value;
    const preco = precoSelect.value;
    const ordenar = ordenarSelect.value;
    
    let produtosFiltrados = produtos.filter(produto => {
        if (categoria !== 'todos' && produto.categoria !== categoria) return false;
        
        switch(preco) {
            case '0-500': return produto.preco <= 500;
            case '500-1000': return produto.preco > 500 && produto.preco <= 1000;
            case '1000-5000': return produto.preco > 1000 && produto.preco <= 5000;
            case '5000+': return produto.preco > 5000;
            default: return true;
        }
    });
    
    switch(ordenar) {
        case 'preco-asc': produtosFiltrados.sort((a, b) => a.preco - b.preco); break;
        case 'preco-desc': produtosFiltrados.sort((a, b) => b.preco - a.preco); break;
        case 'nome-asc': produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome)); break;
        default: produtosFiltrados.sort((a, b) => b.destaque - a.destaque);
    }
    
    produtosContainer.innerHTML = produtosFiltrados.map(produto => `
        <div class="produto-item">
            <div class="produto-imagem">
                <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='assets/img/placeholder.jpg'">
                ${produto.destaque ? '<span class="produto-tag">Destaque</span>' : ''}
            </div>
            <div class="produto-info">
                <h3>${produto.nome}</h3>
                <p class="produto-descricao">${produto.descricao}</p>
                <div class="produto-preco">${formatarPreco(produto.preco)}</div>
                <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

// ========== SISTEMA DE CARRINHO ==========

function adicionarAoCarrinho(event) {
    const produtoId = parseInt(event.target.dataset.id);
    const produto = produtos.find(p => p.id === produtoId);
    if (!produto) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += 1;
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
    atualizarContadorCarrinho();
    
    // Feedback visual
    const btn = event.target;
    btn.textContent = '✔ Adicionado';
    btn.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        btn.textContent = 'Adicionar ao Carrinho';
        btn.style.backgroundColor = '';
    }, 2000);
}

function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItens;
        cartCount.style.display = totalItens > 0 ? 'block' : 'none';
    }
}

function renderizarCarrinho() {
    if (!itensCarrinho) return;
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-cart"></i>
                <p>Seu carrinho está vazio</p>
                <a href="produtos.html" class="btn">Ver Produtos</a>
            </div>
        `;
        if (finalizarCompraBtn) finalizarCompraBtn.disabled = true;
        return;
    }

    itensCarrinho.innerHTML = carrinho.map(item => `
        <div class="item-carrinho" data-id="${item.id}">
            <div class="item-imagem">
                <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='assets/img/placeholder.jpg'">
            </div>
            <div class="item-info">
                <h3>${item.nome}</h3>
                <div class="item-preco">${formatarPreco(item.preco)}</div>
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

    // Eventos para controle de quantidade
    document.querySelectorAll('.diminuir').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const carrinho = JSON.parse(localStorage.getItem('carrinho'));
            const item = carrinho.find(item => item.id === id);
            
            if (item.quantidade > 1) {
                item.quantidade--;
            } else {
                carrinho.splice(carrinho.indexOf(item), 1);
            }
            
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            atualizarTotais();
            atualizarContadorCarrinho();
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
            atualizarContadorCarrinho();
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
            atualizarContadorCarrinho();
        });
    });

    if (finalizarCompraBtn) finalizarCompraBtn.disabled = false;
    atualizarTotais();
}

function atualizarTotais() {
    if (!subtotalElement || !totalElement) return;
    
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const subtotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    subtotalElement.textContent = formatarPreco(subtotal);
    totalElement.textContent = formatarPreco(subtotal);
}

function finalizarCompra() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho'));
    const total = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    
    let mensagem = "Olá, gostaria de finalizar minha compra:\n\n";
    carrinho.forEach(item => {
        mensagem += `${item.nome} - ${item.quantidade}x - ${formatarPreco(item.preco * item.quantidade)}\n`;
    });
    mensagem += `\nTotal: ${formatarPreco(total)}`;
    
    window.open(`https://wa.me/SEUNUMERO?text=${encodeURIComponent(mensagem)}`, '_blank');
}

// ========== EVENT LISTENERS ==========

// Menu Mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });
}

// Newsletter
const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email && email.includes('@') && email.includes('.')) {
            alert('Obrigado por assinar nossa newsletter!');
            this.reset();
            
            const assinantes = JSON.parse(localStorage.getItem('newsletter')) || [];
            assinantes.push(email);
            localStorage.setItem('newsletter', JSON.stringify(assinantes));
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });
}

// Filtros
if (categoriaSelect) categoriaSelect.addEventListener('change', carregarProdutos);
if (precoSelect) precoSelect.addEventListener('change', carregarProdutos);
if (ordenarSelect) ordenarSelect.addEventListener('change', carregarProdutos);

// Finalizar compra
if (finalizarCompraBtn) {
    finalizarCompraBtn.addEventListener('click', finalizarCompra);
}

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
    
    if (destaquesContainer) carregarDestaques();
    if (produtosContainer) carregarProdutos();
    if (itensCarrinho) renderizarCarrinho();
    atualizarContadorCarrinho();
});