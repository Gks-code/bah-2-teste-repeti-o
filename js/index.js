// Array de produtos (bebidas e charutos)
const produtos = [
    {
        id: 1,
        nome: "Whisky Johnnie Walker Blue Label",
        descricao: "Blended Scotch Whisky de luxo com sabores complexos.",
        preco: "R$ 1.899,90",
        imagem: "assets/img/1.jpg"
    },
    {
        id: 2,
        nome: "Charuto Cohiba Siglo VI",
        descricao: "Um dos charutos mais cobiçados do mundo, feito à mão em Cuba.",
        preco: "R$ 599,90",
        imagem: "assets/img/Charuto Cohiba Siglo VI.jpg"
    },
    {
        id: 3,
        nome: "Vinho Château Lafite Rothschild 2015",
        descricao: "Um dos vinhos mais prestigiados de Bordeaux, safra excepcional.",
        preco: "R$ 4.999,90",
        imagem: "assets/img/Vinho Château Lafite Rothschild 2015.jpg"
    },
    {
        id: 4,
        nome: "Conhaque Louis XIII",
        descricao: "O ápice da arte do conhaque, envelhecido por décadas.",
        preco: "R$ 12.999,90",
        imagem: "assets/img/Conhaque Louis XIII.jpg"
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

// Função principal para carregar os produtos
async function carregarProdutosDestaque() {
    const container = document.getElementById('destaques');
    
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
                    <div class="preco">${produto.preco}</div>
                    <button class="btn" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        
        container.innerHTML += produtoHTML;
    }
}



// Menu Mobile
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

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

// Newsletter
const newsletterForm = document.querySelector('.newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email && email.includes('@') && email.includes('.')) {
            alert('Obrigado por assinar nossa newsletter!');
            this.reset();
            
            // Salvar no localStorage
            const assinantes = JSON.parse(localStorage.getItem('newsletter')) || [];
            assinantes.push(email);
            localStorage.setItem('newsletter', JSON.stringify(assinantes));
        } else {
            alert('Por favor, insira um e-mail válido.');
        }
    });
}

// Carregar produtos quando a página estiver pronta
document.addEventListener('DOMContentLoaded', carregarProdutosDestaque);