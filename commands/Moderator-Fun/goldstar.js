module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const stars = client.stars;
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'goldstar');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'goldstar');
    const reason = args.slice(1).join(' ');
    if (!reason) return client.execHelp(message, 'goldstar');
    await message.delete();
    const obj = {
        type: 'gold',
        moderator: message.author.tag,
        date: moment().format('MMMM Do, YYYY, h:mm:ss a'),
        reason: reason
    };
    if (!stars.has(member.user.id)) stars.set(member.user.id, []);
    const userStars = stars.get(member.user.id);
    userStars.push(obj);
    stars.set(member.user.id, userStars);
    const embed = new MessageEmbed()
        .setColor('GOLD')
        .setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Twemoji2_2b50.svg/200px-Twemoji2_2b50.svg.png")
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('Gold Star!')
        .setDescription(`${member.user.username} has been awarded a Gold Star by ${message.author.username}! Awesome!`)
        .addField('Reason', reason)
    return message.channel.send(member.user, embed);
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
    name: 'Goldstar',
    description: 'Awards a gold star to a user.',
    usage: '$goldstar <@user|user ID> <reason>',
    parameters: 'snowflakeGuildMember, stringReason',
    aliases: ['gstar', 'gs'],
    cat: 'mod-fun'
};