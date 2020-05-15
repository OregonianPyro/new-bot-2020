module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) return client.execHelp(message, 'addrole');
    await message.delete();
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send('Error: Could not parse user.');
    if (member.user.id === message.author.id) return message.channel.send('You cannot add a role to yourself.');
    if (member.user.id === message.guild.owner.id) return message.channel.send('You cannot manage roles for the server owner.');
    if (member.roles.highest.rawPosition > message.guild.me.roles.highest.rawPosition) {
        return message.channel.send(`${member.user} has a higher role than the bot and cannot be managed.`);
    };
    if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) {
        return message.channel.send(`${member.user} has a higher role than you; therefore you cannot manage them.`);
    };
    const role = message.mentions.roles.first() || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.slice(1).join(' ').toLowerCase()) || message.guild.roles.cache.get(args[1]);
    if (!role) return message.channel.send('Error: Invalid or missing role.');
    if (member.roles.cache.has(role.name)) return message.channel.send(`${member.user} already has that role.`);
    if (role.rawPosition > message.guild.me.roles.highest.rawPosition) {
        return message.channel.send('That role is higher than the bot\'s highest role.');
    };
    let reason;
    if (message.content.includes('--')) reason = message.content.split('--')[1].join(' ');
    if (!message.content.includes('--')) reason = 'N/A';
    try {
        await member.roles.add(message.guild.roles.cache.get(role.id), `Added by ${message.author.tag} | Reason: ${reason}`)
    } catch (e) {
        console.error(e);
        return message.channel.send(`Error: An error has occurred; check the console for details.`);
    };
    const embed = new MessageEmbed()
        .setColor('BLUE')
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle('Role Added')
        .setDescription(`**${member.user.username}** has been given the role \`${role.name}\` by ${message.author.username}`)
        .addField('Reason', reason)
    await message.channel.send(member.user, embed);
    if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    const logEmbed = new MessageEmbed()
        .setAuthor(`${member.user.tag} | Role Added`, member.user.avatarURL())
        .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was given the role \`${role.name}\` by ${message.author.tag}`)
        .addField('Reason', reason)
        .setTimestamp()
        .setColor('BLUE')
    return channel.send(logEmbed);
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
    name: 'Addrole',
    description: 'Adds a role to a user.',
    usage: '$addrole <@user|user ID> <@role|role name|role ID> [--reason]',
    parameters: 'snowflakeGuildMember, snowflakeGuildRole, stringReason',
    aliases: ['roleadd']
};