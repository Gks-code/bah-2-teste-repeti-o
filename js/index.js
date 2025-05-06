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
        id: 2,
        nome: "Charuto Cohiba Siglo VI",
        descricao: "Um dos charutos mais cobiçados do mundo, feito à mão em Cuba com folhas de tabaco selecionadas.",
        preco: 599.90,
        imagem: "assets/img/Charuto Cohiba Siglo VI.jpg",
        categoria: "charuto",
        destaque: true
    },
    {
        id: 3,
        nome: "Vinho Château Lafite Rothschild 2015",
        descricao: "Um dos vinhos mais prestigiados de Bordeaux, safra excepcional com aromas de frutas escuras e especiarias.",
        preco: 4999.90,
        imagem: "assets/img/Vinho Château Lafite Rothschild 2015.jpg",
        categoria: "vinho",
        destaque: true
    },
    {
        id: 4,
        nome: "Conhaque Louis XIII",
        descricao: "O ápice da arte do conhaque, envelhecido por décadas em barris de carvalho, com notas de frutas cristalizadas e baunilha.",
        preco: 12999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "conhaque",
        destaque: true
    },
    {
        id: 5,
        nome: "Whisky Macallan 18 anos",
        descricao: "Single malt escocês envelhecido por 18 anos em barris de carvalho, com notas de chocolate e frutas secas.",
        preco: 2999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "whisky",
        destaque: false
    },
    {
        id: 6,
        nome: "Vinho Dom Perignon 2012",
        descricao: "Champagne vintage francês com bolhas refinadas e aromas complexos de frutas brancas e amêndoas.",
        preco: 1599.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "vinho",
        destaque: false
    },
    {
        id: 7,
        nome: "Charuto Montecristo No. 2",
        descricao: "Charuto cubano clássico com formato torpedo, oferecendo sabores ricos de madeira e nozes.",
        preco: 399.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "charuto",
        destaque: false
    },
    {
        id: 8,
        nome: "Whisky Jack Daniel's Single Barrel",
        descricao: "Whisky Tennessee selecionado de barris únicos, com carácter marcante e notas de caramelo.",
        preco: 499.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "whisky",
        destaque: false
    }
];

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const destaquesContainer = document.getElementById('destaques');
const categoriaSelect = document.getElementById('categoria');
const precoSelect = document.getElementById('preco');
const ordenarSelect = document.getElementById('ordenar');
const cartCount = document.getElementById('cart-count');

// Função para formatar preço
function formatarPreco(preco) {
    return 'R$ ' + preco.toFixed(2).replace('.', ',');
}

// Função para carregar produtos em destaque
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
    
    // Adicionar eventos aos botões
    document.querySelectorAll('#destaques .btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

// Função para carregar todos os produtos com filtros
function carregarProdutos() {
    if (!produtosContainer) return;
    
    // Obter valores dos filtros
    const categoria = categoriaSelect.value;
    const preco = precoSelect.value;
    const ordenar = ordenarSelect.value;
    
    // Filtrar produtos
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
    
    // Ordenar produtos
    switch(ordenar) {
        case 'preco-asc': produtosFiltrados.sort((a, b) => a.preco - b.preco); break;
        case 'preco-desc': produtosFiltrados.sort((a, b) => b.preco - a.preco); break;
        case 'nome-asc': produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome)); break;
        default: produtosFiltrados.sort((a, b) => b.destaque - a.destaque);
    }
    
    // Exibir produtos
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
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

// Função para adicionar produto ao carrinho
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

// Função para atualizar contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItens;
        cartCount.style.display = totalItens > 0 ? 'block' : 'none';
    }
}

// Funções do carrinho
function limparCarrinho() {
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
}

function obterItensCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

function calcularTotalCarrinho() {
    const carrinho = obterItensCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function removerItemCarrinho(produtoId) {
    let carrinho = obterItensCarrinho().filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

function atualizarQuantidadeItem(produtoId, novaQuantidade) {
    if (novaQuantidade < 1) return removerItemCarrinho(produtoId);
    
    let carrinho = obterItensCarrinho();
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade = novaQuantidade;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
    }
}

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

// Event listeners para filtros
if (categoriaSelect) categoriaSelect.addEventListener('change', carregarProdutos);
if (precoSelect) precoSelect.addEventListener('change', carregarProdutos);
if (ordenarSelect) ordenarSelect.addEventListener('change', carregarProdutos);

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
    
    if (destaquesContainer) carregarDestaques();
    if (produtosContainer) carregarProdutos();
    atualizarContadorCarrinho();
});