const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5NDA2NTI3MywiZXhwIjoyMTA5NjQxMjczfQ.xHAwV7WGn5CkmnjNq1Uz4d18TXJyl7_5p76wbk9fU1g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80';

const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA App", "11": "Humble Store", "13": "Ubisoft",
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

function detectarTiendaGratis(textoPlataforma, tituloOriginal) {
    const combinado = `${textoPlataforma || ''} ${tituloOriginal || ''}`.toLowerCase();
    if (combinado.includes('epic')) return 'Epic Games';
    if (combinado.includes('steam')) return 'Steam';
    if (combinado.includes('gog')) return 'GOG';
    if (combinado.includes('prime') || combinado.includes('amazon')) return 'Prime Gaming';
    if (combinado.includes('ubisoft') || combinado.includes('uplay')) return 'Ubisoft';
    if (combinado.includes('itch')) return 'Itch.io';
    if (combinado.includes('ea ') || combinado.includes('origin')) return 'EA App';
    if (combinado.includes('battle.net') || combinado.includes('blizzard')) return 'Battle.net';
    if (combinado.includes('indiegala')) return 'IndieGala';
    if (combinado.includes('humble')) return 'Humble Store';
    if (combinado.includes('playstation') || combinado.includes('ps4') || combinado.includes('ps5')) return 'PlayStation';
    if (combinado.includes('xbox')) return 'Xbox';
    return 'Tienda Oficial';
}

function limpiarTituloGratis(titulo) {
    return titulo
        .replace(/\(.*?\)/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\b(giveaway|free|gratis|key|keys|for pc|steam|epic games|gog)\b/gi, '')
        .replace(/^(epic games|steam|gog|prime gaming|ubisoft|itch\.io)\s*:\s*/i, '')
        .replace(/\s+/g, ' ')
        .trim();
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
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (e) {
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

function filtrarColumnasValidas(objeto, columnasTabla) {
    if (!columnasTabla || columnasTabla.size === 0) return objeto;
    const limpio = {};
    for (const [clave, valor] of Object.entries(objeto)) {
        if (columnasTabla.has(clave)) limpio[clave] = valor;
    }
    return limpio;
}

async function ejecutarBot() {
    console.log("🚀 Iniciando Mega-Bot v7.0 (IGDB + Steam ES + CheapShark + Radar Multi-Tienda Gratuitos)...");
    const igdbToken = await getIGDBToken();
    if (!igdbToken) return;

    const { data: existentes, error: errorLectura } = await supabase.from('games').select('*');
    if (errorLectura) {
        console.error("❌ Error leyendo Supabase:", errorLectura.message);
        return;
    }

    const mapaExistentes = new Map((existentes || []).map(j => [j.slug, j]));
    const columnasTabla = existentes && existentes.length > 0 ? new Set(Object.keys(existentes[0])) : new Set();

    const ahora = Math.floor(Date.now() / 1000);
    const unAnoSegundos = 31536000;
    const hoyISO = new Date().toISOString().split('T')[0];
    const campos = `name, summary, storyline, first_release_date, total_rating_count, platforms.name, cover.image_id, screenshots.image_id, videos.name, videos.video_id, involved_companies.company.name, involved_companies.developer, involved_companies.publisher, genres.name, game_modes.name, game_engines.name, themes.name`;

    // =========================================================================
    // FASE 1: DESCARGA MASIVA DESDE IGDB
    // =========================================================================
    async function descargarRadar(whereClause, sortClause, totalDeseado, etiqueta) {
        console.log(`\n📡 Radar: ${etiqueta} (Objetivo: ${totalDeseado})...`);
        let agregados = 0;

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

                const { data: insertado } = await supabase.from('games').insert(nuevoJuego).select().single();
                if (insertado) {
                    mapaExistentes.set(slug, insertado);
                    agregados++;
                }
            }
            await esperar(300);
        }
        console.log(`✅ ${etiqueta}: +${agregados} juegos nuevos.`);
    }

    await descargarRadar(
        `cover != null & first_release_date > ${ahora} & first_release_date <= ${ahora + unAnoSegundos}`,
        `first_release_date asc`,
        150,
        "CALENDARIO PRÓXIMOS 12 MESES"
    );

    await descargarRadar(
        `cover != null & first_release_date > ${ahora + unAnoSegundos}`,
        `first_release_date asc`,
        100,
        "PRÓXIMOS LANZAMIENTOS A FUTURO"
    );

    await descargarRadar(
        `cover != null & first_release_date <= ${ahora} & first_release_date >= ${ahora - unAnoSegundos} & total_rating_count > 10`,
        `total_rating_count desc`,
        150,
        "ÉXITOS RECIENTES"
    );

    await descargarRadar(
        `cover != null & first_release_date < ${ahora - unAnoSegundos} & total_rating_count > 50`,
        `total_rating_count desc`,
        300,
        "CATÁLOGO HISTÓRICO TOP"
    );

    // =========================================================================
    // FASE 2: REPARACIÓN DE FICHAS INCOMPLETAS
    // =========================================================================
    console.log("\n🛠️ Auditando y reparando fichas incompletas...");
    const { data: todosLosJuegos } = await supabase.from('games').select('*');
    const incompletos = (todosLosJuegos || []).filter(j =>
        !j.cover_image ||
        j.cover_image.includes('unsplash') ||
        !j.trailer_url ||
        !j.summary ||
        j.summary.startsWith('Sin descripción')
    );

    let reparados = 0;
    for (const juego of incompletos) {
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
                return normDeal === normGame || (normDeal.startsWith(normGame) && normDeal.length <= normGame.length + 18);
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

                const { error: priceErr } = await supabase.from('game_prices').insert(filasPrecios);
                if (!priceErr) ofertasActualizadas++;

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

    // =========================================================================
    // FASE 4: RADAR GLOBAL DE JUEGOS GRATUITOS DE TODAS LAS TIENDAS
    // (Epic Games Oficial + GamerPower Todas las Tiendas + CheapShark 100% Off)
    // =========================================================================
    console.log("\n🎁 Rastreando juegos gratuitos activos en todas las tiendas...");
    await supabase.from('game_prices').delete().eq('price', 0);

    const gratuitosRegistrados = new Set(); // Evita duplicados "gameId::tienda"
    let gratuitosActivos = 0;

    async function registrarJuegoGratuito({ titulo, tienda, url, imagenFallback, resumenFallback, plataformas }) {
        const tituloLimpio = limpiarTituloGratis(titulo);
        const slug = crearSlug(tituloLimpio);
        if (!slug) return;

        let juegoExistente = mapaExistentes.get(slug);
        let gameId = juegoExistente?.id;

        if (!gameId) {
            const candidatosIGDB = await consultarIGDB(
                igdbToken,
                `search "${tituloLimpio.replace(/"/g, '')}"; fields ${campos}; limit 1;`
            );
            const infoIGDB = candidatosIGDB[0];

            const nuevoGratis = filtrarColumnasValidas({
                title: infoIGDB?.name || tituloLimpio,
                slug,
                summary: resumenFallback || infoIGDB?.summary || 'Juego gratuito por tiempo limitado.',
                release_date: formatearFecha(infoIGDB?.first_release_date) || hoyISO,
                platform: plataformas || 'PC',
                cover_image: infoIGDB ? elegirMejorImagen(infoIGDB) : (imagenFallback || FALLBACK_IMG),
                trailer_url: infoIGDB ? elegirMejorTrailer(infoIGDB.videos) : null,
                developer: infoIGDB?.involved_companies?.find(c => c.developer)?.company?.name || 'Estudio Digital',
                publisher: infoIGDB?.involved_companies?.find(c => c.publisher)?.company?.name || tienda,
                genres: infoIGDB?.genres ? infoIGDB.genres.map(g => g.name).join(', ') : 'Gratuito'
            }, columnasTabla);

            const { data: creado } = await supabase.from('games').insert(nuevoGratis).select().single();
            if (creado) {
                mapaExistentes.set(slug, creado);
                gameId = creado.id;
            }
            await esperar(250);
        }

        if (!gameId) return;

        const llaveUnica = `${gameId}::${tienda.toLowerCase()}`;
        if (gratuitosRegistrados.has(llaveUnica)) return;

        const { error } = await supabase.from('game_prices').insert({
            game_id: gameId,
            store_name: tienda,
            price: 0,
            currency: 'USD',
            affiliate_url: url
        });

        if (!error) {
            gratuitosRegistrados.add(llaveUnica);
            gratuitosActivos++;
            console.log(`   🎁 [${tienda}] ${tituloLimpio}`);
        }
    }

    // FUENTE A: API Oficial de Epic Games Store (en español)
    try {
        const resEpic = await fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=es-ES&country=US&allowCountries=US');
        if (resEpic.ok) {
            const jsonEpic = await resEpic.json();
            const elementos = jsonEpic?.data?.Catalog?.searchStore?.elements || [];

            for (const el of elementos) {
                const promoActiva = el.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0];
                const precioFinal = el.price?.totalPrice?.discountPrice;
                if (!promoActiva || precioFinal !== 0) continue;

                const imgEpic = el.keyImages?.find(i =>
                    ['DieselStoreFrontWide', 'OfferImageWide', 'Thumbnail'].includes(i.type)
                )?.url;
                const slugEpic = el.catalogNs?.mappings?.[0]?.pageSlug || el.productSlug || el.urlSlug;
                const urlEpic = slugEpic
                    ? `https://store.epicgames.com/es-ES/p/${slugEpic}`
                    : 'https://store.epicgames.com/es-ES/free-games';

                await registrarJuegoGratuito({
                    titulo: el.title,
                    tienda: 'Epic Games',
                    url: urlEpic,
                    imagenFallback: imgEpic,
                    resumenFallback: el.description,
                    plataformas: 'PC (Epic Games Store)'
                });
            }
        }
    } catch (e) {}

    // FUENTE B: GamerPower (Steam, GOG, Prime Gaming, Epic, Ubisoft, Itch.io, IndieGala, PlayStation, Xbox)
    try {
        const resGP = await fetch('https://www.gamerpower.com/api/giveaways?type=game');
        if (resGP.ok) {
            const listaGP = await resGP.json();
            if (Array.isArray(listaGP)) {
                for (const item of listaGP) {
                    if (item.status && item.status !== 'Active') continue;
                    if (/\b(dlc|expansion|soundtrack|pack|beta|demo|in-game|loot|skin|cosmetic|trial)\b/i.test(item.title)) continue;

                    const tiendaDetectada = detectarTiendaGratis(item.platforms, item.title);
                    await registrarJuegoGratuito({
                        titulo: item.title,
                        tienda: tiendaDetectada,
                        url: item.open_giveaway_url || item.gamerpower_url,
                        imagenFallback: item.image || item.thumbnail,
                        resumenFallback: item.description,
                        plataformas: item.platforms || 'PC'
                    });
                }
            }
        }
    } catch (e) {}

    // FUENTE C: CheapShark 100% de descuento (Steam, GOG, Humble Store, Fanatical, GreenManGaming)
    try {
        const resCSFree = await fetch('https://www.cheapshark.com/api/1.0/deals?upperPrice=0&pageSize=60');
        if (resCSFree.ok) {
            const listaCS = await resCSFree.json();
            if (Array.isArray(listaCS)) {
                for (const deal of listaCS) {
                    if (parseFloat(deal.salePrice) !== 0) continue;
                    const tiendaCS = tiendas[deal.storeID] || 'Tienda Digital';
                    const imgCS = deal.steamAppID
                        ? `https://cdn.akamai.steamstatic.com/steam/apps/${deal.steamAppID}/library_600x900_2x.jpg`
                        : deal.thumb;

                    await registrarJuegoGratuito({
                        titulo: deal.title,
                        tienda: tiendaCS,
                        url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`,
                        imagenFallback: imgCS,
                        resumenFallback: null,
                        plataformas: 'PC'
                    });
                }
            }
        }
    } catch (e) {}

    console.log(`\n🎉 ¡Bot v7.0 completado! Ofertas en ${ofertasActualizadas} juegos | ${traduccionesSteam} fichas en español | ${gratuitosActivos} gratuitos activos.`);
}

ejecutarBot();
