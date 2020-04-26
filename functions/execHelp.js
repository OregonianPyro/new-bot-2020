module.exports = async (message, commandName) => {
    if (!message || !commandName) return console.error('Error: No "message" or "commandName" provided.');
    const URL = 'https://cdn.discordapp.com/avatars/397946421812396033/3fbe8689791a2f8f3c4064321f7f4985.png?size=1024';
    const { MessageEmbed } = require('discord.js');
    const cmdFile = message.client.commands.get(commandName); 
    if (!cmdFile) return console.error(`Error: The command file '${commandName}.js' does not exist.`);
    await message.delete();
    await message.channel.send(`$help ${commandName}`);
    const helpEmbed = new MessageEmbed()
        .setAuthor(`Utilidex | Command: ${cmdFile.help.name}`, URL)
        .setDescription('`< >` denotes a __required__ parameter.\n`[ ]` denotes an optional parameter.')
        .addField('Description', cmdFile.help.description, false)
        .addField('Usage', cmdFile.help.usage, false)
        .addField('Parameters', `\`${cmdFile.help.parameters}\``)
        .addField('Aliases', cmdFile.help.aliases)
        .setColor('BLUE')
    return message.channel.send(helpEmbed);
};