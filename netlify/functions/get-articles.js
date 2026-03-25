const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Agafem la categoria que ve de la URL del navegador
    const { cat } = event.queryStringParameters;
    
    // Aquestes dades les agafarà soles de la configuració de Netlify
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const TABLE_NAME = 'Articles';

    if (!cat) {
        return { statusCode: 400, body: JSON.stringify({ error: "Falta la categoria" }) };
    }

    // La teva fórmula de sempre, ben codificada per a la URL
    const filter = `AND(LOWER({Cat})=LOWER('${cat}'), {Web}=1)`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filter)}&sort[0][field]=id&sort[0][direction]=asc`;

    try {
        const response = await fetch(url, {
            headers: { 
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Permet que el teu JS el llegeixi sense problemes
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error de connexió amb Airtable" })
        };
    }
};