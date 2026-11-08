const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay",
    "25": "Epic Games", "35": "CDKeys"
};

async function ejecutarBot() {
    console.log("🤖 Iniciando Bot Pro de Radar Juegos (Precios + Portadas)...");
    
    const { data: games, error } = await supabase.from('games').select('id, title, cover_image');
    if (error) return console.error("Error leyendo Supabase:", error);
    
    console.log(`🎮 Encontrados ${games.length} juegos. Sincronizando con la red...`);

    for (const game of games) {
        try {
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0`);
            const deals = await res.json();

            if (deals && deals.length > 0) {
                // Actualizamos precios
                await supabase.from('game_prices').delete().eq('game_id', game.id);
                
                let ofertasGuardadas = 0;
                for (const deal of deals.slice(0, 5)) {
                    const nombreTienda = tiendas[deal.storeID] || "Tienda Global";
                    await supabase.from('game_prices').insert({
                        game_id: game.id,
                        store_name: nombreTienda,
                        price: parseFloat(deal.salePrice),
                        currency: 'USD',
                        affiliate_url: `https://www.cheapshark.com/redirect?dealID=${deal.dealID}`
                    });
                    ofertasGuardadas++;
                }

                // Si la portada es un placeholder genérico, la actualizamos automáticamente con la imagen real de la API
                if (game.cover_image && (game.cover_image.includes('placeholder') || game.cover_image.includes('via.placeholder'))) {
                    const thumbReal = deals[0].thumb;
                    if (thumbReal) {
                        await supabase.from('games').update({ cover_image: thumbReal }).eq('id', game.id);
                        console.log(`🖼️ Portada real asignada para: ${game.title}`);
                    }
                }

                console.log(`✅ ${game.title}: ${ofertasGuardadas} ofertas actualizadas.`);
            } else {
                console.log(`⚠️ ${game.title}: Sin descuentos nuevos hoy.`);
            }
        } catch (err) {
            console.log(`❌ Error con ${game.title}:`, err.message);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("🎉 Sincronización completa del Bot.");
}

ejecutarBot();
