/**
 * Spotify API Handler for Genre Analyzer
 */
const SpotifyAPI = {
    // Standard Palette of Vibrant Neon & Glass Colors for Charts
    COLOR_PALETTE: [
        '#1DB954', '#00E5FF', '#FF4081', '#FFB300', '#7C4DFF', 
        '#00E676', '#FF6D00', '#E91E63', '#00B0FF', '#AB47BC',
        '#651FFF', '#D500F9', '#FF3D00', '#00BCD4', '#8D6E63'
    ],

    /**
     * Extracts playlist ID from various Spotify URL formats or raw ID string.
     */
    extractPlaylistId(input) {
        if (!input) return null;
        const trimmed = input.trim();

        // Pattern 1: https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M?si=...
        const urlMatch = trimmed.match(/playlist\/([a-zA-Z0-9]{22})/);
        if (urlMatch && urlMatch[1]) return urlMatch[1];

        // Pattern 2: spotify:playlist:37i9dQZF1DXcBWIGoYBM5M
        const uriMatch = trimmed.match(/spotify:playlist:([a-zA-Z0-9]{22})/);
        if (uriMatch && uriMatch[1]) return uriMatch[1];

        // Pattern 3: Direct 22-character Alphanumeric ID
        if (/^[a-zA-Z0-9]{22}$/.test(trimmed)) {
            return trimmed;
        }

        return null;
    },

    /**
     * Retrieves Spotify Access Token using Client Credentials Flow.
     */
    async getAccessToken(clientId, clientSecret) {
        if (!clientId || !clientSecret) {
            throw new Error('Client ID e Client Secret são necessários para conectar à API do Spotify.');
        }

        const credentials = btoa(`${clientId.trim()}:${clientSecret.trim()}`);
        
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                body: 'grant_type=client_credentials'
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error_description || 'Falha na autenticação com a API do Spotify. Verifique suas credenciais.');
            }

            const data = await response.json();
            return data.access_token;
        } catch (err) {
            console.error('Spotify Auth Error:', err);
            throw new Error(err.message || 'Erro ao conectar à API do Spotify.');
        }
    },

    /**
     * Fetches complete playlist data including tracks and artist genres.
     */
    async fetchPlaylistAnalysis(playlistId, accessToken, onProgress = () => {}) {
        onProgress('Carregando informações da playlist...', 10);

        // 1. Fetch Playlist Basic Info
        const playlistRes = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!playlistRes.ok) {
            if (playlistRes.status === 404) {
                throw new Error('Playlist não encontrada. Verifique se o link está correto e se a playlist é pública.');
            }
            throw new Error(`Erro ao buscar playlist (Status ${playlistRes.status}).`);
        }

        const playlistData = await playlistRes.json();
        onProgress(`Playlist encontrada: "${playlistData.name}". Carregando faixas...`, 30);

        // 2. Fetch All Tracks (Handling Pagination)
        let tracks = [];
        let nextUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100`;

        while (nextUrl && tracks.length < 500) { // Limit to 500 tracks for speed
            const tracksRes = await fetch(nextUrl, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (!tracksRes.ok) break;

            const tracksData = await tracksRes.json();
            const validItems = (tracksData.items || []).filter(item => item && item.track);
            tracks = tracks.concat(validItems.map(item => item.track));

            nextUrl = tracksData.next;
            const progress = Math.min(70, 30 + Math.floor((tracks.length / (playlistData.tracks.total || 100)) * 40));
            onProgress(`Analisando ${tracks.length} músicas...`, progress);
        }

        if (tracks.length === 0) {
            throw new Error('Esta playlist não possui faixas válidas para análise.');
        }

        // 3. Extract Unique Artists
        const artistMap = new Map(); // artistId -> name
        const artistTrackCount = new Map(); // artistId -> number of appearances

        tracks.forEach(track => {
            if (track.artists && Array.isArray(track.artists)) {
                track.artists.forEach(artist => {
                    if (artist.id) {
                        artistMap.set(artist.id, artist.name);
                        artistTrackCount.set(artist.id, (artistTrackCount.get(artist.id) || 0) + 1);
                    }
                });
            }
        });

        onProgress(`Buscando gêneros de ${artistMap.size} artistas...`, 75);

        // 4. Batch Fetch Artists Details (Max 50 IDs per Spotify endpoint request)
        const artistIds = Array.from(artistMap.keys());
        const artistGenresMap = new Map(); // artistId -> Array of genres

        for (let i = 0; i < artistIds.length; i += 50) {
            const batch = artistIds.slice(i, i + 50);
            const artistsRes = await fetch(`https://api.spotify.com/v1/artists?ids=${batch.join(',')}`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (artistsRes.ok) {
                const artistsData = await artistsRes.json();
                (artistsData.artists || []).forEach(artist => {
                    if (artist && artist.genres) {
                        artistGenresMap.set(artist.id, artist.genres);
                    }
                });
            }
        }

        onProgress('Calculando distribuição de gêneros...', 90);

        // 5. Aggregate Genre Frequencies weighted by track appearance
        const genreCounts = {};
        const genreArtists = {}; // genre -> Set of artist names
        let totalGenreOccurrences = 0;

        artistMap.forEach((artistName, artistId) => {
            const genres = artistGenresMap.get(artistId) || [];
            const weight = artistTrackCount.get(artistId) || 1;

            if (genres.length === 0) {
                // Fallback for artists with no explicit genre tag
                const fallbackGenre = 'Outros / Não Classificado';
                genreCounts[fallbackGenre] = (genreCounts[fallbackGenre] || 0) + weight;
                if (!genreArtists[fallbackGenre]) genreArtists[fallbackGenre] = new Set();
                genreArtists[fallbackGenre].add(artistName);
                totalGenreOccurrences += weight;
            } else {
                genres.forEach(rawGenre => {
                    const formattedGenre = this.capitalizeGenre(rawGenre);
                    genreCounts[formattedGenre] = (genreCounts[formattedGenre] || 0) + weight;
                    if (!genreArtists[formattedGenre]) genreArtists[formattedGenre] = new Set();
                    genreArtists[formattedGenre].add(artistName);
                    totalGenreOccurrences += weight;
                });
            }
        });

        // 6. Calculate Percentages & Format Result
        const sortedGenres = Object.keys(genreCounts)
            .map(genreName => ({
                name: genreName,
                count: genreCounts[genreName],
                percentage: parseFloat(((genreCounts[genreName] / totalGenreOccurrences) * 100).toFixed(1)),
                artists: Array.from(genreArtists[genreName] || []).slice(0, 5)
            }))
            .sort((a, b) => b.count - a.count);

        // Assign colors
        sortedGenres.forEach((g, idx) => {
            g.color = this.COLOR_PALETTE[idx % this.COLOR_PALETTE.length];
        });

        const predominant = sortedGenres[0] ? sortedGenres[0].name : 'Desconhecido';
        const topArtistsList = Array.from(artistMap.values())
            .sort((a, b) => (artistTrackCount.get(b) || 0) - (artistTrackCount.get(a) || 0))
            .slice(0, 5);

        // Calculate Diversity Score
        const numGenres = sortedGenres.length;
        let diversityText = 'Concentrado';
        if (numGenres > 15) diversityText = 'Extremamente Variado (95/100)';
        else if (numGenres > 10) diversityText = 'Alto (85/100)';
        else if (numGenres > 5) diversityText = 'Médio (70/100)';
        else diversityText = 'Focado (50/100)';

        onProgress('Análise concluída!', 100);

        return {
            id: playlistData.id,
            name: playlistData.name,
            owner: playlistData.owner ? playlistData.owner.display_name : 'Spotify',
            image: playlistData.images && playlistData.images[0] ? playlistData.images[0].url : null,
            totalTracks: tracks.length,
            totalArtists: artistMap.size,
            predominantGenre: predominant,
            diversityIndex: diversityText,
            genres: sortedGenres,
            topArtists: topArtistsList
        };
    },

    /**
     * Capitalizes genre titles for elegant UI presentation.
     */
    capitalizeGenre(str) {
        if (!str) return '';
        return str
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
};
