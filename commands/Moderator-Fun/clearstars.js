module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const stars = client.stars;
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'clearstars');
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return client.execHelp(message, 'clearstars');
    await message.delete();
    if (!client.stars.has(member.user.id)) return message.channel.send('That user does not have any stars.');
    await stars.delete(member.user.id);
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(member.user.username, member.user.avatarURL())
        .setTitle('Stars Deleted')
        .setDescription(`All stars for **${member.user.username}** have been deleted by ${message.author.username}`)
        .addField('Reason', args.slice(1).join(' ') ? args.slice(1).join(' ') : 'N/A')
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
    name: 'Clearstars',
    description: 'Deletes all stars for a user.',
    usage: '$clearstars <@user|user ID> [reason]',
    parameters: 'snowflakeGuildMember, stringReason',
    aliases: ['cs', 'deletestars', 'nostars']
};