require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const path = require('node:path');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONEXÃO COM O MONGODB ---
// A alteração está aqui: adicionamos o objeto de opções com o timeout aumentado.
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000 // Aumenta o tempo de espera para 30 segundos (30000ms)
})
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error(err));

// Configura o EJS (para renderizar o HTML) e a pasta de arquivos estáticos (para o CSS).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Configura a sessão de login dos usuários.
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

// Inicia o sistema de autenticação (Passport.js).
require('./config/passport-setup');
app.use(passport.initialize());
app.use(passport.session());

// Middleware de segurança: uma função que verifica se o usuário está logado antes de permitir o acesso a certas páginas.
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    res.redirect('/');
}

// --- ROTAS DA APLICAÇÃO ---
// Rota para a página inicial/login.
app.get('/', (req, res) => res.render('login', { user: req.user }));

// Rotas relacionadas à autenticação (ex: /auth/discord, /auth/logout).
app.use('/auth', require('./routes/auth'));

// Rota para o dashboard, protegida pelo middleware 'isLoggedIn'.
app.use('/dashboard', isLoggedIn, require('./routes/dashboard'));

// Rota para a API interna que busca as estatísticas, também protegida.
app.use('/api', isLoggedIn, require('./routes/api'));

// Inicia o servidor web, que ficará ouvindo por novas conexões.
app.listen(PORT, () => console.log(`[PAINEL] Servidor rodando na porta ${PORT}`));
