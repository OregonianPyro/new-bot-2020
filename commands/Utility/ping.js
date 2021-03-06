module.exports.run = async (client, message, args) => {
    const { MessageEmbed } = require('discord.js');
    const msg = await message.channel.send('Pinging...');
    const embed = new MessageEmbed()
      .setColor('BLUE')
      .setAuthor(client.user.username, client.user.avatarURL())
      .setDescription(`It took me **${msg.createdTimestamp - message.createdTimestamp}**ms to edit that message!`)
      .addField(':heartbeat: Discord Hearbeat', `**${client.ws.ping.toFixed()}**ms`);
    msg.edit('Pong!', embed);
};

module.exports.conf = {
    enabled: true,
    reason: null,   //you can provide a reason why the command is disabled, that way if users run the command they see why.
    perms: {
        user: 'SEND_MESSAGES',
        bot: 'SEND_MESSAGES'
    }
};

module.exports.help = {
    name: 'ping',
    description: 'Responds with the bot\'s ping.',
    usage: '{prefix}ping',
    parameters: 'None',
    aliases: [],
    cat: 'Utility'
};