const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDA2NTI3MywiZXhwIjoyMTA5NjQxMjczfQ.xHAwV7WGn5CkmnjNq1Uz4d18TXJyl7_5p76wbk9fU1g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay",
    "25": "Epic Games", "35": "CDKeys"
};

async function getIGDBToken() {
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        console.error("❌ Faltan TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET en los secretos de GitHub.");
        return null;
    }

    const params = new URLSearchParams({
        client_id: TWITCH_CLIENT_ID,
        client_secret: TWITCH_CLIENT_SECRET,
        grant_type: 'client_credentials'
    });

    const res = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });

    const data = await res.json();
    if (!data.access_token) {
        console.error("❌ Respuesta de Twitch:", data);
        return null;
    }
    return data.access_token;
}

const formatearFecha = (timestamp) => timestamp ? new Date(timestamp * 1000).toISOString().split('T')[0] : null;
const crearSlug = (nombre) => nombre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function ejecutarBot() {
    console.log("🚀 Iniciando Bot v4.0 (Recolección Masiva + Protección de Datos Manuales)...");
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return console.error("❌ No se pudo obtener el token de Twitch.");

    const { data: existentes } = await supabase.from('games').select('*');
    const mapaExistentes = new Map((existentes || []).map(j => [j.slug, j]));

    const ahora = Math.floor(Date.now() / 1000);
    const campos = `name, summary, storyline, first_release_date, platforms.name, cover.image_id, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name`;

    async function descargarLote(whereClause, sortClause, totalDeseado, etiqueta) {
        console.log(`\n🔍 Descargando hasta ${totalDeseado} juegos de: ${etiqueta}...`);
        let agregados = 0;
        let actualizados = 0;

        for (let offset = 0; offset < totalDeseado; offset += 100) {
            const query = `fields ${campos}; where ${whereClause}; sort ${sortClause}; limit 100; offset ${offset};`;
            const res = await fetch('https://api.igdb.com/v4/games', {
                method: 'POST',
                headers: { 'Client-ID': TWITCH_CLIENT_ID, 'Authorization': `Bearer ${igdbToken}` },
                body: query
            });
            const lista = await res.json();
            if (!Array.isArray(lista) || lista.length === 0) break;

            for (const info of lista) {
                const slugGenerado = crearSlug(info.name);
                if (!slugGenerado) continue;

                const previo = mapaExistentes.get(slugGenerado);
                const descripcionIGDB = info.summary || info.storyline || 'Sin descripción detallada disponible en este momento.';
                const trailerIGDB = info.videos?.length > 0 ? `https://www.youtube.com/watch?v=${info.videos[0].video_id}` : null;
                const portadaIGDB = info.cover?.image_id ? `https://images.igdb.com/igdb/image/upload/t_1080p/${info.cover.image_id}.jpg` : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

                if (previo) {
                    const datosActualizar = {
                        release_date: formatearFecha(info.first_release_date) || previo.release_date,
                        trailer_url: previo.trailer_url || trailerIGDB,
                        summary: (previo.summary && !previo.summary.startsWith('Sin descripción')) ? previo.summary : descripcionIGDB,
                        cover_image: (previo.cover_image && !previo.cover_image.includes('unsplash')) ? previo.cover_image : portadaIGDB,
                        game_engine: previo.game_engine && previo.game_engine !== 'No especificado' ? previo.game_engine : (info.game_engines ? info.game_engines.map(e => e.name).join(', ') : 'Propio'),
                        themes: previo.themes && previo.themes !== 'No especificado' ? previo.themes : (info.themes ? info.themes.map(t => t.name).join(', ') : 'Varios')
                    };
                    await supabase.from('games').update(datosActualizar).eq('id', previo.id);
                    actualizados++;
                } else {
                    const nuevoJuego = {
                        title: info.name,
                        slug: slugGenerado,
                        summary: descripcionIGDB,
                        release_date: formatearFecha(info.first_release_date),
                        platform: info.platforms ? info.platforms.map(p => p.name).join(', ') : 'PC / Multiplataforma',
                        cover_image: portadaIGDB,
                        trailer_url: trailerIGDB,
                        developer: info.involved_companies ? info.involved_companies.find(c => c.developer)?.company?.name : 'Estudio Independiente',
                        publisher: info.involved_companies ? info.involved_companies.find(c => c.publisher)?.company?.name : 'Editor Global',
                        genres: info.genres ? info.genres.map(g => g.name).join(', ') : 'Acción, Aventura',
                        game_modes: info.game_modes ? info.game_modes.map(m => m.name).join(', ') : 'Un jugador',
                        game_engine: info.game_engines ? info.game_engines.map(e => e.name).join(', ') : 'Propio',
                        themes: info.themes ? info.themes.map(t => t.name).join(', ') : 'Varios'
                    };
                    const { data: insertado } = await supabase.from('games').insert(nuevoJuego).select().single();
                    if (insertado) {
                        mapaExistentes.set(slugGenerado, insertado);
                        agregados++;
                    }
                }
            }
            await new Promise(r => setTimeout(r, 350));
        }
        console.log(`✅ ${etiqueta}: ${agregados} nuevos agregados | ${actualizados} actualizados.`);
    }

    await descargarLote(
        `cover != null & first_release_date > ${ahora} & hypes >= 2`,
        `first_release_date asc`,
        100,
        "PRÓXIMOS LANZAMIENTOS ESPERADOS"
    );

    await descargarLote(
        `cover != null & first_release_date <= ${ahora} & total_rating_count > 30`,
        `total_rating_count desc`,
        300,
        "CATÁLOGO HISTÓRICO Y OFERTAS"
    );

    console.log("\n💰 Buscando mejores precios en tiendas digitales (CheapShark)...");
    const hoyISO = new Date().toISOString().split('T')[0];
    const { data: juegosLanzados } = await supabase
        .from('games')
        .select('id, title')
        .lte('release_date', hoyISO);

    let ofertasEncontradas = 0;
    for (const game of (juegosLanzados || [])) {
        try {
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0`);
            if (res.ok) {
                const deals = await res.json();
                if (Array.isArray(deals) && deals.length > 0) {
                    await supabase.from('game_prices').delete().eq('game_id', game.id);
                    const filasPrecios = deals.slice(0, 4).map(deal => ({
                        game_id: game.id,
                        store_name: tiendas[deal.storeID] || "Tienda Global",
                        price: parseFloat(deal.salePrice),
                        currency: 'USD',
                        affiliate_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`
                    }));
                    await supabase.from('game_prices').insert(filasPrecios);
                    ofertasEncontradas++;
                }
            }
        } catch (e) {}
        await new Promise(r => setTimeout(r, 250));
    }

    console.log(`🎉 ¡Proceso terminado! Precios actualizados en ${ofertasEncontradas} juegos.`);
}

ejecutarBot();
