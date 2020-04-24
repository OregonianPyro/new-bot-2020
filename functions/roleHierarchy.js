module.exports = async (client, message, member) => {
    if (!client || !message || !member) return;
    if (message.guild.me.roles.highest >= member.roles.highest) return false;
    if (message.guild.me.roles.highest <= member.roles.highest) return true;
};