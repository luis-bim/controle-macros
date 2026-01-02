🤖 FITNESS_OS
Versão: 2.0 (Arquitetura Monolítica Estilizada)

Estética: Machine Cold Efficiency (Obsidian & Electric Cyan)

🎯 Objetivo
Uma aplicação web modular e ultrarrápida para monitoramento de dieta (proteínas) e execução de treinos, projetada para funcionar com zero latência e total previsibilidade visual.

📂 Estrutura de Pastas
A organização atual segue este padrão:

index.html: O coração do app. Contém a estrutura básica, os botões de aba e toda a identidade visual (CSS) para garantir que o layout nunca quebre.

js/main.js: O orquestrador. Gerencia a troca entre as abas e decide qual módulo carregar no momento.

js/dieta.js: Lógica do Medidor de Proteína, cálculos matemáticos e persistência do histórico diário.

js/treino.js: Motor de execução de treinos que processa planilhas dinâmicas e gerencia cronômetros.

assets/data/: Onde residem seus bancos de dados em Excel (proteina.xlsx e exercicios.xlsx).

🛠️ Lógica de Funcionamento
1. Identidade Visual (CSS Interno)
Para evitar problemas de cache e arquivos não encontrados, o CSS foi integrado ao index.html.

Cores: Fundo Obsidian (#0A0A0A) e detalhes em Electric Cyan (#00E5FF).

Geometria: Estritamente border-radius: 0px para uma aparência industrial.

2. Ciclo de Vida do Módulo (ESM)
Cada arquivo na pasta /js exporta duas funções obrigatórias:

render(): Retorna o código HTML puro que será injetado na tela.

init(): Ativa os ouvintes de clique e carrega os dados do Excel após o HTML aparecer.

3. Inteligência de Dados (Excel)
O app não usa um banco de dados pesado, ele lê seus arquivos .xlsx diretamente:

Dieta: Lê a aba "PROTEINA" e mapeia o nome do alimento e o valor proteico.

Treino: O código varre a aba "minha ficha" de 3 em 3 colunas (A, D, G, J...). Isso permite que você adicione infinitos treinos (A, B, C, D, E...) apenas expandindo a planilha lateralmente.

4. Interface "Constante" no Treino
Para garantir a eficiência no uso, o botão de ação ("CONCLUIR SÉRIE" / "PULAR DESCANSO") nunca muda de posição. Isso foi resolvido usando visibility: hidden no cronômetro, mantendo o espaço do relógio reservado mesmo quando ele está desligado.

🚀 Como Expandir o Projeto
Adicionar Alimentos: Basta abrir o proteina.xlsx e adicionar novas linhas na aba "PROTEINA".

Adicionar Treinos: Abra o exercicios.xlsx, crie um novo bloco de 3 colunas (Exercicio, Series, Rep) ao lado do Treino C e salve. O app detectará o novo treino automaticamente no menu.

⚠️ Requisitos de Execução
Servidor Local: Devido ao uso de Módulos JS, o app não abre clicando duas vezes no arquivo. Você deve usar a extensão Live Server do VS Code ou qualquer servidor HTTP local.
