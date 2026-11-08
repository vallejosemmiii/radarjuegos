const { createClient } = require('@supabase/supabase-js');

// Credenciales
const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TWITCH_CLIENT_ID = 'b3u5wqtgayx1s0k8a331sadkv81euc';
const TWITCH_CLIENT_SECRET = 'v2hsvqi95bu9rq4nsj2bbktkclzx0a';

const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay",
    "25": "Epic Games", "35": "CDKeys"
};

async function getIGDBToken() {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
    const data = await res.json();
    return data.access_token;
}

async function ejecutarBot() {
    console.log("🤖 Iniciando Bot (Precios + Fichas + Tráilers Reales)...");
    
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return console.error("❌ Error obteniendo token de Twitch.");

    const { data: games, error } = await supabase.from('games').select('id, title, developer, trailer_url');
    if (error) return console.error("Error leyendo Supabase:", error);

    for (const game of games) {
        try {
            // Actualizamos ficha y tráiler en IGDB
            const query = `search "${game.title}"; fields involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name, videos.video_id; limit 1;`;
            const igdbRes = await fetch('https://api.igdb.com/v4/games', {
                method: 'POST',
                headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${igdbToken}` },
                body: query
            });
            const igdbData = await igdbRes.json();

            if (igdbData && igdbData.length > 0) {
                const info = igdbData[0];
                let updateData = {
                    developer: info.involved_companies ? info.involved_companies.find(c => c.developer)?.company?.name : 'Desconocido',
                    publisher: info.involved_companies ? info.involved_companies.find(c => c.publisher)?.company?.name : 'Desconocido',
                    genres: info.genres ? info.genres.map(g => g.name).join(', ') : 'No especificado',
                    game_modes: info.game_modes ? info.game_modes.map(m => m.name).join(', ') : 'Un jugador',
                    game_engine: info.game_engines ? info.game_engines.map(e => e.name).join(', ') : 'Propio',
                    themes: info.themes ? info.themes.map(t => t.name).join(', ') : 'No especificado'
                };
                
                // Si IGDB tiene un video oficial, guardamos el enlace real de YouTube
                if (info.videos && info.videos.length > 0) {
                    updateData.trailer_url = `https://www.youtube.com/watch?v=${info.videos[0].video_id}`;
                }

                await supabase.from('games').update(updateData).eq('id', game.id);
            }

            // Actualizar Precios
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0`);
            const deals = await res.json();

            if (deals && deals.length > 0) {
                await supabase.from('game_prices').delete().eq('game_id', game.id);
                for (const deal of deals.slice(0, 5)) {
                    await supabase.from('game_prices').insert({
                        game_id: game.id,
                        store_name: tiendas[deal.storeID] || "Tienda Global",
                        price: parseFloat(deal.salePrice),
                        currency: 'USD',
                        affiliate_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`
                    });
                }
            }
            console.log(`✅ Actualizado: ${game.title}`);
        } catch (err) {
            console.log(`❌ Error con ${game.title}:`, err.message);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log("🎉 Bot finalizado.");
}

ejecutarBot();
