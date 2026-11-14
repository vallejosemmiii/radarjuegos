const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDA2NTI3MywiZXhwIjoyMTA5NjQxMjczfQ.xHAwV7WGn5CkmnjNq1Uz4d18TXJyl7_5p76wbk9fU1g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay",
    "15": "Fanatical", "21": "WinGameStore", "23": "GameBillet",
    "25": "Epic Games", "27": "Gamesplanet", "35": "CDKeys"
};

const esperar = (ms) => new Promise(r => setTimeout(r, ms));
const formatearFecha = (ts) => ts ? new Date(ts * 1000).toISOString().split('T')[0] : null;
const crearSlug = (nombre) => nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
const normalizarTexto = (txt) => txt.toLowerCase().replace(/[^a-z0-9]/g, '');

function elegirMejorTrailer(videos) {
    if (!Array.isArray(videos) || videos.length === 0) return null;
    const prioridades = ['official trailer', 'launch trailer', 'announcement trailer', 'reveal trailer', 'trailer'];
    for (const palabra of prioridades) {
        const encontrado = videos.find(v => v.name && v.name.toLowerCase().includes(palabra));
        if (encontrado) return `https://www.youtube.com/watch?v=${encontrado.video_id}`;
    }
    return `https://www.youtube.com/watch?v=${videos[0].video_id}`;
}

function elegirMejorImagen(info) {
    if (info.cover?.image_id) {
        return `https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${info.cover.image_id}.jpg`;
    }
    if (info.screenshots?.length > 0 && info.screenshots[0].image_id) {
        return `https://images.igdb.com/igdb/image/upload/t_1080p/${info.screenshots[0].image_id}.jpg`;
    }
    return FALLBACK_IMG;
}

async function getIGDBToken() {
    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) {
        console.error("❌ Faltan TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET en GitHub Secrets.");
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
        console.error("❌ Error Twitch:", data);
        return null;
    }
    return data.access_token;
}

async function consultarIGDB(token, bodyQuery) {
    try {
        const res = await fetch('https://api.igdb.com/v4/games', {
            method: 'POST',
            headers: {
                'Client-ID': TWITCH_CLIENT_ID,
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: bodyQuery
        });
        if (!res.ok) {
            const errText = await res.text();
            console.error(`⚠️ Error IGDB (${res.status}): ${errText}`);
            return [];
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("⚠️ Error de red IGDB:", e.message);
        return [];
    }
}

async function enriquecerConSteam(steamAppID) {
    if (!steamAppID) return null;
    try {
        const res = await fetch(`https://store.steampowered.com/api/appdetails?appids=${steamAppID}&l=spanish`);
        if (!res.ok) return null;
        const json = await res.json();
        const info = json[steamAppID]?.data;
        if (!info) return null;

        const descripcionLimpia = info.short_description
            ? info.short_description.replace(/<[^>]*>?/gm, '').trim()
            : null;

        return {
            summaryEs: descripcionLimpia,
            coverSteam: `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/library_600x900_2x.jpg`
        };
    } catch (e) {
        return null;
    }
}

// Filtra el objeto para enviar solo columnas que existan realmente en tu tabla Supabase
function filtrarColumnasValidas(objeto, columnasTabla) {
    if (!columnasTabla || columnasTabla.size === 0) return objeto;
    const limpio = {};
    for (const [clave, valor] of Object.entries(objeto)) {
        if (columnasTabla.has(clave)) limpio[clave] = valor;
    }
    return limpio;
}

async function ejecutarBot() {
    console.log("🚀 Iniciando Mega-Bot v5.1 (IGDB + Steam ES + CheapShark)...");
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return;

    const { data: existentes, error: errorLectura } = await supabase.from('games').select('*');
    if (errorLectura) {
        console.error("❌ Error leyendo Supabase:", errorLectura.message);
        return;
    }

    console.log(`📦 Juegos actuales en base de datos: ${(existentes || []).length}`);
    const mapaExistentes = new Map((existentes || []).map(j => [j.slug, j]));
    const columnasTabla = existentes && existentes.length > 0 ? new Set(Object.keys(existentes[0])) : new Set();

    const ahora = Math.floor(Date.now() / 1000);
    const unAnoSegundos = 31536000;
    const campos = `name, summary, storyline, first_release_date, total_rating_count, platforms.name, cover.image_id, screenshots.image_id, videos.name, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name`;

    // =========================================================================
    // FASE 1: DESCARGA MASIVA DESDE IGDB
    // =========================================================================
    async function descargarRadar(whereClause, sortClause, totalDeseado, etiqueta) {
        console.log(`\n📡 Radar: ${etiqueta} (Objetivo: ${totalDeseado})...`);
        let agregados = 0;
        let primerErrorMostrado = false;

        for (let offset = 0; offset < totalDeseado; offset += 100) {
            const query = `fields ${campos}; where ${whereClause}; sort ${sortClause}; limit 100; offset ${offset};`;
            const lista = await consultarIGDB(igdbToken, query);
            if (lista.length === 0) break;

            for (const info of lista) {
                const slug = crearSlug(info.name);
                if (!slug || mapaExistentes.has(slug)) continue;

                const nuevoJuego = filtrarColumnasValidas({
                    title: info.name,
                    slug,
                    summary: info.summary || info.storyline || 'Sin descripción detallada disponible.',
                    release_date: formatearFecha(info.first_release_date),
                    platform: info.platforms ? info.platforms.map(p => p.name).join(', ') : 'PC / Multiplataforma',
                    cover_image: elegirMejorImagen(info),
                    trailer_url: elegirMejorTrailer(info.videos),
                    developer: info.involved_companies?.find(c => c.developer)?.company?.name || 'Estudio Independiente',
                    publisher: info.involved_companies?.find(c => c.publisher)?.company?.name || 'Editor Global',
                    genres: info.genres ? info.genres.map(g => g.name).join(', ') : 'Acción, Aventura',
                    game_modes: info.game_modes ? info.game_modes.map(m => m.name).join(', ') : 'Un jugador',
                    game_engine: info.game_engines ? info.game_engines.map(e => e.name).join(', ') : 'Propio',
                    themes: info.themes ? info.themes.map(t => t.name).join(', ') : 'Varios'
                }, columnasTabla);

                const { data: insertado, error: insertError } = await supabase.from('games').insert(nuevoJuego).select().single();
                if (insertError && !primerErrorMostrado) {
                    console.error(`⚠️ Error al guardar "${info.name}" en Supabase:`, insertError.message);
                    primerErrorMostrado = true;
                }
                if (insertado) {
                    mapaExistentes.set(slug, insertado);
                    agregados++;
                }
            }
            await esperar(300);
        }
        console.log(`✅ ${etiqueta}: +${agregados} juegos nuevos.`);
    }

    // 1. Próximos lanzamientos en los siguientes 12 meses
    await descargarRadar(
        `cover != null & first_release_date > ${ahora} & first_release_date <= ${ahora + unAnoSegundos}`,
        `first_release_date asc`,
        150,
        "CALENDARIO PRÓXIMOS 12 MESES"
    );

    // 2. Lanzamientos lejanos anunciados (más de 1 año)
    await descargarRadar(
        `cover != null & first_release_date > ${ahora + unAnoSegundos}`,
        `first_release_date asc`,
        100,
        "PRÓXIMOS LANZAMIENTOS A FUTURO"
    );

    // 3. Éxitos recientes (último año)
    await descargarRadar(
        `cover != null & first_release_date <= ${ahora} & first_release_date >= ${ahora - unAnoSegundos} & total_rating_count > 10`,
        `total_rating_count desc`,
        150,
        "ÉXITOS RECIENTES"
    );

    // 4. Clásicos y juegos populares de catálogo
    await descargarRadar(
        `cover != null & first_release_date < ${ahora - unAnoSegundos} & total_rating_count > 50`,
        `total_rating_count desc`,
        300,
        "CATÁLOGO HISTÓRICO TOP"
    );

    // =========================================================================
    // FASE 2: REPARACIÓN DE FICHAS INCOMPLETAS
    // =========================================================================
    console.log("\n🛠️ Auditando y reparando juegos sin carátula, tráiler o ficha...");
    const { data: incompletos } = await supabase
        .from('games')
        .select('*')
        .or(`cover_image.is.null,cover_image.eq.,cover_image.like.%unsplash%,trailer_url.is.null`);

    let reparados = 0;
    for (const juego of (incompletos || [])) {
        const cleanTitle = juego.title.replace(/"/g, '').trim();
        const candidatos = await consultarIGDB(
            igdbToken,
            `search "${cleanTitle}"; fields ${campos}; limit 5;`
        );

        if (candidatos.length > 0) {
            const normTarget = normalizarTexto(juego.title);
            candidatos.sort((a, b) => {
                const exactA = normalizarTexto(a.name) === normTarget ? 100000 : 0;
                const exactB = normalizarTexto(b.name) === normTarget ? 100000 : 0;
                return (exactB + (b.total_rating_count || 0)) - (exactA + (a.total_rating_count || 0));
            });

            const mejor = candidatos[0];
            const esGTAVI = juego.slug.includes('grand-theft-auto-vi') || juego.slug.includes('gta-vi');
            const tienePortadaValida = juego.cover_image && !juego.cover_image.includes('unsplash');

            const updateData = filtrarColumnasValidas({
                cover_image: tienePortadaValida ? juego.cover_image : elegirMejorImagen(mejor),
                trailer_url: juego.trailer_url || elegirMejorTrailer(mejor.videos),
                summary: (juego.summary && !juego.summary.startsWith('Sin descripción'))
                    ? juego.summary
                    : (mejor.summary || mejor.storyline || juego.summary),
                release_date: esGTAVI
                    ? (juego.release_date || '2026-11-19')
                    : (juego.release_date || formatearFecha(mejor.first_release_date)),
                developer: (juego.developer && juego.developer !== 'No especificado' && juego.developer !== 'Desconocido')
                    ? juego.developer
                    : (mejor.involved_companies?.find(c => c.developer)?.company?.name || 'Estudio Independiente'),
                publisher: (juego.publisher && juego.publisher !== 'No especificado' && juego.publisher !== 'Desconocido')
                    ? juego.publisher
                    : (mejor.involved_companies?.find(c => c.publisher)?.company?.name || 'Editor Global'),
                genres: (juego.genres && juego.genres !== 'No especificado')
                    ? juego.genres
                    : (mejor.genres ? mejor.genres.map(g => g.name).join(', ') : 'Acción, Aventura')
            }, columnasTabla);

            await supabase.from('games').update(updateData).eq('id', juego.id);
            reparados++;
        }
        await esperar(280);
    }
    console.log(`✅ Fichas reparadas: ${reparados}`);

    // =========================================================================
    // FASE 3: OFERTAS (CHEAPSHARK) + DESCRIPCIONES EN ESPAÑOL (STEAM)
    // =========================================================================
    console.log("\n💰 Rastreando precios reales y traduciendo descripciones al español...");
    const hoyISO = new Date().toISOString().split('T')[0];
    const { data: juegosLanzados } = await supabase
        .from('games')
        .select('id, title, slug, summary, cover_image')
        .lte('release_date', hoyISO);

    let ofertasActualizadas = 0;
    let traduccionesSteam = 0;

    for (const game of (juegosLanzados || [])) {
        try {
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0&pageSize=15`);
            if (!res.ok) continue;
            const deals = await res.json();
            if (!Array.isArray(deals) || deals.length === 0) continue;

            const normGame = normalizarTexto(game.title);
            const dealsValidos = deals.filter(d => {
                const normDeal = normalizarTexto(d.title);
                return normDeal === normGame || (normDeal.startsWith(normGame) && normDeal.length <= normGame.length + 12);
            });

            if (dealsValidos.length > 0) {
                dealsValidos.sort((a, b) => parseFloat(a.salePrice) - parseFloat(b.salePrice));
                const porTienda = new Map();
                for (const d of dealsValidos) {
                    if (!porTienda.has(d.storeID)) porTienda.set(d.storeID, d);
                }

                const mejoresOfertas = Array.from(porTienda.values()).slice(0, 5);
                await supabase.from('game_prices').delete().eq('game_id', game.id);

                const filasPrecios = mejoresOfertas.map(deal => ({
                    game_id: game.id,
                    store_name: tiendas[deal.storeID] || "Tienda Digital",
                    price: parseFloat(deal.salePrice),
                    currency: 'USD',
                    affiliate_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`
                }));
                await supabase.from('game_prices').insert(filasPrecios);
                ofertasActualizadas++;

                const steamId = mejoresOfertas.find(d => d.steamAppID)?.steamAppID;
                const necesitaPortada = !game.cover_image || game.cover_image.includes('unsplash');
                const necesitaEspanol = !game.summary || game.summary.startsWith('Sin descripción') || !/[áéíóúñ¿¡]/i.test(game.summary);

                if (steamId && (necesitaPortada || necesitaEspanol) && traduccionesSteam < 80) {
                    const datosSteam = await enriquecerConSteam(steamId);
                    if (datosSteam) {
                        const patch = {};
                        if (necesitaEspanol && datosSteam.summaryEs && datosSteam.summaryEs.length > 40) {
                            patch.summary = datosSteam.summaryEs;
                        }
                        if (necesitaPortada) {
                            patch.cover_image = datosSteam.coverSteam;
                        }
                        if (Object.keys(patch).length > 0) {
                            await supabase.from('games').update(patch).eq('id', game.id);
                            traduccionesSteam++;
                        }
                    }
                    await esperar(300);
                }
            }
        } catch (e) {}
        await esperar(220);
    }

    console.log(`🎉 ¡Bot v5.1 completado! Ofertas en ${ofertasActualizadas} juegos | ${traduccionesSteam} fichas enriquecidas en español.`);
}

ejecutarBot();
