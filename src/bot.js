const LineConnect = require('./connect');
let line = require('./main.js');
let LINE = new line();
console.info("\n\
.::      .::    .::::     .::     .::.:::     .::   .::::   \n\
 .::    .::   .::    .::  .::     .::.: .::   .:: .:    .:: \n\
  .:: .::   .::        .::.::     .::.:: .::  .::.::        \n\
    .::     .::        .::.::     .::.::  .:: .::.::        \n\
    .::     .::        .::.::     .::.::   .: .::.::   .::::\n\
    .::       .::     .:: .::     .::.::    .: :: .::    .: \n\
    .::         .::::       .:::::   .::      .::  .:::::   \n");
console.info("\n\
=========================================\n\
BotName: LINE Alphat JS\n\
Version: FORKED VERSION\n\
Thanks to @Alfathdirk @TCR_TEAM\n\
=========================================\n\
\nNOTE : This bot is made by @Alfathdirk @TCR_TEAM and has been forked by Young !\n\
***Copyright belongs to the author***");

const auth = {
	authToken: 'FIrM2z9WIkWSTkRe0iAe.gufDRztNV3t8CCzmV2YixG.PfQwkFBOYBeQKwpQkT1+pmGF9JnY3UxWbTfsplkcWuc=',
	certificate: 'c8b66180ebacbd3abc6ebd4621a453d3f7e4f10ba534f146bf9f86c5755344ac',
	email: '',
	password: ''
}

//let client =  new LineConnect();
let client =  new LineConnect(auth);

client.startx().then(async (res) => {
	
	while(true) {
		try {
			ops = await client.fetchOps(res.operation.revision);
		} catch(error) {
			console.log('error',error)
		}
		for (let op in ops) {
			if(ops[op].revision.toString() != -1){
				res.operation.revision = ops[op].revision;
				LINE.poll(ops[op])
			}
		}
	}
});

