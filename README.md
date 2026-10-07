# 🎵 Spotify Playlist Genre Analyzer

Aplicação web moderna, responsiva e interativa criada para analisar playlists do Spotify, determinar o **gênero musical mais predominante** e exibir a **porcentagem exata de cada gênero** com gráficos e estatísticas detalhadas.

Desenvolvido para ser hospedado diretamente no **GitHub Pages**.

---

## 🌟 Funcionalidades

- 🔗 **Análise por Link de Playlist**: Insira qualquer link público do Spotify (Web ou URI).
- 🏆 **Gênero Predominante em Destaque**: Banner Hero exibindo o gênero com maior presença e sua porcentagem de dominância.
- 📊 **Gráficos Estatísticos Interativos (Chart.js)**:
  - **Gráfico de Rosca**: Distribuição percentual de gêneros.
  - **Gráfico de Barras**: Ranking dos gêneros mais frequentes.
- 🎤 **Lista Detalhada com Artistas**: Visualização de cada gênero detectado, barra de progresso e artistas representativos.
- ⚡ **Modo Demonstração Instantâneo**: Teste imediatamente com playlists de exemplo (Top Brasil, Rock Classics, Today's Top Hits, Electronic Rave, Lofi Beats) sem precisar de credenciais.
- 🔐 **Integração Real com API do Spotify**: Opção de inserir seu `Client ID` e `Client Secret` (salvos localmente no navegador em `localStorage`) para analisar qualquer playlist pública em tempo real.
- 🚀 **Design Dark Neon Glassmorphism**: Interface moderna inspirada na estética do Spotify.

---

## 💻 Como Executar Localmente

Como o projeto é composto por arquivos estáticos (`HTML`, `CSS`, `JavaScript`), basta abrir o arquivo `index.html` em qualquer navegador ou utilizar uma extensão como o *Live Server* do VS Code.

---

## 🌐 Como Hospedar no GitHub Pages

Para publicar seu site gratuitamente no GitHub Pages:

1. Faça o commit e push de todas as alterações para o seu repositório no GitHub:
   ```bash
   git add .
   git commit -m "Adiciona Analisador de Gêneros de Playlists do Spotify"
   git push origin main
   ```

2. No GitHub, navegue até a aba **Settings** (Configurações) do seu repositório.
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment** -> **Source**, selecione `Deploy from a branch`.
5. Em **Branch**, selecione `main` (ou `master`) e a pasta `/ (root)`.
6. Clique em **Save**. Em instantes seu site estará online na URL:
   `https://seu-usuario.github.io/analyzer-music/`

---

## 🔑 Como Obter Credenciais da API do Spotify (Opcional)

1. Acesse o [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Faça login com sua conta do Spotify e clique em **Create an App**.
3. Preencha o nome do App (ex: `Genre Analyzer`) e clique em **Save**.
4. Copie o **Client ID** e o **Client Secret**.
5. No site, clique no botão **Configurações API** no canto superior direito e cole suas chaves.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5 & CSS3** (Vanilla CSS com Glassmorphism e Variáveis)
- **JavaScript (ES6+)**
- **Chart.js** (Renderização de gráficos responsivos)
- **Spotify Web API**
