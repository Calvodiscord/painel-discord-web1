require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error(err));

// Configura o EJS e os arquivos estáticos
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configura a sessão
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Inicia o Passport
require('./config/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// Middleware para verificar se o usuário está logado
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// Rotas
app.get('/', (req, res) => res.render('login', { user: req.user }));
app.use('/auth', require('./routes/auth'));
app.use('/dashboard', isLoggedIn, require('./routes/dashboard'));
app.use('/api', isLoggedIn, require('./routes/api')); // Rota nova adicionada

app.listen(PORT, () => console.log(`[PAINEL] Servidor rodando na porta ${PORT}`));