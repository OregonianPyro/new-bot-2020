module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'warn');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'warn');
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
    if (!reason || reason.length < 1) return client.execHelp(message, 'warn');
    await message.delete();
    const userDM = new MessageEmbed()
        .setAuthor(message.guild.name, message.guild.iconURL())
        .setDescription(`You have been warned in **${message.guild.name}** by ${message.author.tag}`)
        .addField('Reason', reason)
        .setColor('BLUE')
        .setThumbnail('https://goo.gl/HNsDw1')
    try {
        await member.send(userDM);
    } catch (e) {
        console.log(e);
    };
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://goo.gl/HNsDw1')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('Warning Issued')
        .setDescription(`**${member.user.username}** has been warned by ${message.author.username}\nPlease be sure to familiarize yourself with the server rules and guidlines!`)
        .addField('Reason', reason)
        .setColor('BLUE')
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    let counter = client.modCases.get(message.guild.id);
    counter = counter.length;
    const obj = {
        caseNum: counter,
        user: member.user.username,
        userID: member.user.id,
        moderator: message.author.username,
        moderatorID: message.author.id,
        action: 'Warning',
        reason: reason,
        date: time,
        resolved: false,
        length: null  
    };
    const curCasesGuild = client.modCases.get(message.guild.id);
    curCasesGuild.push(obj);
    await client.modCases.set(message.guild.id, curCasesGuild);
    if (!client.userModCases.has(member.user.id)) client.userModCases.set(member.user.id, []);
    const curCasesUser = client.userModCases.get(member.user.id);
    curCasesUser.push(obj);
    await client.userModCases.set(member.user.id, curCasesUser);
    if (!client.warns.has(member.user.id)) client.warns.set(member.user.id, []);
    const curWarnsUser = client.warns.get(member.user.id);
    curWarnsUser.push(obj);
    await client.warns.set(member.user.id, curWarnsUser);
    message.channel.send(member.user, channelEmbed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Warn`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was warned by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`Case #${counter} | ${time}`) 
        .setColor('BLUE')
    return channel.send(logEmbed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms:{
        user:'KICK_MEMBERS',
        bot:'EMBED_LINKS'
    }
};

module.exports.help = {
    name: 'Warn', 
    description: 'Issues a warning to a user.',
    usage: '$warn <@user|user ID> <reasonnnnn>',
    aliases: '[]',
    parameters: 'snowflakeGuildMember, stringReason',
    cat: 'Moderator'
};