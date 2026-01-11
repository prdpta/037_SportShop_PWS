const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Fungsi Generate API Key untuk User
router.post('/generate-key', async (req, res) => {
    if (!req.session.user) return res.status(401).json({ error: "Silakan login ulang" });

    const userId = req.session.user.id;
    const newKey = 'SPORT-' + Math.random().toString(36).substring(2, 11).toUpperCase();

    try {
        // Query ini akan mengupdate jika sudah ada, atau menambah jika belum ada
        await db.query(
            'INSERT INTO user_keys (user_id, key_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE key_value = ?',
            [userId, newKey, newKey]
        );
        res.json({ key: newKey });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Gagal update database" });
    }
});

// Fungsi Monitoring untuk Admin
router.get('/monitoring', async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).json({ error: "Unauthorized" });
    }
    try {
        const [rows] = await db.query(`
            SELECT u.username, u.role, k.key_value 
            FROM users u 
            LEFT JOIN user_keys k ON u.id = k.user_id
        `);
        res.json(rows);
    } catch (err) { res.status(500).json({ error: "Gagal ambil data" }); }
});

module.exports = router;