const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    constructor() {
        super();
        this.receiverID = '';
        this.checkReader = [];
        this.stateStatus = {
            cancel: 1,
            kick: 1,
            salam: 1,
            qrp: 1,
        };
        this.messages;
        this.payload
    }

    get myBot() {
        const bot = ['u868f18020f65c1887fba07cbf44cb1d5','u51e83666117c1daf018ac57e28ea53f0','u277c188afb3f7632c261c58a79933360','u27dcf89bce7c8747107301e7b4424e08','u3a1641641abbf666b61a09221748d10c','u413abe1a4bbe3f646c8edab032fd6117','u43a4a9e76c47863e4a839b39b95c7047','u5ed385b3f578a1552439d75ada3eaea4','u605205b7305427eb778b499dbf4aebc8','u630ee831febbe7240973364570541171','u9882ac8a197b20f25cc21650f656fadd','ub1594fa0d3959eb82ac73675541d7ee0','ubc56b8fda25e78795ce157905a7fe6f2','ube3899df6730441eae28c3dc2f109249','uc687709232ddb16870499e0e9687c8ed','ue7afb5f5fd1b16902f22f29b9c9c9970','ufedfd6819d63f9235007cab688acebe7','u382280cbc27f30b9393b17d87ac4c569'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25 || operation.type == 26) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message._from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }

        if(operation.type == 13 && this.stateStatus.cancel == 1 && !this.isAdminOrBot(operation.param2) {
            this._cancel(operation.param2,operation.param1);
        }

        if(operation.type == 16 && this.stateStatus.salam == 1){
            let halo = new Message();
            halo.to = operation.param1;
            halo.text = "hellow";
            this._client.sendMessage(0, halo);
            }

        if(operation.type == 19) { //ada kick
            // op1 = group nya
            // op2 = yang 'nge' kick
            // op3 = yang 'di' kick
            if(this.isAdminOrBot(operation.param3)) {
                this._invite(operation.param1,[operation.param3]);
            }
            if(!this.isAdminOrBot(operation.param2)){
                this._kickMember(operation.param1,[operation.param2]);
            }
        }

        if(operation.type == 13) { // diinvite
            if(this.isAdminOrBot(operation.param2)) {
                return this._acceptGroupInvitation(operation.param1);
            } else {
                return this._cancel(operation.param1,this.myBot);
            }
        }

        if(operation.type == 11 && !this.isAdminOrBot(operation.param2) && this.stateStatus.qrp == 1) {
            this._kickMember(operation.param1,[operation.param2]);
            this.messages.to = operation.param1;
            this.qrOpenClose();
        }
        this.getOprationType(operation);
    }

    command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        
        this.command('sp33d', this.getSpeed.bind(this));
        this.command(`haii ${payload}`,this.kickAll.bind(this));
    }

}


module.exports = LINE;
