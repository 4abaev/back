const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();
const cors = require('cors');
app.use(cors());

app.get('/get-assets', async (req, res) => {
    const websiteURL = req.query.url;

    try {
        const response = await axios.get(websiteURL);
        const html = response.data;
        const $ = cheerio.load(html);

        const jsFiles = [];
        const cssFiles = [];

        $('script').each((index, element) => {
            const src = $(element).attr('src');
            if (src) {
                jsFiles.push(src);
            }
        });

        $('link[rel="stylesheet"]').each((index, element) => {
            const href = $(element).attr('href');
            if (href) {
                cssFiles.push(href);
            }
        });

        res.json({ jsFiles, cssFiles });
    } catch (error) {
        res.status(500).json({ error: 'Произошла ошибка при получении данных с сайта' });
    }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
