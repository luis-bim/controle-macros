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
                    <div class="status-box"><span>EXERCÍCIO</span><strong id="ex-nome">-</strong></div>
                </div>
                <div class="status-container">
                    <div class="status-box"><span>SÉRIE</span><strong id="ex-serie">0 / 0</strong></div>
                    <div class="status-box"><span>REPS</span><strong id="ex-reps">0</strong></div>
                </div>
                <div id="area-timer" class="timer-display" style="display:none;">
                    <span style="font-size:10px; color:#00E5FF">DESCANSO ATIVO</span>
                    <div id="timer-regressivo">00</div>
                </div>
                <button class="btn-add" id="btn-acao">CONCLUIR SÉRIE</button>
                <button class="btn-reset" onclick="location.reload()">ABANDONAR TREINO</button>
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

        // Mapeia colunas de 3 em 3 (Treino A, B, C...)
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

    document.getElementById('input-descanso')?.addEventListener('change', (e) => {
        tempoDescanso = e.target.value;
        localStorage.setItem('tempoDescanso', tempoDescanso);
    });

    document.getElementById('btn-iniciar-treino')?.addEventListener('click', () => {
        const escolhido = document.getElementById('select-treino').value;
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
}

function iniciarTimer() {
    document.getElementById('area-timer').style.display = 'block';
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
    document.getElementById('area-timer').style.display = 'none';
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
