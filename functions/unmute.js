module.exports = async (client) => {
    const { MessageEmbed } = require('discord.js');
    const ms = require("ms");
    const sandbox = client.activeMutes.array();
    for (let i in sandbox) {
        const time = ms(sandbox[i].time);
        console.log(` ************************************************** TIME************: ${time}`);
        /*const guild = client.guilds.cache.get(sandbox[i].guild);
        const guildMutedRole = guild.roles.cache.get(sandbox[i].guild_muted_role);
        if (!guildMutedRole) continue;
        const member = guild.members.cache.get(sandbox[i].id);
        if (!member) continue;
        if (!member.roles.cache.has(guildMutedRole)) continue;
        if (Date.now() > time) {
            member.roles.remove(guildMutedRole);
            await console.log(`[ SUCCESFULLY UNMUTED '${member.user.tag}' ]`)
            await client.activeMutes.delete(member.user.id)
            const settings = client.settings.get(guild);
            const userDM = new MessageEmbed()
                .setAuthor(guild.name, guild.iconURL())
                .setDescription(`You have been unmuted in **${message.guild.name}** by ${client.user.tag}`)
                .addField('Reason', 'Mute expired.')
                .setColor('BLUE')
                .setThumbnail('https://goo.gl/HNsDw1')
            try {
                member.send(userDM);
            } catch (e) {
                console.log(e);
            };
            const channelEmbed = new MessageEmbed()
                .setThumbnail('https://goo.gl/HNsDw1')
                .setAuthor(client.user.username, client.user.avatarURL())
                .setTitle('User Unmuted')
                .setDescription(`**${member.user.username}** has been unmuted by ${client.user.username}`)
                .addField('Reason', "Mute expired.")
                .setColor('BLUE')
            const moment = require('moment');
            const logtime = moment().format('MMMM Do YYYY, h:mm:ss a');
            const current = client.modCases.get(guild.id);
            const caseNum = client.modCases.get(guild.id).length + 1;
            current.push({
                case: caseNum,
                user: member.user.tag,
                moderator: client.user.tag,
                type: "unmute",
                time: logtime,
                reason: "Mute expired."
            });
            if (!client.userModCases.has(member.user.id)) {
                await client.userModCases.set(member.user.id, []);
            };
            const userCases = client.userModCases.get(member.user.id);
            userCases.push({
                case: caseNum,
                user: member.user.tag,
                moderator: client.user.tag,
                type: "unmute",
                time: time,
                reason: "Mute expired."
            });
            client.userModCases.set(member.user.id, userCases);
            message.channel.send(member.user, channelEmbed);
            if (!settings.logging.modlog.enabled || !guild.channels.cache.get(settings.logging.modlog.id)) continue;
            let channel = guild.channels.cache.get(settings.logging.modlog.id);  
            const logEmbed = new MessageEmbed()
                .setAuthor(`${member.user.tag} | Unmute`, client.user.avatarURL())
                .setDescription(`**${member.user.tag}** (\`${member.user.id}\`) was unmuted by ${client.user.tag}`)
                .addField('Reason', "Mute expired.")
                .setFooter(`Case #${caseNum} | ${time}`)
                .setColor('BLUE')
            channel.send(logEmbed);
            ///
            };*/
        };
        // for (let i in client.activeMutes.get("1")) {
        //     const time = client.activeMutes.get("1")[i].time;
        //     const guildId = client.activeMutes.get("1")[i].guild;
        //     const guild = client.guilds.cache.get(guildId);
        //     const member = guild.members.cache.get(client.activeMutes.get("1")[i].id);
        //     const mutedRole = guild.roles.cache.get(client.settings.get(guild.id).muted_role);
        //     if (!mutedRole) continue;
  
        //     if (Date.now() > time) {
        //         member.roles.remove(mutedRole);
        //         client.activeMutes.get("1").splice(indexOf(client.activeMutes.get("1")[i].id), 1) 
        //     }
        // }
};

/*
example:

"123456789":{
    id: "123456789",
    guild: "123456789",
    guild_muted_role: "123456789",
    time: "3230203"
};
*/