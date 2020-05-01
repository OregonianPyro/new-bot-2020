module.exports = {
    prefix: '$',
    ignored:{
        users:[],
        roles:[],
        channels:[]
    },
    logging:{
        modlog:{
            enabled: false,
            id: null
        },
        msglog:{
            enabled: false,
            id: null
        },
        imglog:{
            enabled: false,
            id: null
        },
        nicklog:{
            enabled: false,
            id: null
        },
        memberlog:{
            enabled: false,
            id: null
        },
        rolelog:{
            enabled: false,
            id: null
        }
    },
    muted_role: null,
    staff_role: null,
    default_mute_time: '1h',
    default_ban_time: '24h',
    greeting:{
        enabled: false,
        id: null,
        type: 'msg',
        text: null
    },
    leaving:{
        enabled: false,
        id: null,
        type: 'msg',
        text: null
    }
}