import { renderDieta, initDieta } from './dieta.js';
import { renderTreino, initTreino } from './treino.js';

const app = document.getElementById('app-content');
const buttons = document.querySelectorAll('.tab-btn');

function navigateTo(tabId) {
    buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));

    if (tabId === 'dieta') {
        app.innerHTML = renderDieta();
        initDieta();
    } else {
        app.innerHTML = renderTreino();
        initTreino();
    }
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => navigateTo(btn.dataset.tab));
});

// Inicia na Dieta
navigateTo('dieta');
