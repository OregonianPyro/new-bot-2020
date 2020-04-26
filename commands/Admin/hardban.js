module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be an administrator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'hardban');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'hardban');
    if (member.roles.highest.rawPosition >= message.member.roles.highest.rawPosition) {
        message.delete();
        return message.channel.send('**You cannot moderate a user with an equal or higher role than you.**');
    };
    if (member.user.id === message.author.id) {
        message.delete();
        return message.channel.send('**You cannot moderate yourself.**');
    };
    if (member.user.id === message.guild.owner.id) {
        message.delete();
        return message.channel.send('**You cannot moderate the server owner.**');
    };
    const reason = args.slice(1).join(' ');
    if (!reason || reason.length < 1) return client.execHelp(message, 'hardban');
    await message.delete();
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been banned from **${message.guild.name}** by ${message.author.tag}`)
        .addField('Reason', reason)
        .setColor('RED')
        .setThumbnail('https://tinyurl.com/bantriangle')
    try {
        await member.send(userDM);
    } catch (e) {
        console.log(e);
    };
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://vignette.wikia.nocookie.net/pufflescp/images/6/68/Red_Warning_Triangle.png/revision/latest?cb=20160718024653')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('User Banned')
        .setDescription(`**${member.user.username}** has been banned by ${message.author.username}`)
        .addField('Reason', reason)
        .setColor('RED')
    try {
        await member.ban({ reason: `Hard-banned by ${message.author.tag} for ${reason}`, days: 7 });
    } catch (e) {
        return message.channel.send(`:no_entry: **Command failed: ${e.message}**`);
    };
    let time = moment().format('MMMM Do YYYY, h:mm:ss a');
    let current = client.modCases.get(message.guild.id);
    let caseNum = client.modCases.get(message.guild.id).length + 1;
    current.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "hardban",
        time: time,
        reason: reason
    });
    client.modCases.set(message.guild.id, current);
    if (!client.userModCases.has(member.user.id)) {
        await client.userModCases.set(member.user.id, []);
    };
    let userCases = client.userModCases.get(member.user.id);
    userCases.push({
        case: caseNum,
        user: member.user.tag,
        moderator: message.author.tag,
        type: "hard-ban",
        time: time,
        reason: reason
    });
    client.userModCases.set(member.user.id, userCases);
    message.channel.send(member.user, channelEmbed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    const channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    let logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Hard-Ban`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was hard-banned by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`Case #${caseNum} | ${time}`)
        .setColor('RED')
    channel.send(logEmbed);
    return channel.send(logEmbed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms:{
        user:'BAN_MEMBERS',
        bot:'BAN_MEMBERS'
    }
};

module.exports.help = {
    name: 'Hardban', 
    description: 'Bans a user, deleting their messages sent in the last 7 days.',
    usage: '$hardban <@user|user ID> <reason>',
    aliases: '[]',
    parameters: 'snowflakeGuildMember, stringReason',
    category: 'Administrator'
};