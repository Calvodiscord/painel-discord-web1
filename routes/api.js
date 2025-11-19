const router = require('express').Router();
const fetch = require('node-fetch');

// Rota específica para buscar as estatísticas
router.get('/stats', async (req, res) => {
    try {
        const response = await fetch(`${process.env.BOT_API_URL}/stats`, {
            headers: { 'x-api-key': process.env.BOT_API_KEY }
        });

        if (!response.ok) {
            throw new Error(`API do Bot respondeu com status: ${response.status}`);
        }

        const stats = await response.json();
        res.json(stats); // Responde com os dados em formato JSON

    } catch (error) {
        console.error("Erro na API de stats:", error);
        res.status(500).json({ error: 'Não foi possível buscar as estatísticas.' });
    }
});

module.exports = router;