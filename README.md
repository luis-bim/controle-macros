# FITNESS_OS - App de Controle de Macros e Treino
```text
## 🎯 Objetivo
Aplicação web modular para monitoramento de dieta (foco em proteínas via Medidor de Arco) e registro de treinos, projetada com estética industrial de alto contraste (Obsidian & Cyan).

## 🛠️ Stack Tecnológica
- **Linguagem:** HTML5, CSS3, JavaScript Moderno (ES6+ Modules).
- **Banco de Dados Estático:** `assets/data/proteina.xlsx` (Processado via SheetJS).
- **Persistência de Dados:** `localStorage` do navegador.

## 📂 Estrutura de Pastas
/
├── index.html          # Ponto de entrada e moldura das abas.
├── css/
│   └── style.css       # Identidade visual global e variáveis de cor.
├── js/
│   ├── main.js         # Orquestrador de rotas e troca de abas.
│   ├── dieta.js        # Módulo Dieta: Lógica de proteínas e template HTML.
│   └── treino.js       # Módulo Treino: Registro de exercícios.
└── assets/
    └── data/
        └── proteina.xlsx # Base de dados de alimentos.
## 🏗️ Arquitetura (Instruções para IA)
Este projeto utiliza **Arquitetura Modular (ESM)**. 
Cada funcionalidade de aba está isolada em seu próprio arquivo dentro da pasta `/js`.

### Padrão de Ciclo de Vida do Módulo:
Todo módulo (ex: `dieta.js`) deve obrigatoriamente exportar duas funções:
1.  `render()`: Retorna uma String de HTML puro para ser injetada no `main#app-content`.
2.  `init()`: Ativa os `EventListeners`, carrega dados externos e realiza cálculos matemáticos após o HTML ser inserido no DOM.

**Regra Crítica:** Não utilize scripts inline no `index.html`. Toda lógica deve ser modular e exportada para o `main.js`.

## 🚀 Como Desenvolver Localmente
Devido ao uso de Módulos JavaScript (`import/export`), o navegador bloqueia a execução se os arquivos forem abertos diretamente (protocolo `file://`).
1. Use o **VS Code**.
2. Instale a extensão **Live Server**.
3. Clique em **"Go Live"** para rodar o projeto em um servidor local (`http://127.0.0.1`).

## 📋 Notas de Manutenção
- **Cores:** Gerenciadas via `:root` no `style.css`.
- **Geometria:** Estritamente `border-radius: 0px`.
- **Dados:** O Excel é lido via `fetch` em `assets/data/`. Certifique-se de que o nome da aba no Excel seja "PROTEINA".
