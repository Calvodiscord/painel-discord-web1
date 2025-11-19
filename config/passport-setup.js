const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});

passport.use(new DiscordStrategy({
    clientID: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    callbackURL: process.env.APP_URL + '/auth/discord/callback',
    scope: ['identify']
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ discordId: profile.id });
        if (user) {
            // Se o usuário já existe, apenas o retorna
            done(null, user);
        } else {
            // Se for o primeiro login, cria um novo usuário
            // LÓGICA DE OWNER: O primeiro usuário a se cadastrar se torna o "owner"
            const isFirstUser = (await User.countDocuments()) === 0;
            const newUser = new User({
                discordId: profile.id,
                username: profile.username,
                discriminator: profile.discriminator,
                avatar: profile.avatar,
                role: isFirstUser ? 'owner' : 'admin' // O primeiro usuário é o dono
            });
            await newUser.save();
            done(null, newUser);
        }
    } catch (err) {
        console.error(err);
        done(err, null);
    }
}));
