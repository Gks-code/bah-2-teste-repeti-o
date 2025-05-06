const produtos = [
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos e textura aveludada.",
        preco: 1899.90,
        imagem: "assets/img/1.jpg",
        categoria: "whisky",
        destaque: true
    },
    {
        id: 2,
        nome: "Charuto Cohiba Siglo VI",
        descricao: "Um dos charutos mais cobiçados do mundo, feito à mão em Cuba.",
        preco: 599.90,
        imagem: "assets/img/Charuto Cohiba Siglo VI.jpg",
        categoria: "charuto",
        destaque: true
    },
    {
        id: 3,
        nome: "Vinho Château Lafite Rothschild 2015",
        descricao: "Um dos vinhos mais prestigiados de Bordeaux, safra excepcional.",
        preco: 4999.90,
        imagem: "assets/img/Vinho Château Lafite Rothschild 2015.jpg",
        categoria: "vinho",
        destaque: true
    },
    {
        id: 4,
        nome: "Conhaque Louis XIII",
        descricao: "O ápice da arte do conhaque, envelhecido por décadas.",
        preco: 12999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "conhaque",
        destaque: true
    },
];

// Elementos do DOM
const produtosContainer = document.getElementById('produtos-container');
const categoriaSelect = document.getElementById('categoria');
const precoSelect = document.getElementById('preco');
const ordenarSelect = document.getElementById('ordenar');
const cartCount = document.getElementById('cart-count');

// Carregar produtos
function carregarProdutos() {
    // Limpar container
    produtosContainer.innerHTML = '';
    
    // Obter valores dos filtros
    const categoria = categoriaSelect.value;
    const preco = precoSelect.value;
    const ordenar = ordenarSelect.value;
    
    // Filtrar produtos
    let produtosFiltrados = produtos.filter(produto => {
        // Filtro por categoria
        if (categoria !== 'todos' && produto.categoria !== categoria) {
            return false;
        }
        
        // Filtro por preço
        switch(preco) {
            case '0-500':
                return produto.preco <= 500;
            case '500-1000':
                return produto.preco > 500 && produto.preco <= 1000;
            case '1000-5000':
                return produto.preco > 1000 && produto.preco <= 5000;
            case '5000+':
                return produto.preco > 5000;
            default:
                return true;
        }
    });
    
    // Ordenar produtos
    switch(ordenar) {
        case 'preco-asc':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case 'nome-asc':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default:
            // Ordem padrão (destaque primeiro)
            produtosFiltrados.sort((a, b) => b.destaque - a.destaque);
    }
    
    // Exibir produtos
    produtosFiltrados.forEach(produto => {
        const produtoHTML = `
            <div class="produto-item">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='../assets/img/placeholder.jpg'">
                    ${produto.destaque ? '<span class="produto-tag">Destaque</span>' : ''}
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="produto-descricao">${produto.descricao}</p>
                    <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += produtoHTML;
    });
    

}





// Menu Mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Event listeners para filtros
categoriaSelect.addEventListener('change', carregarProdutos);
precoSelect.addEventListener('change', carregarProdutos);
ordenarSelect.addEventListener('change', carregarProdutos);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
});

// Sistema de Carrinho (adicionar estas funções ao seu código)

// Função para adicionar produto ao carrinho
function adicionarAoCarrinho(event) {
    const produtoId = parseInt(event.target.dataset.id);
    const produto = produtos.find(p => p.id === produtoId);

    if (!produto) return;

    // Obter carrinho atual do localStorage
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    // Verificar se o produto já está no carrinho
    const itemExistente = carrinho.find(item => item.id === produtoId);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        // Adicionar novo item ao carrinho
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            quantidade: 1
        });
    }

    // Salvar no localStorage
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    
    // Atualizar contador do carrinho
    atualizarContadorCarrinho();
    
    // Feedback visual
    event.target.textContent = '✔ Adicionado';
    event.target.style.backgroundColor = '#4CAF50';
    setTimeout(() => {
        event.target.textContent = 'Adicionar ao Carrinho';
        event.target.style.backgroundColor = '';
    }, 2000);
}

// Função para atualizar o contador do carrinho
function atualizarContadorCarrinho() {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    // Atualizar no DOM
    if (cartCount) {
        cartCount.textContent = totalItens;
    }
}

// Função para carregar os produtos (modifique sua função existente)
function carregarProdutos() {
    // Limpar container
    produtosContainer.innerHTML = '';
    
    // Obter valores dos filtros
    const categoria = categoriaSelect.value;
    const preco = precoSelect.value;
    const ordenar = ordenarSelect.value;
    
    // Filtrar produtos
    let produtosFiltrados = produtos.filter(produto => {
        // Filtro por categoria
        if (categoria !== 'todos' && produto.categoria !== categoria) {
            return false;
        }
        
        // Filtro por preço
        switch(preco) {
            case '0-500':
                return produto.preco <= 500;
            case '500-1000':
                return produto.preco > 500 && produto.preco <= 1000;
            case '1000-5000':
                return produto.preco > 1000 && produto.preco <= 5000;
            case '5000+':
                return produto.preco > 5000;
            default:
                return true;
        }
    });
    
    // Ordenar produtos
    switch(ordenar) {
        case 'preco-asc':
            produtosFiltrados.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            produtosFiltrados.sort((a, b) => b.preco - a.preco);
            break;
        case 'nome-asc':
            produtosFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default:
            // Ordem padrão (destaque primeiro)
            produtosFiltrados.sort((a, b) => b.destaque - a.destaque);
    }
    
    // Exibir produtos
    produtosFiltrados.forEach(produto => {
        const produtoHTML = `
            <div class="produto-item">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='../assets/img/placeholder.jpg'">
                    ${produto.destaque ? '<span class="produto-tag">Destaque</span>' : ''}
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p class="produto-descricao">${produto.descricao}</p>
                    <div class="produto-preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <button class="btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        produtosContainer.innerHTML += produtoHTML;
    });
    
    // Adicionar eventos aos botões de compra
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', adicionarAoCarrinho);
    });
}

// Função para limpar o carrinho
function limparCarrinho() {
    localStorage.removeItem('carrinho');
    atualizarContadorCarrinho();
}

// Função para obter todos os itens do carrinho
function obterItensCarrinho() {
    return JSON.parse(localStorage.getItem('carrinho')) || [];
}

// Função para calcular o total do carrinho
function calcularTotalCarrinho() {
    const carrinho = obterItensCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// Função para remover item do carrinho
function removerItemCarrinho(produtoId) {
    let carrinho = obterItensCarrinho();
    carrinho = carrinho.filter(item => item.id !== produtoId);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
}

// Função para atualizar quantidade de um item
function atualizarQuantidadeItem(produtoId, novaQuantidade) {
    if (novaQuantidade < 1) {
        removerItemCarrinho(produtoId);
        return;
    }

    let carrinho = obterItensCarrinho();
    const item = carrinho.find(item => item.id === produtoId);
    
    if (item) {
        item.quantidade = novaQuantidade;
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
    }
}

// Inicializar carrinho quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();
    atualizarContadorCarrinho();
    
    // Verificar se há carrinho no localStorage, se não, criar vazio
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
});