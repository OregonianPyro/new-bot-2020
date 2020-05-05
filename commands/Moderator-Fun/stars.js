module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const wtf = '\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_\\_';
    const stars = client.stars;
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'stars');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'stars');
    await message.delete();
    if (!client.stars.has(member.user.id)) return message.channel.send('That user does not have any stars.');
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(member.user.username, member.user.avatarURL())
        .setTitle(`Star History - ${member.user.username}`)
    for (let i in stars.get(member.user.id)) {
        const curStar = stars.get(member.user.id)[i]
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
    name: 'Stars',
    description: 'Displays all stars for a user.',
    usage: '$stars <@user|user ID>',
    parameters: 'snowflakeGuildMember',
    aliases: []
};