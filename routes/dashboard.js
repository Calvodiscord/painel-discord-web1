const router = require('express').Router();

// Esta rota AGORA é super rápida. Ela apenas renderiza a página.
router.get('/', (req, res) => {
    res.render('dashboard', { user: req.user });
});

module.exports = router;
