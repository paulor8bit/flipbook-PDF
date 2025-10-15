# Criador de PDF para Impressão

Esta é uma aplicação web para reorganizar as páginas de um documento PDF para diferentes formatos de impressão, como flipbooks e livretos.

## Funcionalidades

A aplicação possui duas abas principais:

1.  **Flipbook:** Transforma um PDF de qualquer tamanho em um ou mais folhetos de 8 quadros. Se o seu PDF tiver mais de 8 páginas, ele criará folhas de impressão adicionais.
2.  **Livreto:** Reorganiza as páginas de um PDF de qualquer tamanho em um formato de imposição de livreto (montagem em sela), ideal para impressão frente e verso e dobra central.

## Como Funciona

1.  **Selecione o Modo:** Escolha entre "Flipbook" ou "Livreto" na parte superior da aplicação.
2.  **Envie o PDF:** Você pode clicar na área designada ou arrastar e soltar um arquivo PDF.
3.  **Processamento:** A aplicação irá reorganizar as páginas de acordo com o modo selecionado.
4.  **Download:** Após o processamento, um link para download do novo arquivo PDF será disponibilizado.

### Estrutura do Layout (Flipbook)

Cada página do PDF de saída é uma folha A4 em modo paisagem com a seguinte disposição de 8 quadros:

| Quadro 3 (Página C+2, Invertida) | Quadro 2 (Página C+1, Invertida) | Quadro 1 (Página C, Invertida) | Quadro 8 (Página C+7, Invertida) |
| :---: | :---: | :---: | :---: |
| Quadro 4 (Página C+3, Normal) | Quadro 5 (Página C+4, Normal) | Quadro 6 (Página C+5, Normal) | Quadro 7 (Página C+6, Normal) |

- **'C'** representa a página inicial de cada bloco de 8 (ex: 1, 9, 17...).
- Para folhas de impressão após a primeira, o **Quadro 1** sempre usará a **Página 1** do PDF original, e a sequência continua a partir do **Quadro 2** (com a página 9, 10, etc.).

### Estrutura do Layout (Livreto)

As páginas são pareadas para que, quando impressas frente e verso e dobradas, fiquem na ordem correta de leitura. Por exemplo, em um livreto, a primeira página do PDF de saída conterá a última página do original ao lado da primeira página do original.

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

<img width="565" height="832" alt="image" src="https://github.com/user-attachments/assets/f6755909-07bb-479c-b7f4-d6337446a9f1" />
