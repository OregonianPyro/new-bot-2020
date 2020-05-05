module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const wtf = '\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_';
    const stars = client.stars;
    if (!client.stars.has(message.author.id)) return message.channel.send(`${message.author} has no stars.`);
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle(`Star History - ${message.author.username}`)
    for (let i in stars.get(message.author.id)) {
        const curStar = stars.get(message.author.id)[i]
        embed.addField('Date', curStar.date, true);
        embed.addField('Star Type', curStar.type === 'brown' ? 'Brown :poop:' : 'Gold :star:', true);
        embed.addField('Moderator', curStar.moderator, true);
        embed.addField('Reason', `${curStar.reason}\n${wtf}`);
    };
    return message.channel.send(embed);
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
    name: 'Mystars',
    description: 'Displays all stars for yourself.',
    usage: '$mystars',
    parameters: null,
    aliases: []
};