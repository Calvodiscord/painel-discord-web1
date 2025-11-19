const router = require('express').Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
    try {
        const response = await fetch(`${process.env.BOT_API_URL}/stats`, {
            headers: { 'x-api-key': process.env.BOT_API_KEY }
        });
        const stats = await response.json();
        res.render('dashboard', { user: req.user, stats: stats });
    } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        res.render('dashboard', { user: req.user, stats: null });
    }
});

module.exports = router;
