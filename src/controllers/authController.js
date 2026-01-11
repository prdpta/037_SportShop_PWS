const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Pastikan menggunakan exports.namaFungsi
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            let isMatch = (user.password.startsWith('$2b$')) 
                ? await bcrypt.compare(password, user.password) 
                : (password === user.password);

            if (isMatch) {
                req.session.user = { id: user.id, username: user.username, role: user.role };
                req.session.save(() => {
                    const target = user.role === 'admin' ? '/admin.html' : '/dashboard.html';
                    res.send(`<script>alert('Halo ${user.username}!'); window.location.replace('${target}');</script>`);
                });
            } else {
                res.send("<script>alert('Password Salah'); window.location.href='/';</script>");
            }
        } else {
            res.send("<script>alert('User tidak ditemukan'); window.location.href='/';</script>");
        }
    } catch (err) { res.status(500).send("Error Database"); }
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashed, role]);
        res.send("<script>alert('Berhasil Daftar'); window.location.href='/';</script>");
    } catch (err) { res.status(500).send("Gagal Daftar"); }
};

exports.getStatus = (req, res) => res.json(req.session.user || { loggedIn: false });
exports.logout = (req, res) => { req.session.destroy(); res.redirect('/'); };