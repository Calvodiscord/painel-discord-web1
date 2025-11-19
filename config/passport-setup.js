const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const User = require('../models/User'); // Caminho correto para a pasta 'models'

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
            return done(null, user);
        } else {
            const isFirstUser = (await User.countDocuments()) === 0;
            const newUser = new User({
                discordId: profile.id,
                username: profile.username,
                avatar: profile.avatar,
                role: isFirstUser ? 'owner' : 'admin'
            });
            await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        console.error(err);
        return done(err, null);
    }
}));
