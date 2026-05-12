export default async function handler(req, res) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Faltan variables de entorno'
      });
    }

    const response = await fetch(
      `${supabaseUrl.replace(/\/$/, '')}/rest/v1/resultados?select=dinero`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return res.status(500).json({ error });
    }

    const data = await response.json();

    const total = data.length;

    const sumaDinero = data.reduce((acc, item) => {
      return acc + Number(item.dinero || 0);
    }, 0);

    const promedioDinero = total > 0
      ? Math.round(sumaDinero / total)
      : 0;

    return res.status(200).json({
      total,
      sharesEstimados: Math.floor(total * 0.62),
      promedioDinero
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}