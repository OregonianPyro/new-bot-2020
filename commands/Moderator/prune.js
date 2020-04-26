module.exports.run = async (client, message, args) => {
    message.channel.messages.cache;
};

module.exports.conf = {
    enabled: true,
    reason: null,
    perms: {
        user: 'KICK_MEMBERS',
        bot: 'DELETE_MESSAGES'
    }
};

module.exports.help = {
    name: 'Prune',
};