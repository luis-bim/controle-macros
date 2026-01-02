import { renderDieta, initDieta } from './dieta.js';
import { renderTreino, initTreino } from './treino.js';

const container = document.getElementById('app-content');
const botoes = document.querySelectorAll('.tab-btn');

function trocarAba(id) {
    botoes.forEach(b => b.classList.toggle('active', b.dataset.tab === id));

    if (id === 'dieta') {
        container.innerHTML = renderDieta();
        initDieta();
    } else {
        container.innerHTML = renderTreino();
        initTreino();
    }
}

botoes.forEach(b => {
    b.addEventListener('click', () => trocarAba(b.dataset.tab));
});

// Inicializa na aba Dieta
window.addEventListener('load', () => trocarAba('dieta'));
