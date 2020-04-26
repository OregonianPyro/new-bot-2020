module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be an administrator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'softban');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'ban');
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
    if (!reason || reason.length < 1) return client.execHelp(message, 'softban');
    await message.delete();
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been banned from **${message.guild.name}** by ${message.author.tag}`)
        .addField('Reason', reason)
        .setColor('RED')
        .setFooter('[!] You can rejoin with a valid invite link.')
        .setThumbnail('https://tinyurl.com/bantriangle')
    try {
        await member.send(userDM);
    } catch (e) {
        console.log(e);
    };
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://vignette.wikia.nocookie.net/pufflescp/images/6/68/Red_Warning_Triangle.png/revision/latest?cb=20160718024653')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('User Soft-Banned')
        .setDescription(`**${member.user.username}** has been soft-banned by ${message.author.username}\nAll of the user's messages sent in the previous 24 hours have been removed.`)
        .addField('Reason', reason)
        .setColor('RED')
    try {
        await member.ban({ reason: `Soft-banned by ${message.author.tag} for ${reason}`, days: 1 });
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
        type: "ban",
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
        type: "soft-ban",
        time: time,
        reason: reason
    });
    client.userModCases.set(member.user.id, userCases);
    message.channel.send(member.user, channelEmbed);
    //UNBAN
    await message.guild.members.unban(member.user.id, `Unbanned by ${client.user.tag} for soft-ban expired.`);
    const unbannedEmbed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(client.user.username, client.user.avatarURL())
        .setTitle('User Unbanned')
        .setDescription(`**${member.user.username}** has been unbanned by ${client.user.username}`)
        .addField('Reason', 'Ban expired.')
        .setThumbnail("https://www.pngkey.com/png/full/516-5165763_bp-icon-warning-green-triangle-do-not-enter.png")
    await message.channel.send(unbannedEmbed);
    //
    time = moment().format('MMMM Do YYYY, h:mm:ss a');
    current = client.modCases.get(message.guild.id);
    caseNum = client.modCases.get(message.guild.id).length + 1;
    current.push({
        case: caseNum,
        user: member.user.tag,
        moderator: client.user.tag,
        type: "unban",
        time: time,
        reason: 'Ban expired.'
    });
    client.modCases.set(message.guild.id, current);
    if (!client.userModCases.has(member.user.id)) {
        await client.userModCases.set(member.user.id, []);
    };
    userCases.push({
        case: caseNum,
        user: member.user.tag,
        moderator: client.user.tag,
        type: "unban",
        time: time,
        reason: 'Ban expired.'
    });
    client.userModCases.set(member.user.id, userCases);
    //
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    const channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    let logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Soft-Ban`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was soft-banned by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`Case #${caseNum} | ${time}`)
        .setColor('RED')
    channel.send(logEmbed);
    logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Unban`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was unbanned by ${client.user.tag}`)
        .addField('Reason', 'Ban expired.')
        .setFooter(`Case #${caseNum} | ${time}`)
        .setColor('GREEN')
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
    name: 'Softban', 
    description: 'Bans then unbans a user, deleting their messages sent in the last 24 hours. Great for spammers.',
    usage: '$softban <@user|user ID> <reason>',
    aliases: '[]',
    parameters: 'snowflakeGuildMember, stringReason',
    category: 'Administrator'
};