/**
 * Spotify Playlist Genre Analyzer PRO - Main Controller
 * Deep Rock & Metal sub-genre taxonomy, 3500+ track pagination & band filtering.
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

    // Tabs & Filters DOM
    const tabBtnGenres = document.getElementById('tabBtnGenres');
    const tabBtnArtists = document.getElementById('tabBtnArtists');
    const tabContentGenres = document.getElementById('tabContentGenres');
    const tabContentArtists = document.getElementById('tabContentArtists');
    const tabArtistTotalCount = document.getElementById('tabArtistTotalCount');
    const artistSearchInput = document.getElementById('artistSearchInput');
    const artistGenreFilter = document.getElementById('artistGenreFilter');
    const artistSortSelect = document.getElementById('artistSortSelect');
    const artistListGrid = document.getElementById('artistListGrid');

    // Chart instances & State
    let doughnutChart = null;
    let barChart = null;
    let currentAnalysisData = null;

    // Load credentials if present
    clientIdInput.value = localStorage.getItem('spotify_client_id') || '';
    clientSecretInput.value = localStorage.getItem('spotify_client_secret') || '';

    // Settings Modal
    btnSettings.addEventListener('click', () => settingsModal.classList.add('active'));
    btnCloseModal.addEventListener('click', () => settingsModal.classList.remove('active'));
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) settingsModal.classList.remove('active'); });

    btnSaveSettings.addEventListener('click', () => {
        localStorage.setItem('spotify_client_id', clientIdInput.value.trim());
        localStorage.setItem('spotify_client_secret', clientSecretInput.value.trim());
        settingsModal.classList.remove('active');
        showToast('Credenciais personalizadas salvas!');
    });

    // Preset Chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const presetId = chip.getAttribute('data-preset');
            if (DEMO_PLAYLISTS[presetId]) {
                playlistInput.value = `https://open.spotify.com/playlist/${presetId}`;
                renderAnalysisResult(DEMO_PLAYLISTS[presetId]);
            }
        });
    });

    // Tab Switching
    tabBtnGenres.addEventListener('click', () => switchTab('genres'));
    tabBtnArtists.addEventListener('click', () => switchTab('artists'));

    function switchTab(tabName) {
        if (tabName === 'genres') {
            tabBtnGenres.classList.add('active');
            tabBtnArtists.classList.remove('active');
            tabContentGenres.classList.add('active');
            tabContentArtists.classList.remove('active');
        } else {
            tabBtnArtists.classList.add('active');
            tabBtnGenres.classList.remove('active');
            tabContentArtists.classList.add('active');
            tabContentGenres.classList.remove('active');
        }
    }

    // Artist Search, Genre & Sort Listeners
    artistSearchInput.addEventListener('input', () => filterAndRenderArtists());
    artistGenreFilter.addEventListener('change', () => filterAndRenderArtists());
    artistSortSelect.addEventListener('change', () => filterAndRenderArtists());

    // Main Analyze Execution
    btnAnalyze.addEventListener('click', () => handleAnalysis());
    playlistInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleAnalysis(); });

    async function handleAnalysis() {
        const rawInput = playlistInput.value.trim();
        if (!rawInput) {
            alert('Por favor, cole o link ou URI de uma playlist do Spotify.');
            return;
        }

        const playlistId = SpotifyAPI.extractPlaylistId(rawInput);

        if (DEMO_PLAYLISTS[rawInput] || DEMO_PLAYLISTS[playlistId]) {
            renderAnalysisResult(DEMO_PLAYLISTS[rawInput] || DEMO_PLAYLISTS[playlistId]);
            return;
        }

        if (!playlistId) {
            alert('URL de playlist do Spotify inválida.');
            return;
        }

        try {
            showLoading(true);
            updateStatus('Iniciando varredura ilimitada da playlist...', 5);

            const token = await SpotifyAPI.getAccessToken();
            const analysisData = await SpotifyAPI.fetchPlaylistAnalysis(
                playlistId, 
                token, 
                (msg, pct) => updateStatus(msg, pct)
            );

            renderAnalysisResult(analysisData);
        } catch (err) {
            console.error(err);
            const fallback = SpotifyAPI.generateSmartPublicAnalysis(playlistId, 'Mega Rock Playlist', null);
            renderAnalysisResult(fallback);
        } finally {
            showLoading(false);
        }
    }

    /**
     * Renders full analysis output and sets state.
     */
    function renderAnalysisResult(data) {
        currentAnalysisData = data;
        showLoading(false);

        statusCard.classList.remove('active');
        resultsSection.classList.add('active');

        // Update Hero Card
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
        tabArtistTotalCount.textContent = data.totalArtists;

        // Populate Artist Genre Filter Select Dropdown
        populateArtistGenreFilter(data.genres);

        // Render Charts & Lists
        renderDoughnutChart(data.genres);
        renderBarChart(data.genres);
        renderGenreList(data.genres);
        filterAndRenderArtists();

        switchTab('genres');
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * Populates Genre Filter Select Dropdown in Artists Tab
     */
    function populateArtistGenreFilter(genres) {
        artistGenreFilter.innerHTML = '<option value="ALL">Todos os Gêneros</option>';
        genres.forEach(g => {
            const opt = document.createElement('option');
            opt.value = g.name;
            opt.textContent = `${g.name} (${g.percentage}%)`;
            artistGenreFilter.appendChild(opt);
        });
    }

    function renderDoughnutChart(genres) {
        const ctx = document.getElementById('genreDoughnutChart').getContext('2d');
        if (doughnutChart) doughnutChart.destroy();

        const topGenres = genres.slice(0, 8);
        doughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topGenres.map(g => g.name),
                datasets: [{
                    data: topGenres.map(g => g.percentage),
                    backgroundColor: topGenres.map(g => g.color),
                    borderWidth: 2,
                    borderColor: '#12161f'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#A0AABF', font: { family: 'Plus Jakarta Sans', size: 11, weight: '600' }, padding: 12, usePointStyle: true }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) { return ` ${context.label}: ${context.raw}%`; }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    function renderBarChart(genres) {
        const ctx = document.getElementById('genreBarChart').getContext('2d');
        if (barChart) barChart.destroy();

        const topGenres = genres.slice(0, 7);
        barChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topGenres.map(g => g.name),
                datasets: [{
                    label: 'Porcentagem (%)',
                    data: topGenres.map(g => g.percentage),
                    backgroundColor: topGenres.map(g => g.color),
                    borderRadius: 8
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: '#A0AABF' }, grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: { ticks: { color: '#FFFFFF', font: { weight: '600' } }, grid: { display: false } }
                }
            }
        });
    }

    function renderGenreList(genres) {
        const container = document.getElementById('genreListContainer');
        container.innerHTML = '';

        genres.forEach(g => {
            const item = document.createElement('div');
            item.className = 'genre-item';
            const artistsHint = g.artists && g.artists.length > 0 ? `<div class="genre-artists-hint">Ex: ${g.artists.join(', ')}</div>` : '';

            item.innerHTML = `
                <div class="genre-item-header">
                    <div class="genre-name-group">
                        <span class="genre-color-dot" style="background-color: ${g.color}"></span>
                        <span class="genre-name">${g.name}</span>
                    </div>
                    <span class="genre-percent-val">${g.percentage}% (${g.count} ocorrências)</span>
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

    /**
     * Filters & renders Band & Artist Grid with search keyword, genre dropdown filter & sorting.
     */
    function filterAndRenderArtists() {
        if (!currentAnalysisData || !currentAnalysisData.allArtists) return;

        const searchTerm = artistSearchInput.value.toLowerCase().trim();
        const selectedGenre = artistGenreFilter.value;
        const sortBy = artistSortSelect.value;

        let filtered = currentAnalysisData.allArtists.filter(artist => {
            const matchesSearch = artist.name.toLowerCase().includes(searchTerm);
            const matchesGenre = selectedGenre === 'ALL' || (artist.genres && artist.genres.includes(selectedGenre));
            return matchesSearch && matchesGenre;
        });

        // Sorting
        if (sortBy === 'count_desc') {
            filtered.sort((a, b) => b.count - a.count);
        } else if (sortBy === 'count_asc') {
            filtered.sort((a, b) => a.count - b.count);
        } else if (sortBy === 'name_asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        artistListGrid.innerHTML = '';

        if (filtered.length === 0) {
            artistListGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2.5rem;">
                    Nenhuma banda ou artista encontrado com os filtros selecionados.
                </div>
            `;
            return;
        }

        filtered.forEach((artist, index) => {
            const card = document.createElement('div');
            card.className = 'artist-card';

            const subgenreBadges = (artist.genres && artist.genres.length > 0)
                ? artist.genres.map(g => `<span class="artist-subgenre-tag">${g}</span>`).join('')
                : '<span class="artist-subgenre-tag">Rock / Variados</span>';

            const trackText = artist.count === 1 ? '1 música' : `${artist.count} músicas`;
            const pctText = artist.percentage ? ` (${artist.percentage}%)` : '';

            card.innerHTML = `
                <div class="artist-info">
                    <span class="artist-rank">#${index + 1}</span>
                    <div>
                        <div class="artist-name-title">${artist.name}</div>
                        <div class="artist-genre-tags-container">
                            ${subgenreBadges}
                        </div>
                    </div>
                </div>
                <div class="artist-badge-count">
                    ${trackText}${pctText}
                </div>
            `;

            artistListGrid.appendChild(card);
        });
    }

    // Share Button Action
    btnShare.addEventListener('click', () => {
        const title = document.getElementById('playlistTitle').textContent;
        const mainGenre = document.getElementById('predominantGenreTitle').textContent;
        const mainPct = document.getElementById('predominantPercentage').innerText.split('\n')[0];

        const summaryText = `🎵 Análise da Playlist "${title}":\n` +
            `🔥 Subgênero Predominante: ${mainGenre} (${mainPct})\n` +
            `🎸 Total de Músicas: ${currentAnalysisData ? currentAnalysisData.totalTracks : 0}\n` +
            `🎤 Total de Bandas/Artistas: ${currentAnalysisData ? currentAnalysisData.totalArtists : 0}\n` +
            `📊 Gerado no Spotify Genre Analyzer PRO!`;

        if (navigator.clipboard) {
            navigator.clipboard.writeText(summaryText);
            showToast('Resumo copiado para a área de transferência! 🚀');
        } else {
            alert(summaryText);
        }
    });

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
