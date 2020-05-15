module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    let member;
    if (!args[0]) {
      member = message.member;
    } else {
      member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    };
    const gjoinedOn = moment(member.joinedAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A');
    const djoinedOn = moment(member.user.createdAt).format('dddd, MMMM Do, YYYY, hh:mm:ss A');
    let status;
    if (member.user.presence.status === 'online') {
      status = `<:utilidexOnline:709314215386677300>ONLINE`;
    } else if (member.user.presence.status === 'idle') {
      status = `<:utilidexIdle:709314236773433377>IDLE`;
    } else if (member.user.presence.status === 'dnd') {
      status = `<:utilidexDND:709314236945530970>DND`;
    } else if (member.user.presence.status === 'streaming') {
      status = `<:utilidexStreaming:709314215495860317>STREAMING`;
    } else if (member.user.presence.status === 'offline') {
      status = `<:utilidexOffline:709314215516831825>OFFLINE`;
    };
    let note;
    let roleSize = member.roles.cache.size > 1 ? member.roles.cache.size - 1 : 0;
    let roles = member.roles.cache.size > 1 ? member.roles.cache.map(r => r.name).slice(1).join(', ') : 'No roles';
    let highestRole = member.roles.cache.size > 1 ? member.roles.highest.name : 'No Highest Role';
    const embed = new MessageEmbed()
      .setColor(member.roles.highest.hexColor)
      .setAuthor(member.user.username, member.user.displayAvatarURL)
      .setDescription(`» Status: **${status}**\n» Nickname: **${member.displayName}**`)
      .addField('Username', member.user.tag, true)
      .addField('User ID', member.user.id, true)
      .addField('Joined Discord On', djoinedOn, true)
      .addField('Joined On', gjoinedOn, true)
      .addField(`Roles [${roleSize}]`, `${roles}\n\nHighest Role: __**${highestRole}**__`)
      .setFooter(`Requested by: ${message.author.username}`, message.author.avatarURL())
      .setThumbnail(member.user.avatarURL());
    return message.channel.send(embed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'User',
    description: 'Displays information for a user.',
    usage: '$user [@user|user ID]',
    parameters: 'snowflakeGuildMember',
    aliaes: ['whois', 'userinfo']
}