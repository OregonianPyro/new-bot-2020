module.exports = (client, guild) => {
    client.settings.set(guild.id, require('../default_settings.js'));
};