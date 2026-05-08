export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({
        error: 'Faltan variables de entorno en Vercel'
      });
    }

    const cleanUrl = supabaseUrl.replace(/\/$/, '');
    const endpoint = `${cleanUrl}/rest/v1/resultados`;

    const { email, horas, dias, anos, dinero, rank, percentile } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email,
        horas,
        dias,
        anos,
        dinero,
        rank,
        percentile
      })
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(500).json({
        error: errorText,
        status: response.status
      });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
      cause: error.cause?.message || null
    });
  }
}
