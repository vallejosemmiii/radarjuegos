const { createClient } = require('@supabase/supabase-js');

// Conexión a tu Supabase
const SUPABASE_URL = 'https://iqndiyuhcjxrugzfyjaj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxbmRpeXVoY2p4cnVnemZ5amFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwNjUyNzMsImV4cCI6MjEwOTY0MTI3M30.h-z1IcDbwAKvgVP1jwrjW8p-cxoTzuduIvLltjLDgqM';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Diccionario interno de la API para reconocer las tiendas
const tiendas = {
    "1": "Steam", "2": "GamersGate", "3": "GreenManGaming", "4": "Amazon",
    "7": "GOG", "8": "EA Origin", "11": "Humble Store", "13": "Uplay",
    "25": "Epic Games", "35": "CDKeys"
};

async function ejecutarBot() {
    console.log("🤖 Iniciando Bot de Radar Juegos...");
    
    // 1. Lee tu catálogo actual
    const { data: games, error } = await supabase.from('games').select('id, title');
    if (error) return console.error("Error leyendo Supabase:", error);
    
    console.log(`🎮 Encontrados ${games.length} juegos. Rastreando internet...`);

    for (const game of games) {
        try {
            // 2. Busca el juego en los rastreadores de CheapShark
            const res = await fetch(`https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(game.title)}&exact=0`);
            const deals = await res.json();

            if (deals && deals.length > 0) {
                // 3. Borra los precios de ayer
                await supabase.from('game_prices').delete().eq('game_id', game.id);
                
                let ofertasGuardadas = 0;
                // 4. Guarda las 4 mejores ofertas de hoy
                for (const deal of deals.slice(0, 4)) {
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
                console.log(`✅ ${game.title}: ${ofertasGuardadas} ofertas reales actualizadas.`);
            } else {
                console.log(`⚠️ ${game.title}: Sin descuentos encontrados hoy.`);
            }
        } catch (err) {
            console.log(`❌ Error con ${game.title}:`, err.message);
        }
        
        // Pausa de 1 segundo para no saturar los servidores
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log("🎉 Rastreo y actualización finalizada con éxito.");
}

ejecutarBot();
