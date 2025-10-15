# Flipbook PDF
<img width="1051" height="728" alt="image" src="https://github.com/user-attachments/assets/b3c84ccc-077c-4c87-a8b8-bde0e4f89bef" />

Acessar online: [flipbook-pdfbr.surge.sh](https://flipbook-pdfbr.surge.sh/)

Esta é uma simples aplicação web para reorganizar as páginas de um documento PDF de 8 páginas em um layout de flipbook de página única, pronto para impressão. A ferramenta organiza as páginas em uma folha A4 em modo paisagem, que pode ser impressa, cortada, empilhada e dobrada para criar um pequeno flipbook.

## Como Funciona

1.  **Envie o PDF:** Você pode clicar na área designada ou arrastar e soltar um arquivo PDF de 8 páginas.
2.  **Processamento:** A aplicação irá pegar as 8 páginas e organizá-las em uma única página A4 em modo paisagem.
3.  **Layout:** As páginas são dispostas em uma grade de 4x2. A linha superior (páginas 1, 2, 3 e 8 do original) é rotacionada em 180 graus (de cabeça para baixo). A linha inferior (páginas 4, 5, 6 e 7) permanece na orientação normal.
4.  **Download:** Após o processamento, um link para download do novo arquivo PDF será disponibilizado.

### Estrutura do Layout

A página final terá a seguinte disposição:

| Quadro 3 (Página 3, Invertida) | Quadro 2 (Página 2, Invertida) | Quadro 1 (Página 1, Invertida) | Quadro 8 (Página 8, Invertida) |
| :---: | :---: | :---: | :---: |
| Quadro 4 (Página 4, Normal) | Quadro 5 (Página 5, Normal) | Quadro 6 (Página 6, Normal) | Quadro 7 (Página 7, Normal) |

## Instalação Local

Esta aplicação não requer um processo de compilação complexo e pode ser executada localmente com um servidor web simples.

### Pré-requisitos

*   Um navegador de internet moderno (Chrome, Firefox, Safari, Edge).
*   Python (opcional, para um servidor simples) ou uma extensão de servidor web para o seu editor de código (como o Live Server para VS Code).

### Passos para Executar

1.  **Faça o download dos arquivos:** Baixe todos os arquivos do projeto (`index.html`, `index.tsx`, `App.tsx`, etc.) para uma pasta em seu computador.

2.  **Inicie um servidor local:** Como os navegadores têm restrições de segurança para carregar módulos JavaScript (`type="module"`) diretamente do sistema de arquivos (`file://`), você precisa servir os arquivos através de um servidor HTTP local.

    *   **Usando Python:**
        Abra o terminal ou prompt de comando, navegue até a pasta onde você salvou os arquivos e execute um dos seguintes comandos:
        ```bash
        # Para Python 3
        python -m http.server

        # Para Python 2
        python -m SimpleHTTPServer
        ```
        O servidor será iniciado, geralmente na porta 8000.

    *   **Usando a extensão Live Server (VS Code):**
        1.  Instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no Visual Studio Code.
        2.  Abra a pasta do projeto no VS Code.
        3.  Clique com o botão direito no arquivo `index.html` e selecione "Open with Live Server".

3.  **Acesse a aplicação:** Abra seu navegador e acesse o endereço fornecido pelo servidor local (geralmente `http://localhost:8000` ou `http://127.0.0.1:5500` para o Live Server).
