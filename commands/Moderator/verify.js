module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    if (!message.member.permissions.has('KICK_MEMBERS')) {
        message.delete();
        return message.channel.send('**You must be a moderator to run this command.**');
    };
    if (!args[0]) {
        const sandbox = [];
        const roled = [];
        message.guild.members.cache.forEach(m => { 
            if (m.roles.cache.has('704579832171855923')) roled.push(`${m.user.tag}-${m.user.id}`);
        });
        let number = 0;
        for (let i = 0; i < roled.length; i++) {
        number = number + 1;
        sandbox.push(`[${number}] ${roled[i].split('-')[0]}`);
        };
        if (sandbox.length < 1) return message.channel.send(`${client.emotes.x} There are no users to verify!`);
        const msg = await message.channel.send(`Type the number of the use you wish to verify.\`\`\`${sandbox.join('\n')}\`\`\``);
        message.channel.awaitMessages(m => m.author.id === message.author.id, { max: 1, time: 60000, errors: ['time'] }).then(async messages => {
            if (messages.first().content > 0 && messages.first().content <= number) {
                let member = roled[messages.first().content - 1];
                member = member.split('-')[1];
                member = message.guild.members.cache.get(member);
                if (!member) return msg.edit(`${client.emotes.x} Unable to find that user.`);
                if (!member.roles.cache.has('704579832171855923')) return msg.edit(`${client.emotes.x} That user does not have the \`VERIFY ME\` role.`);
                try {
                    await member.roles.remove('704579832171855923', `Verified by ${message.author.tag}`);
                    await member.roles.add('361571627177082881');
                } catch (e) {
                    return msg.edit(`Error: ${e.message}`);
                };
                const embed = new MessageEmbed()
                    .setColor('BLUE')
                    .setAuthor(member.user.username, member.user.displayAvatarURL())
                    .setTitle('New Member')
                    .setDescription(`Welcome **${member.user.username}**! Please be sure to read <#362754040897208330> and enjoy talking with fello pyros!`)
                await message.guild.channels.cache.get('312344792300519425').send(member.user, embed);
                await msg.edit(`${client.emotes.check} Successfully verified **${member.user.tag}**!`);
                if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
                let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
                const logEmbed = new MessageEmbed()
                 .setAuthor(`${member.user.tag} | Verified`, member.user.displayAvatarURL())
                .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was verified by ${message.author.tag}`)
                .setTimestamp()
                .setColor('BLUE')
                 channel.send(logEmbed);
            };
        }).catch(() => {
            return msg.edit(`${client.emotes.x} Timed out.`);
        });
    };
    // const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    // if (!member) {
    //     message.delete();
    //     return message.channel.send('Error: Could not parse user.');
    // };
    // await message.delete();
    // const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === 'verify me');
    // if (!role) return message.channel.send('Error: Could not find `VERIFY ME` role.');
    // if (!member.roles.cache.has(role.id)) return message.channel.send('Error: That user does not have the `VERIFY ME` role.');
    // try {
    //     await member.roles.remove(role.id, `Removed by ${message.author.username}`);
    //     await member.roles.add('361571627177082881');
    // } catch (e) {
    //     console.error(e);
    //     return message.channel.send('Error: A critical error occurred; check the console for details.');
    // };
    // const embed = new MessageEmbed()
    //     .setColor('BLUE')
    //     .setAuthor(member.user.username, member.user.avatarURL())
    //     .setTitle('New Member')
    //     .setDescription(`Welcome **${member.user.username}**! Please be sure to read <#362754040897208330> and enjoy talking with fello pyros!`)
    // await message.guild.channels.cache.get('704579806737596496').bulkDelete(3);
    // await message.guild.channels.cache.get('312344792300519425').send(member.user, embed);
    // if (!client.settings.get(message.guild.id).logging.modlog.enabled || !message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id)) return;
    // let channel = message.guild.channels.cache.get(client.settings.get(message.guild.id).logging.modlog.id);  
    // const logEmbed = new MessageEmbed()
    //     .setAuthor(`${member.user.tag} | Verified`, member.user.avatarURL())
    //     .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was verified by ${message.author.tag}`)
    //     .setTimestamp()
    //     .setColor('BLUE')
    // return channel.send(logEmbed);
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
    name: 'Verify',
    description: 'Verifies a new user and allows them access into the server.',
    usage: '$verify <@user|user ID>',
    parameters: 'snowflakeGuildMember',
    aliases: []
};