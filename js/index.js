// Array de produtos (bebidas e charutos)
const produtos = [
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos.",
        preco: 1899.90, // Alterado para número para facilitar cálculos
        imagem: "assets/img/1.jpg",
        categoria: "whisky"
    },
    {
        id: 2,
        nome: "Charuto Cohiba Siglo VI",
        descricao: "Um dos charutos mais cobiçados do mundo, feito à mão em Cuba.",
        preco: 599.90,
        imagem: "assets/img/Charuto Cohiba Siglo VI.jpg",
        categoria: "charuto"
    },
    {
        id: 3,
        nome: "Vinho Château Lafite Rothschild 2015",
        descricao: "Um dos vinhos mais prestigiados de Bordeaux, safra excepcional.",
        preco: 4999.90,
        imagem: "assets/img/Vinho Château Lafite Rothschild 2015.jpg",
        categoria: "vinho"
    },
    {
        id: 4,
        nome: "Conhaque Louis XIII",
        descricao: "O ápice da arte do conhaque, envelhecido por décadas.",
        preco: 12999.90,
        imagem: "assets/img/Conhaque Louis XIII.jpg",
        categoria: "conhaque"
    }
];

// Função para verificar se a imagem existe
function verificarImagem(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Sistema de Carrinho
const Carrinho = {
    // Adicionar item ao carrinho
    adicionarItem: function(produtoId) {
        const produto = produtos.find(p => p.id === produtoId);
        if (!produto) return;

        let carrinho = this.obterCarrinho();
        const itemExistente = carrinho.find(item => item.id === produtoId);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.push({
                id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                imagem: produto.imagem,
                quantidade: 1
            });
        }

        this.salvarCarrinho(carrinho);
        this.atualizarContador();
        this.mostrarFeedback(produtoId);
    },

    // Remover item do carrinho
    removerItem: function(produtoId) {
        let carrinho = this.obterCarrinho().filter(item => item.id !== produtoId);
        this.salvarCarrinho(carrinho);
        this.atualizarContador();
    },

    // Atualizar quantidade de um item
    atualizarQuantidade: function(produtoId, novaQuantidade) {
        if (novaQuantidade < 1) {
            this.removerItem(produtoId);
            return;
        }

        let carrinho = this.obterCarrinho();
        const item = carrinho.find(item => item.id === produtoId);
        
        if (item) {
            item.quantidade = novaQuantidade;
            this.salvarCarrinho(carrinho);
            this.atualizarContador();
        }
    },

    // Obter carrinho do localStorage
    obterCarrinho: function() {
        return JSON.parse(localStorage.getItem('carrinho')) || [];
    },

    // Salvar carrinho no localStorage
    salvarCarrinho: function(carrinho) {
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
    },

    // Calcular total do carrinho
    calcularTotal: function() {
        const carrinho = this.obterCarrinho();
        return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
    },

    // Atualizar contador no cabeçalho
    atualizarContador: function() {
        const carrinho = this.obterCarrinho();
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        const contador = document.getElementById('cart-count');
        
        if (contador) {
            contador.textContent = totalItens;
        }
    },

    // Mostrar feedback visual ao adicionar item
    mostrarFeedback: function(produtoId) {
        const botao = document.querySelector(`.btn-comprar[data-id="${produtoId}"]`);
        if (!botao) return;

        botao.textContent = '✔ Adicionado';
        botao.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            botao.textContent = 'Adicionar ao Carrinho';
            botao.style.backgroundColor = '';
        }, 2000);
    }
};

// Função principal para carregar os produtos
async function carregarProdutosDestaque() {
    const container = document.getElementById('destaques');
    if (!container) return;
    
    container.innerHTML = ''; // Limpar container

    for (const produto of produtos) {
        const caminhoImagem = produto.imagem;
        const imagemValida = await verificarImagem(caminhoImagem);
        
        const produtoHTML = `
            <div class="produto-card">
                <div class="produto-img">
                    <img src="${imagemValida ? caminhoImagem : 'assets/img/placeholder.jpg'}" 
                         alt="${produto.nome}"
                         onerror="this.src='assets/img/placeholder.jpg'">
                </div>
                <div class="produto-info">
                    <h3>${produto.nome}</h3>
                    <p>${produto.descricao}</p>
                    <div class="preco">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                    <button class="btn btn-comprar" data-id="${produto.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        
        container.innerHTML += produtoHTML;
    }

    // Adicionar eventos aos botões
    document.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', function() {
            const produtoId = parseInt(this.dataset.id);
            Carrinho.adicionarItem(produtoId);
        });
    });
}

// Menu Mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });
}



// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutosDestaque();
    Carrinho.atualizarContador();
    
    // Inicializar carrinho se não existir
    if (!localStorage.getItem('carrinho')) {
        localStorage.setItem('carrinho', JSON.stringify([]));
    }
});