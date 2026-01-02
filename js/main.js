import { renderDieta, initDieta } from './dieta.js';

const app = document.getElementById('app-content');

function loadTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    if (tabName === 'dieta') {
        app.innerHTML = renderDieta();
        initDieta();
    } else if (tabName === 'treino') {
        app.innerHTML = `
            <div class="card">
                <h2>REGISTRO DE TREINO</h2>
                <div style="text-align: center; color: #444; padding: 40px 0; border: 1px dashed var(--borda-fina);">
                    MÓDULO EM DESENVOLVIMENTO
                </div>
            </div>`;
    }
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => loadTab(btn.dataset.tab));
});

// Inicialização
loadTab('dieta');
