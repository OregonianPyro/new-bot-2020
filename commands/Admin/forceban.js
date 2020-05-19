module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const moment = require('moment');
    if (!message.member.permissions.has('BAN_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be an administrator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'forceban');
    if (isNaN(args[0])) return message.channel.send(`${message.member} | Invalid user ID.`);
    message.delete();
    let msg = await message.channel.send('Attempting to fetch user...');
    const member = await client.users.fetch(args[0]);
    if (!member) return msg.edit(`${message.member} | Unable to find an account with that ID.`);
    if (member.id === message.author.id) return msg.edit(`${message.member} | You cannot ban yourself!`);
    if (message.guild.members.cache.has(member.id)) return msg.edit(`${message.member} | That user is in this server; please run \`$ban\` to ban them.`);
    const bans = await message.guild.fetchBans();
    if (bans.has(member.id)) return msg.edit(`${message.member} | That user is already banned.`);
    const reason = args.slice(1).length > 0 ? args.slice(1).join(' ') : 'N/A';
    const channelEmbed = new MessageEmbed()
        .setThumbnail('https://vignette.wikia.nocookie.net/pufflescp/images/6/68/Red_Warning_Triangle.png/revision/latest?cb=20160718024653')
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle('User Banned')
        .setDescription(`**${member.username}** has been force-banned by ${message.author.username}`)
        .addField('Reason', reason)
        .setColor('RED')
    try {
        await message.guild.members.ban(member.id, { reason: `Banned by ${message.author.tag} for ${reason}` });
    } catch (e) {
        return message.channel.send(`:no_entry: **Command failed: ${e.message}**`);
    };
    const time = moment().format('MMMM Do YYYY, h:mm:ss a');
    await msg.edit(channelEmbed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.tag} | Force-Ban`, member.displayAvatarURL())
        .setDescription(`**${member.tag}** (\`${member.id}\`) was force-banned by ${message.author.tag}`)
        .addField('Reason', reason)
        .setFooter(`Case #NaN | ${time}`)
        .setColor('RED')
    return channel.send(logEmbed);
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'BAN_MEMBERS',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'Forceban',
    description: 'Force-bans any Discord user by using their Discord ID.',
    usage: '$forceban <user ID> [reason]',
    parameters: 'snowflakeDiscordID, stringReason',
    aliases: ['fban', 'hackban', 'hban'],
    cat: 'Admin'
};
