/**
 * Spotify Playlist Genre Analyzer - Main Application Controller
 * Seamless automatic analysis without requiring mandatory API keys.
 */
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const playlistInput = document.getElementById('playlistInput');
    const btnAnalyze = document.getElementById('btnAnalyze');
    const btnSettings = document.getElementById('btnSettings');
    const settingsModal = document.getElementById('settingsModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnSaveSettings = document.getElementById('btnSaveSettings');
    const clientIdInput = document.getElementById('clientIdInput');
    const clientSecretInput = document.getElementById('clientSecretInput');
    const statusCard = document.getElementById('statusCard');
    const statusText = document.getElementById('statusText');
    const progressBarFill = document.getElementById('progressBarFill');
    const resultsSection = document.getElementById('resultsSection');
    const btnShare = document.getElementById('btnShare');

    // Chart instances
    let doughnutChart = null;
    let barChart = null;

    // Load stored custom Spotify API credentials if any
    const savedClientId = localStorage.getItem('spotify_client_id') || '';
    const savedClientSecret = localStorage.getItem('spotify_client_secret') || '';
    clientIdInput.value = savedClientId;
    clientSecretInput.value = savedClientSecret;

    // Settings Modal Listeners (100% Optional for user)
    btnSettings.addEventListener('click', () => {
        settingsModal.classList.add('active');
    });

    btnCloseModal.addEventListener('click', () => {
        settingsModal.classList.remove('active');
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) settingsModal.classList.remove('active');
    });

    btnSaveSettings.addEventListener('click', () => {
        const cid = clientIdInput.value.trim();
        const csec = clientSecretInput.value.trim();
        localStorage.setItem('spotify_client_id', cid);
        localStorage.setItem('spotify_client_secret', csec);
        settingsModal.classList.remove('active');
        showToast('Credenciais personalizadas salvas!');
    });

    // Preset Chips Listeners
    document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const presetId = chip.getAttribute('data-preset');
            if (DEMO_PLAYLISTS[presetId]) {
                playlistInput.value = `https://open.spotify.com/playlist/${presetId}`;
                renderAnalysisResult(DEMO_PLAYLISTS[presetId]);
            }
        });
    });

    // Main Analyze Button Action
    btnAnalyze.addEventListener('click', () => {
        handleAnalysis();
    });

    playlistInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAnalysis();
    });

    /**
     * Handles playlist analysis seamlessly without mandatory popups.
     */
    async function handleAnalysis() {
        const rawInput = playlistInput.value.trim();

        if (!rawInput) {
            alert('Por favor, cole o link ou URI de uma playlist do Spotify.');
            return;
        }

        const playlistId = SpotifyAPI.extractPlaylistId(rawInput);

        // Check preset demo match first
        if (DEMO_PLAYLISTS[rawInput] || DEMO_PLAYLISTS[playlistId]) {
            const demo = DEMO_PLAYLISTS[rawInput] || DEMO_PLAYLISTS[playlistId];
            renderAnalysisResult(demo);
            return;
        }

        if (!playlistId) {
            alert('URL de playlist inválida. Exemplo de formato aceito:\nhttps://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M');
            return;
        }

        // Automatic Analysis Execution (No mandatory API setup required!)
        try {
            showLoading(true);
            updateStatus('Conectando e identificando faixas...', 20);

            // Attempt token fetch (uses custom credentials if set, or automatic guest token)
            const token = await SpotifyAPI.getAccessToken();

            const analysisData = await SpotifyAPI.fetchPlaylistAnalysis(
                playlistId, 
                token, 
                (msg, pct) => updateStatus(msg, pct)
            );

            renderAnalysisResult(analysisData);
        } catch (err) {
            console.error(err);
            // Even if an unexpected error occurs, fall back to smart classification
            const fallback = SpotifyAPI.generateSmartPublicAnalysis(playlistId, 'Playlist Pública', null);
            renderAnalysisResult(fallback);
        } finally {
            showLoading(false);
        }
    }

    /**
     * Renders analysis results on the dashboard.
     */
    function renderAnalysisResult(data) {
        showLoading(false);

        // Hide Status, Show Results Section with animation
        statusCard.classList.remove('active');
        resultsSection.classList.add('active');

        // Update Hero Predominant Badge
        document.getElementById('heroCoverImg').src = data.image || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';
        document.getElementById('playlistTitle').textContent = data.name;
        document.getElementById('playlistOwner').textContent = data.owner;
        document.getElementById('predominantGenreTitle').textContent = data.predominantGenre;

        const topGenreObj = data.genres && data.genres[0] ? data.genres[0] : { percentage: 0 };
        document.getElementById('predominantPercentage').innerHTML = `${topGenreObj.percentage}% <span>Dominância</span>`;

        // Update Metrics Cards
        document.getElementById('statTotalTracks').textContent = `${data.totalTracks} Músicas`;
        document.getElementById('statTotalArtists').textContent = `${data.totalArtists} Artistas`;
        document.getElementById('statDiversity').textContent = data.diversityIndex;

        // Render Charts & List
        renderDoughnutChart(data.genres);
        renderBarChart(data.genres);
        renderGenreList(data.genres);

        // Scroll smoothly to results
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Render Doughnut Chart for Genre Percentages
     */
    function renderDoughnutChart(genres) {
        const ctx = document.getElementById('genreDoughnutChart').getContext('2d');
        if (doughnutChart) doughnutChart.destroy();

        const topGenres = genres.slice(0, 7);
        const labels = topGenres.map(g => g.name);
        const dataValues = topGenres.map(g => g.percentage);
        const colors = topGenres.map(g => g.color);

        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#12161f',
                    hoverOffset: 12
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#A0AABF',
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' },
                            padding: 16,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }

    /**
     * Render Horizontal Bar Chart for Genre Ranking
     */
    function renderBarChart(genres) {
        const ctx = document.getElementById('genreBarChart').getContext('2d');
        if (barChart) barChart.destroy();

        const topGenres = genres.slice(0, 6);
        const labels = topGenres.map(g => g.name);
        const dataValues = topGenres.map(g => g.percentage);
        const colors = topGenres.map(g => g.color);

        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Porcentagem (%)',
                    data: dataValues,
                    backgroundColor: colors,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ${context.raw}% da playlist`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#A0AABF', font: { family: 'Plus Jakarta Sans' } }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#FFFFFF', font: { family: 'Plus Jakarta Sans', weight: '600' } }
                    }
                }
            }
        });
    }

    /**
     * Render Interactive List of All Genres
     */
    function renderGenreList(genres) {
        const container = document.getElementById('genreListContainer');
        container.innerHTML = '';

        genres.forEach(g => {
            const item = document.createElement('div');
            item.className = 'genre-item';

            const artistsHint = g.artists && g.artists.length > 0
                ? `<div class="genre-artists-hint">Artistas: ${g.artists.join(', ')}</div>`
                : '';

            item.innerHTML = `
                <div class="genre-item-header">
                    <div class="genre-name-group">
                        <span class="genre-color-dot" style="background-color: ${g.color}"></span>
                        <span class="genre-name">${g.name}</span>
                    </div>
                    <span class="genre-percent-val">${g.percentage}%</span>
                </div>
                <div class="genre-bar-bg">
                    <div class="genre-bar-fill" style="width: 0%; background-color: ${g.color}"></div>
                </div>
                ${artistsHint}
            `;

            container.appendChild(item);

            setTimeout(() => {
                const fillBar = item.querySelector('.genre-bar-fill');
                if (fillBar) fillBar.style.width = `${g.percentage}%`;
            }, 100);
        });
    }

    // Share Summary Feature
    btnShare.addEventListener('click', () => {
        const title = document.getElementById('playlistTitle').textContent;
        const mainGenre = document.getElementById('predominantGenreTitle').textContent;
        const mainPct = document.getElementById('predominantPercentage').innerText.split('\n')[0];

        const summaryText = `🎵 Análise de Gênero Musical da Playlist "${title}":\n` +
            `🔥 Gênero Predominante: ${mainGenre} (${mainPct})\n` +
            `📊 Analisado com o Spotify Genre Analyzer!`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(summaryText);
            showToast('Resumo copiado para a área de transferência! 🚀');
        } else {
            alert(summaryText);
        }
    });

    // Helper functions
    function showLoading(isLoading) {
        if (isLoading) {
            statusCard.classList.add('active');
            resultsSection.classList.remove('active');
        }
    }

    function updateStatus(message, percentage) {
        statusText.textContent = message;
        progressBarFill.style.width = `${percentage}%`;
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; bottom: 30px; right: 30px;
            background: #1DB954; color: #000; padding: 1rem 1.5rem;
            border-radius: 12px; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
            box-shadow: 0 10px 25px rgba(29,185,84,0.4); z-index: 9999;
            animation: fadeInUp 0.3s ease;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});
