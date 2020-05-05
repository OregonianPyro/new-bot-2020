module.exports = (client, member) => {
    const { MessageEmbed } = require('discord.js');
    const guild = member.guild;
    if (member.roles.cache.has("361571627177082881")) member.roles.remove("361571627177082881");
    member.roles.add("704579832171855923", "New member.");
    const channel = guild.channels.cache.get("704579806737596496");
    if (!channel) return;
    const sendEmbed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(guild.name, guild.iconURL())
      .setDescription(`Welcome to **${guild.name}**. Due to recent security issues within the server, you will have to wait until a staff member accepts you into the server. We apologize for any inconveniences.`)
    channel.send(member.user, sendEmbed)
    const staffEmbed = new MessageEmbed()
      .setColor('RED')
      .setAuthor(member.user.tag, member.user.avatarURL())
      .setTitle('New User')
      .setDescription(`Please verify ${member.user} (\`${member.user.id}\`) in <#704579806737596496>`)
    return guild.channels.cache.get("695515124534083584").send("<@&362824779570479104>", staffEmbed);
};