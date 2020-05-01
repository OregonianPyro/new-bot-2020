module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const settings = client.settings.get(message.guild.id);
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send("**You must be a moderator to run this command.**");
    };
    if (!message.guild.me.permissions.has('DELETE_MESSAGES')) {
        message.delete();
        return message.channel.send('**The bot lacks the permission `DELETE_MESSAGES`.**');
    };
    if (!args[0] || isNaN(args[0])) return client.execHelp(message, 'clear');
    const toClear = args[0];
    if (toClear > 100) {
        message.delete();
        return message.channel.send('**You can only clear a maximum of `100` messages at a time.**');
    };
    await message.delete();
    try {
        message.channel.bulkDelete(toClear);
    } catch (e) {
        return message.channel.send(`**:no_entry: Critical Error Occurred: ${e.message}**`);
    };
    await message.channel.send(`Cleared ${toClear} message(s)!`);
    if (!settings.logging.modlog.enabled || !message.guild.channels.cache.get(settings.logging.modlog.id)) return;
    const channel = message.guild.channels.cache.get(settings.logging.modlog.id);
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setDescription(`${message.author.username} cleared **${toClear}** message(s) in ${message.channel}`)
    return channel.send(embed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'DELETE_MESSAGES'
    }
};

module.exports.help = {
    name: 'Clear',
    description: 'Clears `x` amount of messages from a channel.',
    usage: '$clear <1-100>',
    parameters: 'numberToClear',
    aliases: ["prune"]
};