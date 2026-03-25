// HEM TREM LA LÍNIA DEL REQUIRE node-fetch

exports.handler = async (event) => {
    const { cat } = event.queryStringParameters;
    const BASE_ID = process.env.AIRTABLE_BASE_ID;
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const TABLE_NAME = 'Articles';

    if (!cat) {
        return { statusCode: 400, body: JSON.stringify({ error: "Falta la categoria" }) };
    }

    const filter = `AND(LOWER({Cat})=LOWER('${cat}'), {Web}=1)`;
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}?filterByFormula=${encodeURIComponent(filter)}&sort[0][field]=id&sort[0][direction]=asc`;

    try {
        // Fem servir el fetch natiu de Node.js
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
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error de connexió" })
        };
    }
};