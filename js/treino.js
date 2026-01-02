let baseTreinos = {};
let treinoAtivo = null;
let exercicioAtualIdx = 0;
let serieAtual = 1;
let tempoDescanso = localStorage.getItem('tempoDescanso') || 60;
let cronometroInterval = null;

export function renderTreino() {
    return `
        <div class="card" id="treino-container">
            <h2>REGISTRO DE TREINO</h2>
            
            <div id="setup-treino">
                <div class="config-meta">
                    <span>DESCANSO (s):</span>
                    <input type="number" id="input-descanso" value="${tempoDescanso}">
                </div>
                <div class="input-group">
                    <select id="select-treino"><option>CARREGANDO TREINOS...</option></select>
                    <button class="btn-add" id="btn-iniciar">INICIAR TREINO</button>
                </div>
            </div>

            <div id="execucao-treino" style="display:none;">
                <div class="status-container">
                    <div class="status-box">
                        <span>EXERCÍCIO</span>
                        <strong id="display-exercicio">-</strong>
                    </div>
                </div>
                
                <div class="status-container">
                    <div class="status-box">
                        <span>SÉRIE</span>
                        <strong id="display-serie">0 / 0</strong>
                    </div>
                    <div class="status-box">
                        <span>REPETIÇÕES</span>
                        <strong id="display-reps">0</strong>
                    </div>
                </div>

                <div id="timer-container" class="timer-display" style="display:none;">
                    <span>DESCANSO EM CURSO</span>
                    <div id="timer-regressivo">00</div>
                </div>

                <button class="btn-add" id="btn-proximo">CONCLUIR SÉRIE</button>
                <button class="btn-reset" id="btn-cancelar-treino" style="margin-top:10px">ABANDONAR TREINO</button>
            </div>
        </div>
    `;
}

export async function initTreino() {
    try {
        const res = await fetch('assets/data/exercicios.xlsx');
        const ab = await res.arrayBuffer();
        const wb = XLSX.read(new Uint8Array(ab), {type:'array'});
        const sheet = wb.Sheets["minha ficha"];
        const dados = XLSX.utils.sheet_to_json(sheet, {header: 1});

        // Processamento dinâmico: Cada 3 colunas representam um treino (Exercicio, Series, Reps)
        baseTreinos = {};
        const cabecalho = dados[0]; // Linha 1: Treino A, Treino B...

        for (let col = 0; col < cabecalho.length; col += 3) {
            const nomeTreino = cabecalho[col];
            if (nomeTreino) {
                baseTreinos[nomeTreino] = [];
                // Percorre as linhas de exercícios (pulando as 2 primeiras de cabeçalho)
                for (let row = 2; row < dados.length; row++) {
                    const exercicio = dados[row][col];
                    const series = dados[row][col + 1];
                    const reps = dados[row][col + 2];
                    if (exercicio) {
                        baseTreinos[nomeTreino].push({ exercicio, series, reps });
                    }
                }
            }
        }

        const sel = document.getElementById('select-treino');
        if(sel) {
            sel.innerHTML = Object.keys(baseTreinos).map(t => `<option value="${t}">${t.toUpperCase()}</option>`).join('');
        }
    } catch(e) { console.error("ERRO AO CARREGAR EXCEL DE TREINOS", e); }

    // Eventos
    document.getElementById('input-descanso')?.addEventListener('change', (e) => {
        tempoDescanso = e.target.value;
        localStorage.setItem('tempoDescanso', tempoDescanso);
    });

    document.getElementById('btn-iniciar')?.addEventListener('click', iniciarTreino);
    document.getElementById('btn-proximo')?.addEventListener('click', gerenciarFluxo);
    document.getElementById('btn-cancelar-treino')?.addEventListener('click', () => {
        if(confirm("DESEJA ENCERRAR O TREINO ATUAL?")) location.reload();
    });
}

function iniciarTreino() {
    const idTreino = document.getElementById('select-treino').value;
    treinoAtivo = baseTreinos[idTreino];
    exercicioAtualIdx = 0;
    serieAtual = 1;
    
    document.getElementById('setup-treino').style.display = 'none';
    document.getElementById('execucao-treino').style.display = 'block';
    atualizarDisplayExecucao();
}

function atualizarDisplayExecucao() {
    const ex = treinoAtivo[exercicioAtualIdx];
    document.getElementById('display-exercicio').innerText = ex.exercicio.toUpperCase();
    document.getElementById('display-serie').innerText = `${serieAtual} / ${ex.series}`;
    document.getElementById('display-reps').innerText = ex.reps;
}

function gerenciarFluxo() {
    const ex = treinoAtivo[exercicioAtualIdx];
    const btn = document.getElementById('btn-proximo');

    if (btn.innerText === "CONCLUIR SÉRIE") {
        iniciarDescanso();
    } else if (btn.innerText === "PULAR DESCANSO" || btn.innerText === "PRÓXIMO EXERCÍCIO") {
        pararDescanso();
        avancarTreino();
    }
}

function iniciarDescanso() {
    const timerDiv = document.getElementById('timer-container');
    const timerDisplay = document.getElementById('timer-regressivo');
    const btn = document.getElementById('btn-proximo');
    
    timerDiv.style.display = 'block';
    btn.innerText = "PULAR DESCANSO";
    
    let tempo = parseInt(tempoDescanso);
    timerDisplay.innerText = tempo;

    cronometroInterval = setInterval(() => {
        tempo--;
        timerDisplay.innerText = tempo;
        if (tempo <= 0) {
            pararDescanso();
            avancarTreino();
        }
    }, 1000);
}

function pararDescanso() {
    clearInterval(cronometroInterval);
    document.getElementById('timer-container').style.display = 'none';
}

function avancarTreino() {
    const ex = treinoAtivo[exercicioAtualIdx];
    
    if (serieAtual < ex.series) {
        serieAtual++;
    } else {
        exercicioAtualIdx++;
        serieAtual = 1;
    }

    if (exercicioAtualIdx < treinoAtivo.length) {
        document.getElementById('btn-proximo').innerText = "CONCLUIR SÉRIE";
        atualizarDisplayExecucao();
    } else {
        finalizarTreino();
    }
}

function finalizarTreino() {
    alert("TREINO CONCLUÍDO COM SUCESSO.");
    location.reload();
}
