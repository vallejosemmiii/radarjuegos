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

const formatearFecha = (timestamp) => timestamp ? new Date(timestamp * 1000).toISOString().split('T')[0] : null;
const crearSlug = (nombre) => nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function ejecutarBot() {
    console.log("🤖 Iniciando Bot de Extracción Masiva (1,000 Juegos)...");
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return console.error("❌ Error con Twitch Token.");

    const ahora = Math.floor(Date.now() / 1000); 

    // LÍMITE MÁXIMO DE IGDB: 500 juegos futuros
    const queryFuturos = `fields name, summary, first_release_date, platforms.name, cover.image_id, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name; where category = 0 & first_release_date > ${ahora}; sort first_release_date asc; limit 500;`;
    
    // LÍMITE MÁXIMO DE IGDB: 500 juegos del presente (bajamos el rating_count a 50 para abarcar mucho más catálogo)
    const queryLanzados = `fields name, summary, first_release_date, platforms.name, cover.image_id, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name; where category = 0 & first_release_date < ${ahora} & rating_count > 50; sort rating desc; limit 500;`;

    async function inyectarJuegos(query, tipo) {
        console.log(`\n🔍 Descargando el bloque de ${tipo}...`);
        const res = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST', headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${igdbToken}` }, body: query
        });
        const juegos = await res.json();

        let insertados = 0;
        for (const info of juegos) {
            const slugGenerado = crearSlug(info.name);
            const { data: existe } = await supabase.from('games').select('id').eq('slug', slugGenerado);
            
            if (existe && existe.length === 0) {
                const nuevoJuego = {
                    title: info.name, slug: slugGenerado,
                    summary: info.summary || 'Sin descripción disponible.',
                    release_date: formatearFecha(info.first_release_date),
                    platform: info.platforms ? info.platforms.map(p => p.name).join(', ') : 'PC',
                    cover_image: info.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_1080p/${info.cover.image_id}.jpg` : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
                    trailer_url: info.videos?.length > 0 ? `https://www.youtube.com/watch?v=${info.videos[0].video_id}` : null,
                    developer: info.involved_companies ? info.involved_companies.find(c => c.developer)?.company?.name : 'Desconocido',
                    publisher: info.involved_companies ? info.involved_companies.find(c => c.publisher)?.company?.name : 'Desconocido',
                    genres: info.genres ? info.genres.map(g => g.name).join(', ') : 'Varios'
                };
                await supabase.from('games').insert(nuevoJuego);
                insertados++;
                console.log(`➕ Inyectado: ${info.name}`);
            }
        }
        console.log(`✅ Operación terminada: ${insertados} juegos nuevos agregados a la base de datos.`);
    }

    await inyectarJuegos(queryFuturos, "500 PRÓXIMOS LANZAMIENTOS");
    await inyectarJuegos(queryLanzados, "500 JUEGOS DEL CATÁLOGO ACTUAL");

    console.log("\n💰 Escaneando ofertas para el catálogo masivo en CheapShark...");
    
    // Al ser 1,000 juegos, este proceso tardará unos 8-10 minutos en GitHub Actions
    const { data: gamesDB } = await supabase.from('games').select('id, title');
    
    let ofertasEncontradas = 0;
    for (const game of gamesDB) {
        try {
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0`);
            const deals = await res.json();
            if (deals && deals.length > 0) {
                await supabase.from('game_prices').delete().eq('game_id', game.id);
                for (const deal of deals.slice(0, 5)) {
                    await supabase.from('game_prices').insert({
                        game_id: game.id, store_name: tiendas[deal.storeID] || "Tienda Global",
                        price: parseFloat(deal.salePrice), currency: 'USD',
                        affiliate_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`
                    });
                }
                ofertasEncontradas++;
            }
        } catch (err) {}
        
        // Retardo de seguridad obligatorio para no bloquear la API de precios
        await new Promise(resolve => setTimeout(resolve, 500)); 
    }
    console.log(`🎉 Mega-Bot finalizado. Ofertas encontradas para ${ofertasEncontradas} juegos.`);
}

ejecutarBot();
