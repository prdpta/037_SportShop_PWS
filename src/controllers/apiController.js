const db = require('../config/db');
const axios = require('axios');

exports.generateKey = async (req, res) => {
    const key = 'SPORT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    await db.query('INSERT INTO user_keys (user_id, key_value) VALUES (?, ?)', [req.session.user.id, key]);
    res.json({ key });
};

exports.searchAmazon = async (req, res) => {
    const { api_key, query } = req.query;
    try {
        const response = await axios.get('https://real-time-amazon-data.p.rapidapi.com/search', {
            params: { query, country: 'US', category_id: 'sporting-goods' },
            headers: { 
                'X-RapidAPI-Key': '10fc50535dmshf5293cb6d01048ap1be06fjsn87a59597c291',
                'X-RapidAPI-Host': 'real-time-amazon-data.p.rapidapi.com'
            }
        });
        res.json(response.data.data.products);
    } catch (err) { res.status(500).json({ error: "API Error" }); }
};