module.exports.run = async (client, message, args) => {
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'say');
    let channel;
    if (message.mentions.channels.size < 1) channel = message.guild.channels.cache.get(message.channel.id);
    if (message.mentions.channels.size > 0 ) channel = message.guild.channels.cache.get(message.mentions.channels.first().id);
   //return (console.log(`CHANNEL\n\n\n${channel}`))
    let msg;
    if (channel.id === message.channel.id) msg = args.join(' ');
    if (channel.id !== message.channel.id) msg = args.slice(1).join(' ');
    if (!msg) return client.execHelp(message, 'say');
    await message.delete();
    try {
        return channel.send(msg);
    } catch (e) {
        console.error(e);
        return message.channel.send(`Error: ${e.message}`);
    };
    return;
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Say',
    description: 'Make the bot speak!',
    usage: '$say [#channel] <message>',
    parameters: 'snowflakeGuildChannel, stringMessage',
    aliases: [],
    cat: 'mod-fun'
};