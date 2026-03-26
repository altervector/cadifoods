const https = require('https');

exports.handler = async (event) => {
    const { sub } = event.queryStringParameters;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TOKEN = process.env.AIRTABLE_TOKEN;

    if (!sub) return { statusCode: 400, body: "Falta paràmetre sub" };

    // Fórmula exacta: busca el producte per nom dins de l'array TitolSub i que estigui marcat com a Web
    const formula = `AND(FIND("${sub.replace(/"/g, '\\"')}", ARRAYJOIN({TitolSub})) > 0, {Web}=1)`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/Articles?filterByFormula=${encodeURIComponent(formula)}&sort[0][field]=id&sort[0][direction]=asc`;

    return new Promise((resolve) => {
        const options = {
            headers: { 'Authorization': `Bearer ${TOKEN}` }
        };

        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: 200,
                    headers: { 
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*" 
                    },
                    body: data
                });
            });
        }).on('error', (e) => {
            resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
        });
    });
};
