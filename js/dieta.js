export function renderDieta() {
    return `
        <div class="card">
            <h2>MEDIDOR DE PROTEINA</h2>
            
            <div class="status-container">
                <div class="status-box"><span>CONSUMIDO</span><strong id="info-consumido">0.0</strong></div>
                <div class="status-box"><span>RESTANTE</span><strong id="info-falta">0.0</strong></div>
            </div>

            <div class="gauge-container">
                <svg class="gauge-svg" viewBox="0 0 220 120">
                    <path class="gauge-bg" d="M 10,110 A 100,100 0 0,1 210,110" />
                    <path id="gauge-fill" class="gauge-fill" d="M 10,110 A 100,100 0 0,1 210,110" />
                </svg>
            </div>

            <div class="config-meta">
                <span>META DIARIA (g):</span>
                <input type="number" id="meta-diaria" value="${meta}">
            </div>

            <div class="input-group">
                <div class="row">
                    <select id="select-alimento"><option>CARREGANDO...</option></select>
                    <input type="number" id="qtd-gramas" placeholder="g" inputmode="decimal">
                </div>
                <button class="btn-add" id="add-registro">ADICIONAR REGISTRO</button>
            </div>

            <table>
                <thead><tr><th align="left">ITEM</th><th align="left">PESO</th><th align="left">PROTEINA</th><th></th></tr></thead>
                <tbody id="tabela-corpo"></tbody>
            </table>
            
            <button class="btn-reset" id="btn-reset-dieta">APAGAR REGISTROS DO DIA</button>
        </div>
    `;
}
