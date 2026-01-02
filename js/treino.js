let baseTreinos = {};
let treinoAtivo = null;
let exercicioIdx = 0;
let serieAtual = 1;
let tempoDescanso = localStorage.getItem('tempoDescanso') || 60;
let intervalId = null;

export function renderTreino() {
    return `
        <div class="card">
            <h2>REGISTRO DE TREINO</h2>
            
            <div id="setup-treino">
                <div class="config-meta">
                    <span>INTERVALO (s):</span>
                    <input type="number" id="input-descanso" value="${tempoDescanso}">
                </div>
                <div class="input-group">
                    <select id="select-treino"><option>CARREGANDO...</option></select>
                    <button class="btn-add" id="btn-iniciar-treino">INICIAR TREINO</button>
                </div>
            </div>

            <div id="execucao-treino" style="display:none;">
                <div class="status-container">
                    <div class="status-box"><span>EXERCÍCIO ATUAL</span><strong id="ex-nome">-</strong></div>
                </div>
                <div class="status-container">
                    <div class="status-box"><span>SÉRIE</span><strong id="ex-serie">0 / 0</strong></div>
                    <div class="status-box"><span>REPS</span><strong id="ex-reps">0</strong></div>
                </div>

                <button class="btn-add" id="btn-acao" style="margin-bottom: 10px;">CONCLUIR SÉRIE</button>

                <div id="area-timer" class="timer-display" style="visibility: hidden; min-height: 120px;">
                    <span style="font-size:10px; color:#00E5FF">DESCANSO EM CURSO</span>
                    <div id="timer-regressivo">00</div>
                </div>

                <button class="btn-reset" onclick="location.reload()" style="margin-top:0">ABANDONAR TREINO</button>

                <div style="margin-top:30px">
                    <h3 style="font-size:10px; color:#888; border-bottom: 1px solid #404040; padding-bottom:5px">CONTEÚDO DO TREINO</h3>
                    <table class="workout-table">
                        <thead>
                            <tr><th align="left">EXERCÍCIO</th><th>SÉRIES</th><th>REPS</th></tr>
                        </thead>
                        <tbody id="lista-treino-completo"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

export async function initTreino() {
    try {
        const res = await fetch('assets/data/exercicios.xlsx');
        const ab = await res.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(ab), {type:'array'});
        const data = XLSX.utils.sheet_to_json(wb.Sheets["minha ficha"], {header: 1});

        // Mapeamento dinâmico do Excel
        for(let c=0; c < data[0].length; c+=3) {
            let nome = data[0][c];
            if(!nome) continue;
            baseTreinos[nome] = [];
            for(let r=2; r < data.length; r++) {
                if(data[r][c]) baseTreinos[nome].push({ 
                    nome: data[r][c], 
                    series: data[r][c+1], 
                    reps: data[r][c+2] 
                });
            }
        }

        const sel = document.getElementById('select-treino');
        sel.innerHTML = Object.keys(baseTreinos).map(t => `<option value="${t}">${t}</option>`).join('');
    } catch(e) { console.error("ERRO AO CARREGAR EXERCICIOS"); }

    document.getElementById('btn-iniciar-treino')?.addEventListener('click', () => {
        const escolhido = document.getElementById('select-treino').value;
        treinoAtivo = baseTreinos[chosen]; // Corrigido erro de digitação para 'escolhido'
        treinoAtivo = baseTreinos[escolhido];
        if(!treinoAtivo) return;
        document.getElementById('setup-treino').style.display = 'none';
        document.getElementById('execucao-treino').style.display = 'block';
        atualizarTela();
    });

    document.getElementById('btn-acao')?.addEventListener('click', () => {
        const btn = document.getElementById('btn-acao');
        if(btn.innerText === "CONCLUIR SÉRIE") {
            iniciarTimer();
        } else {
            pararTimer();
            avancar();
        }
    });
}

function atualizarTela() {
    const ex = treinoAtivo[exercicioIdx];
    document.getElementById('ex-nome').innerText = ex.nome.toUpperCase();
    document.getElementById('ex-serie').innerText = `${serieAtual} / ${ex.series}`;
    document.getElementById('ex-reps').innerText = ex.reps;
    
    // Atualiza a lista visual na parte de baixo
    const corpoLista = document.getElementById('lista-treino-completo');
    corpoLista.innerHTML = treinoAtivo.map((item, idx) => `
        <tr style="${idx === exercicioIdx ? 'color:#00E5FF; background:#1a1a1a' : 'color:#666'}">
            <td>${idx === exercicioIdx ? '▶ ' : ''}${item.nome.toUpperCase()}</td>
            <td align="center">${item.series}</td>
            <td align="center">${item.reps}</td>
        </tr>
    `).join('');
}

function iniciarTimer() {
    const area = document.getElementById('area-timer');
    area.style.visibility = 'visible';
    const btn = document.getElementById('btn-acao');
    btn.innerText = "PULAR DESCANSO";
    let tempo = tempoDescanso;
    document.getElementById('timer-regressivo').innerText = tempo;
    intervalId = setInterval(() => {
        tempo--;
        document.getElementById('timer-regressivo').innerText = tempo;
        if(tempo <= 0) { pararTimer(); avancar(); }
    }, 1000);
}

function pararTimer() {
    clearInterval(intervalId);
    document.getElementById('area-timer').style.visibility = 'hidden';
    document.getElementById('btn-acao').innerText = "CONCLUIR SÉRIE";
}

function avancar() {
    const ex = treinoAtivo[exercicioIdx];
    if(serieAtual < ex.series) {
        serieAtual++;
    } else {
        exercicioIdx++;
        serieAtual = 1;
    }
    if(exercicioIdx >= treinoAtivo.length) {
        alert("TREINO CONCLUÍDO!");
        location.reload();
    } else {
        atualizarTela();
    }
}
