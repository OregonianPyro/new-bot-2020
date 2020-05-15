module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    const stars = client.stars;
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'brownstar');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'brownstar');
    const reason = args.slice(1).join(' ');
    if (!reason) return client.execHelp(message, 'brownstar');
    await message.delete();
    const obj = {
        type: 'brown',
        moderator: message.author.tag,
        date: moment().format('MMMM Do, YYYY, h:mm:ss a'),
        reason: reason
    };
    if (!stars.has(member.user.id)) stars.set(member.user.id, []);
    const userStars = stars.get(member.user.id);
    userStars.push(obj);
    stars.set(member.user.id, userStars);
    const embed = new MessageEmbed()
        .setColor('#8d3202')
        .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Twemoji2_1f4a9.svg/200px-Twemoji2_1f4a9.svg.png')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('Brown Star!')
        .setDescription(`${member.user.username} has been awarded a star by ${message.author.username}...but it ain't gold!`)
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
    name: 'Brownstar',
    description: 'Awards a brown star to a user.',
    usage: '$brownstar <@user|user ID> <reason>',
    parameters: 'snowflakeGuildMember, stringReason',
    aliases: ['bstar', 'bs'],
    cat: 'mod-fun'
};