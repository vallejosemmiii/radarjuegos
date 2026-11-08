const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDA2NTI3MywiZXhwIjoyMTA5NjQxMjczfQ.xHAwV7WGn5CkmnjNq1Uz4d18TXJyl7_5p76wbk9fU1g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TWITCH_CLIENT_ID = 'b3u5wqtgayx1s0k8a331sadkv81euc';
const TWITCH_CLIENT_SECRET = 'v2hsvqi95bu9rq4nsj2bbktkclzx0a';

const tiendas = { "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon", "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay", "25": "Epic Games", "35": "CDKeys" };

async function getIGDBToken() {
    const res = await fetch(`https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`, { method: 'POST' });
    const data = await res.json();
    return data.access_token;
}

// Convertir fecha de IGDB (Unix timestamp) a YYYY-MM-DD
const formatearFecha = (timestamp) => {
    if (!timestamp) return null;
    return new Date(timestamp * 1000).toISOString().split('T')[0];
};

// Crear Slug amigable para la URL
const crearSlug = (nombre) => nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function ejecutarBot() {
    console.log("🤖 Iniciando Mega-Bot: Ampliación de Catálogo + Descripciones + AdSense...");
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return console.error("❌ Error con Twitch Token.");

    // ====================================================================
    // PASO 1: DESCUBRIR E INYECTAR 100 JUEGOS NUEVOS (AMPLIAR CATÁLOGO)
    // ====================================================================
    console.log("🔍 Buscando 100 juegos populares en IGDB para expandir catálogo...");
    const queryNuevos = `fields name, summary, first_release_date, platforms.name, cover.image_id, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name; where category = 0 & rating_count > 100; sort rating desc; limit 100;`;
    
    const resNuevos = await fetch('https://api.igdb.com/v4/games', {
        method: 'POST',
        headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${igdbToken}` },
        body: queryNuevos
    });
    const juegosNuevos = await resNuevos.json();

    for (const info of juegosNuevos) {
        const slugGenerado = crearSlug(info.name);
        
        // Verificar si el juego ya existe en la base de datos
        const { data: existe } = await supabase.from('games').select('id').eq('slug', slugGenerado);
        
        if (existe && existe.length === 0) {
            // El juego NO existe, lo insertamos completo
            const nuevoJuego = {
                title: info.name,
                slug: slugGenerado,
                summary: info.summary || 'Sin descripción disponible.',
                release_date: formatearFecha(info.first_release_date),
                platform: info.platforms ? info.platforms.map(p => p.name).join(', ') : 'PC',
                cover_image: info.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_1080p/${info.cover.image_id}.jpg` : 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=340&fit=crop',
                trailer_url: info.videos?.length > 0 ? `https://www.youtube.com/watch?v=${info.videos[0].video_id}` : null,
                developer: info.involved_companies ? info.involved_companies.find(c => c.developer)?.company?.name : 'Desconocido',
                publisher: info.involved_companies ? info.involved_companies.find(c => c.publisher)?.company?.name : 'Desconocido',
                genres: info.genres ? info.genres.map(g => g.name).join(', ') : 'Varios',
                game_modes: info.game_modes ? info.game_modes.map(m => m.name).join(', ') : 'Un jugador',
                game_engine: info.game_engines ? info.game_engines.map(e => e.name).join(', ') : 'Propio',
                themes: info.themes ? info.themes.map(t => t.name).join(', ') : 'Varios'
            };
            await supabase.from('games').insert(nuevoJuego);
            console.log(`➕ Nuevo juego agregado al catálogo: ${info.name}`);
        }
    }

    // ====================================================================
    // PASO 2: ACTUALIZAR PRECIOS Y OFERTAS PARA TODO EL CATÁLOGO
    // ====================================================================
    console.log("💰 Actualizando ofertas y precios de todos los juegos...");
    const { data: gamesDB } = await supabase.from('games').select('id, title');
    
    for (const game of gamesDB) {
        try {
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
        } catch (err) {
            console.log(`❌ Error actualizando ofertas de ${game.title}`);
        }
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log("🎉 Mega-Bot finalizado. Catálogo expandido y optimizado para AdSense.");
}

ejecutarBot();
