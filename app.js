const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret-key-olahraga',
    resave: true, // Ubah jadi true agar session selalu diperbarui
    saveUninitialized: false,
    cookie: { 
        secure: false, // Wajib false untuk localhost
        httpOnly: true, 
        maxAge: 3600000 // 1 jam
    }
}));

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(3000, () => console.log("SERVER RUNNING: http://localhost:3000"));