let baseDados = {};
let historico = JSON.parse(localStorage.getItem('consumoProteina')) || [];
let meta = localStorage.getItem('metaProteina') || 150;

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
            <div class="config-meta" style="display:flex; justify-content:space-between; margin: 10px 0 20px 0; font-family:var(--fonte-mono); font-size:11px;">
                <span>META DIARIA (g):</span>
                <input type="number" id="meta-diaria" value="${meta}" style="background:var(--fundo-preto); color:white; border:1px solid var(--borda-fina); width:42px; text-align:center;">
            </div>
            <div class="input-group">
                <div class="row">
                    <select id="select-alimento"><option>CARREGANDO...</option></select>
                    <input type="number" id="qtd-gramas" placeholder="g" inputmode="decimal">
                </div>
                <button class="btn-add" id="add-registro">ADICIONAR REGISTRO</button>
            </div>
            <table>
                <thead><tr><th align="left">ITEM</th><th align="left">PESO</th><th align="left">PROTEINA</th><th style="width:40px"></th></tr></thead>
                <tbody id="tabela-corpo"></tbody>
            </table>
            <button class="btn-reset" id="btn-reset-dieta">APAGAR REGISTROS DO DIA</button>
        </div>
    `;
}

export async function initDieta() {
    try {
        const res = await fetch('assets/data/proteina.xlsx');
        const ab = await res.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(ab), {type:'array'});
        const json = XLSX.utils.sheet_to_json(wb.Sheets["PROTEINA"], {header:"A"});
        const sel = document.getElementById('select-alimento');
        if(sel) {
            sel.innerHTML = '<option value="">SELECIONE...</option>';
            json.forEach((l, i) => {
                if(i > 0 && l.A && l.D) {
                    baseDados[l.A] = l.D;
                    sel.innerHTML += `<option value="${l.A}">${l.A.toUpperCase()}</option>`;
                }
            });
        }
    } catch(e) { console.error("ERRO_EXCEL"); }

    document.getElementById('meta-diaria')?.addEventListener('change', (e) => {
        meta = e.target.value;
        localStorage.setItem('metaProteina', meta);
        atualizarInterface();
    });

    document.getElementById('add-registro')?.addEventListener('click', () => {
        const ali = document.getElementById('select-alimento').value;
        const gra = parseFloat(document.getElementById('qtd-gramas').value);
        if(!ali || !gra) return;
        historico.push({ alimento: ali, gramas: gra, proteina: parseFloat((gra * baseDados[ali]).toFixed(1)) });
        localStorage.setItem('consumoProteina', JSON.stringify(historico));
        document.getElementById('qtd-gramas').value = "";
        atualizarInterface();
    });

    document.getElementById('btn-reset-dieta')?.addEventListener('click', () => {
        if(confirm("ZERAR TUDO?")) { historico = []; localStorage.removeItem('consumoProteina'); atualizarInterface(); }
    });

    window.removerItemDieta = (i) => {
        if(confirm(`REMOVER ${historico[i].alimento.toUpperCase()}?`)) {
            historico.splice(i, 1);
            localStorage.setItem('consumoProteina', JSON.stringify(historico));
            atualizarInterface();
        }
    };

    function atualizarInterface() {
        const corpo = document.getElementById('tabela-corpo');
        if(!corpo) return;
        corpo.innerHTML = "";
        let total = 0;
        historico.forEach((item, i) => {
            total += item.proteina;
            corpo.innerHTML += `<tr>
                <td>${item.alimento.toUpperCase()}</td>
                <td>${item.gramas}g</td>
                <td>${item.proteina}g</td>
                <td style="text-align:right"><span class="btn-del" onclick="removerItemDieta(${i})">X</span></td>
            </tr>`;
        });
        const falta = Math.max(0, meta - total);
        document.getElementById('info-consumido').innerText = total.toFixed(1);
        document.getElementById('info-falta').innerText = falta.toFixed(1);
        const percent = Math.min(1, total / meta);
        document.getElementById('gauge-fill').style.strokeDashoffset = 314.15 * (1 - percent);
    }
    atualizarInterface();
}
