export default async function handler(req, res) {

  try {

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/resultados?select=id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`
        }
      }
    );

    const data = await response.json();

    return res.status(200).json({
      total: data.length
    });

  } catch(error){

    return res.status(500).json({
      error: error.message
    });
  }
}