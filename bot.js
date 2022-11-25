const token = process.env.TOKEN;	
const {Games , Tournaments} = require('./schema');


const Bot = require('node-telegram-bot-api');
let bot;

if(process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
  bot = new Bot(token, { polling: true });
}


console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

const desto = ("☝🏾");
const finger = ("✌🏾");
const cow = ("☝🏾✌🏾");
const couter = ("✌🏾✌🏾");
const ollie = ("✋🏾");
var USERNAME , INSTANCE
if(process.env.CHANNEL === 'main'){
	USERNAME = "@dftournament";
	INSTANCE = '-444518526600970721';	
}
else{
	USERNAME = "@dftrial";
	INSTANCE = '8374143872573183001';
}

const ENDPOINT = process.env.ENDPOINT;

console.log( 'Tournament ' + USERNAME + ' Instance ' + INSTANCE + ' End Point ' + ENDPOINT )
const hands = ["Desto","Finger","Cow","Cowter","Ollie"];
const handSigns = [desto , finger , cow , couter , ollie];
var newPlayers , tournamentStatus;

if(!map){
  	var map = new Map();
}

const createDelPlayers = async (message , key) =>{
	try{
		if(message === "create"){
			let players =[
				{
					"name":"",
					"score" : 0,
					"pick" : [0,0],
					"turn" : 0,
					"id" : 0
				},
				{
					"name":"",
					"score" : 0,
					"pick" : [null],
					"turn" : 0,
					"id" : 0
				},
				{
					"name":"",
					"score" : 0,
					"pick" : [null],
					"turn" : 0,
					"id" : 0
				},
				{
					"name":"",
					"score" : 0,
					"pick" : [null],
					"turn" : 0,
					"id" : 0
				},
				{
					"name":"",
					"score" : 0,
					"pick" : [null],
					"turn" : 0,
					"id" : 0
				},
			]
			var turned = 0;
			var previousHands = "";
			var totalPlayers = 0;
			var id = '';
			newPlayers = JSON.stringify({
				turned,
				previousHands,
				totalPlayers,
				players,
				id,
			});
			map.set(key,newPlayers);
		}
		else if(message === "players"){
			let tournamentPlayers = [];
			let round = 1;
			let amountOfGames;
			tournamentStatus = JSON.stringify({
				tournamentPlayers,
				round,
				amountOfGames,
			});
			map.set('tournament' ,tournamentStatus);
		}
		else if(message === "delete")
			map.delete(key)
	}catch(error){
		console.log(error.message)
	}
}

const getKey = (msg) => {
	var key
	if(msg.chat)
		return key = msg.chat.id;
	else if(!msg.inline_message_id && !msg.chat)
		return key = `${msg.message.message_id}` + `${msg.message.chat.id}`;
	else if(msg.inline_message_id)
		return key = `${msg.inline_message_id}` + `${msg.chat_instance}`;
}

bot.on('message', (msg) => {
	try{
		if(msg.text){
			if (msg.text.indexOf("/menu") === 0 || msg.text.indexOf("/start") === 0){
				console.log("started" , msg)
				if(map.get(getKey(msg)))
					createDelPlayers("delete",msg)
				if(msg.chat.type.includes("private")){
					start(msg);
				}
				else{
					var player = 0; 
					multiPlayer( msg , player);
				}
			}   
			else if (msg.text.indexOf(desto+"Desto") === 0) {
				pickHand( msg , 1 );
			}
			else if (msg.text.indexOf(finger+"Finger") === 0) {
				pickHand( msg , 2 );
			}
			else if (msg.text.indexOf(cow+"Cow") === 0) {
				pickHand( msg , 3 );
			}
			else if (msg.text.indexOf(couter+"Cowter") === 0) {
				pickHand( msg , 4 );	
			}
			else if (msg.text.indexOf(ollie+"Ollie") === 0) {
				pickHand( msg , 5 );
			}
			else if (msg.text.indexOf( desto ) === 0 && !msg.text.includes("Desto") && 	!msg.text.includes(finger)) {
			    compareHands( msg , 1);
			}
			else if (msg.text.indexOf( finger ) === 0 && !msg.text.includes("Finger") && !msg.text.includes(couter)) {
				compareHands( msg , 2);
			}
			else if (msg.text.indexOf( cow ) === 0 && !msg.text.includes("Cow") ) {
				compareHands( msg , 3);
			}
			else if (msg.text.indexOf( couter ) === 0 && !msg.text.includes("Cowter")) {
				compareHands( msg , 4);
			}
			else if (msg.text.indexOf( ollie ) === 0 && !msg.text.includes("Ollie")) {
				compareHands( msg , 5);
			} 
			else{
				if(msg.chat.type.includes("private"))
					bot.sendMessage(msg.chat.id , "Please press /start or /menu to go to the Main Menu.")
			}
		}
	}catch(error){
		console.log("from message", msg , error.message)
	}
});
bot.on('callback_query' , async (msg) =>{
	try{
		if(msg.data.indexOf("Practice") === 0){
			console.log("started Practice" , msg)
			practice(msg)
		}
		else if(msg.data.indexOf("How To Play") === 0){
			console.log("how to " , msg)
			 bot.sendMessage(msg.message.chat.id, ("\"Desto Finger\"\n" +
	                        "\n" +
	                        "Desto Finger is an Ethiopian's game\n" +
	                        "\n" +
	                        "It can be played between two up to five people\n" +
	                        "It is played using fingers in which:-\n" +
	                        `One fingers symbolizes(${handSigns[0]})- Desto\n` +
	                        `Two fingers symbolizes(${handSigns[1]})- Finger\n` +
	                        `Three fingers symbolizes(${handSigns[2]})- Cow\n` +
	                        `Four fingers symbolizes(${handSigns[3]})-Cowter\n` +
	                        `And Five finger symbolizes(${handSigns[4]})- Ollie\n` +
	                        "\n" +
	                        "Desto , " +
	                        "Finger , " +
	                        "Cow , " +
	                        "Cowter " +
	                        "And Ollie   are known as \"Code names\"\n" +
	                        "\n" +
	                        "During 2 player mode each individual will choose 2 code names( eg. If abebe chooses desto and Ollie kebede can choose Finger and Cow or Finger and Cowter or Cow and Cowter, they both can't choose the same codenames)\n" +
	                        "\n" +
	                        `And then they will both at the same time draw their fingers equally and the their sum ( all fingers will be counted from Desto upto All-E and will repeat the cycle of more than five fingers are drawn) and the winner will be the one that reaches ${ENDPOINT} first\n` +
	                        "\n" +
	                        "It is the same for 3-5 Players only difference is that each individual can only choose 1 code name\n\n" +
	                        "This Bot also offers practice mode in which the second player will be the bot and and it's picks are completely random this will help you learn the game.\n" +
	                        "To Play with a friends just /start then choose Play With Friends and then pick the chat or type @DestoeFingerBot then type start it will guide you from there \n" + 
	                        "To Play in a group just add me in one then use /start. Enjoy."));
		}
		else if(msg.data.indexOf("begin") === 0 ){
			if(msg.from.username === "KidusM"){
				bot.editMessageText("Good Luck " , {inline_message_id : msg.inline_message_id})
				tournament(msg , 'new')
			}
			else 
   				return bot.answerCallbackQuery(msg.id, { text: 'Only The Admin Can Start The Tournament', show_alert: false });	
		}
		else if( msg.data.includes("2p") || msg.data.includes("3p") || msg.data.includes("4p") || msg.data.includes("5p") ){
			var key = getKey(msg);
			createDelPlayers("create" , key);
			newPlayers = JSON.parse(map.get(key));
			var player = parseInt(msg.data);
			newPlayers.totalPlayers = player;
			var game = await Games.countDocuments() + 1;
			game = "Game " + game ; 
			const newGame = await Games.create({newGame : game });
			newPlayers.id = newGame._id;
			map.set(key,JSON.stringify(newPlayers));
			multiPlayer( msg , 1);
		}
		else if( msg.data.indexOf( desto ) == 0 && 	!msg.data.includes(finger)){
				var player = msg.data.slice(-1); 
				pickHands( msg , 1 , player);
			}
		else if( msg.data.indexOf( finger ) == 0 && 	!msg.data.includes(couter)){
				var player = msg.data.slice(-1); 
				pickHands( msg , 2 , player);
			}
		else if( msg.data.indexOf( cow ) == 0){
				var player = msg.data.slice(-1); 
				pickHands( msg , 3 , player);
			}
		else if( msg.data.indexOf( couter ) == 0){
				var player = msg.data.slice(-1); 
				pickHands( msg , 4 , player);
			}
		else if( msg.data.indexOf( ollie ) == 0){
				var player = msg.data.slice(-1); 
				pickHands( msg , 5 , player);
			}
		else if( msg.data.indexOf( "Desto" ) == 0){
				compareHandsWithPlayer(msg , 1);
			}
		else if( msg.data.indexOf( "Finger" ) == 0){
				compareHandsWithPlayer(msg , 2);
			}
		else if( msg.data.indexOf( "Cow" ) == 0){
				compareHandsWithPlayer(msg , 3);
			}
		else if( msg.data.indexOf( "Couter" ) == 0){
				compareHandsWithPlayer(msg , 4);
			}
		else if( msg.data.indexOf( "Ollie" ) == 0){
				compareHandsWithPlayer(msg , 5);
			}
		else if( msg.data.indexOf( "multiAgain") == 0){
				console.log("multiPlayer started" , msg)
				var player = 0; 
				multiPlayer( msg , player);
		}
		else if( msg.data.indexOf( "joinTournament") == 0){
			if(!map.get('tournament')){
				createDelPlayers("players")
			}
			var playerName = msg.from.username ? "@"+ msg.from.username : msg.from.last_name ? 
							`${msg.from.first_name}` + `${msg.from.last_name}` : `${msg.from.first_name}`;
			tournamentStatus = JSON.parse(map.get('tournament'));
			tournamentPlayers = tournamentStatus.tournamentPlayers;
			if(tournamentPlayers.includes(playerName))
				return bot.answerCallbackQuery(msg.id, { text: "You've Already Joined", show_alert: false });	
			tournamentPlayers.push(playerName);
			console.log(playerName, "Joined " , tournamentPlayers)
			bot.editMessageText(tournamentPlayers.length + ' People Have Joined',{
	        	inline_message_id : msg.inline_message_id,
	        	reply_markup : { 
	        		inline_keyboard: [
			            [{ text: "Join", callback_data : "joinTournament"}],
			            [{ text: "Start(Only For Admin)", callback_data : "begin"}]
		            ]}
			});
			map.set('tournament',JSON.stringify(tournamentStatus));
		}
	}catch(error){
		console.log("from callback_query" , error.message)
	}
})
bot.on('inline_query' , (msg) => {
	try{
		if(msg.query.includes("start") || msg.query.includes("Start") ) {
			bot.answerInlineQuery(msg.id , [{
							"type" : "article",
							"id" : `${msg.id}`,
							"title" : "Click To Start Desto Finger",
							"input_message_content" : {"message_text":"Desto Finger"},
							"reply_markup" : {
								"inline_keyboard" :[[{ text: "Play" , callback_data : "multiAgain" }]]
							}
						}])
		}
		else if(msg.query.includes("tournament") && msg.from.username === "KidusM"){
			createDelPlayers("players")
			bot.answerInlineQuery(msg.id , [{
							"type" : "article",
							"id" : `${msg.id}`,
							"title" : "Start The Tournament",
							"input_message_content" : {"message_text":"Click Join to participate in the Tournament"},
							"reply_markup" : {
								"inline_keyboard" :[[{ text: "Join" , callback_data : "joinTournament" }],
								[{ text: "Start(Only For Admin)" , callback_data : "begin" }]]
							}
						}])
		}
		else if((msg.query.indexOf("remove") === 0 || msg.query.indexOf("Remove") === 0) && msg.from.username === "KidusM" ){
			var query = msg.query.split(" ")
			var mass = map.get(parseInt(query[2]))
			if(mass){
				var tournamentStatus = JSON.parse(map.get('tournament'))
				if(!mass.includes(query[1]) || !tournamentStatus.tournamentPlayers.includes(query[1])){
					return console.log("Wrong Query");
				}
				let i = 0, names = '';
				while(i < 5){
					if(mass[i] !== query[1] && mass[i])
						names += mass[i] + " , ";
					i++;
				}
				var index = tournamentStatus.tournamentPlayers.indexOf(query[1]);
				tournamentStatus.tournamentPlayers.splice(index , 1);
				console.log(query[1] , " removed from " , mass , " result " , tournamentStatus.tournamentPlayers)
				tournamentStatus.amountOfGames--;
				map.set('tournament',JSON.stringify(tournamentStatus));
				if(tournamentStatus.tournamentPlayers.length === 1){
					map.delete('tournament')
					emoji = "🎉 "
					text = " is The Winner Of The Tournament!! 🎉"
				}
				else{
					emoji = "➡️ "
					text = " Move to round " + (tournamentStatus.round+1) + emoji
				}

				bot.editMessageText( "❌ " + query[1] + " is Disqualified! ❌\n" + emoji + names + text , {
									message_id: mass[5].message_id,
				        			chat_id: mass[5].chat.id
				        		});
				if(tournamentStatus.amountOfGames === 0 && tournamentStatus.tournamentPlayers.length > 1 ){
					tournamentStatus.round++ ;
					map.set('tournament',JSON.stringify(tournamentStatus));
					tournament(msg , "editted");
				}
			}
		}
		else if((msg.query.indexOf("new") === 0  && msg.from.username === "KidusM" )){
			createDelPlayers("players")
			tournamentStatus = JSON.parse(map.get('tournament'));
			tournamentPlayers = tournamentStatus.tournamentPlayers;
			var query = msg.query.split(" ")
			if(query.pop() === "begin"){
				query.forEach(p=>{
					if(p !== "new")
						tournamentPlayers.push(p)
				})
				map.set('tournament',JSON.stringify(tournamentStatus));
				tournament(msg , "editted");
			}
		}

	}catch(error){
		console.log("from inline_query" , error.message)
	}
})

const start = (msg) => {
	bot.sendMessage(msg.chat.id, desto+ "  _*Main Menu*_  " + finger ,{
	"reply_markup": {
	    "inline_keyboard" : [ [{text: "Practice 🤖" , callback_data: "Practice"}],
	    					 [{text: "Play With Friends 👥" , switch_inline_query: "Start"}],
	    					 [{text: "Join Tournament 👑" , url: "https://t.me/dftournament"}],
	    					[{text: "Help❔" , callback_data: "How To Play"}]]
	    }, 
	"reply_to_message_id" : msg.message_id,
	"parse_mode": 'MarkdownV2'} )
};
const practice = async (msg) => {
	try{
		bot.sendMessage(msg.message.chat.id , "First Pick " ,{
			"reply_to_message_id" : msg.message_id,
			"reply_markup":{
				"keyboard": [ [desto + "Desto" , finger + "Finger" , cow + "Cow" ] ,
						[couter+ "Cowter" , ollie + "Ollie" ]
						],
			}
		}).then( async (msg) => {
			key= getKey(msg)
			if(map.has(key))
				map.delete(key)
			newPlayers = createDelPlayers("create" , key)
			newPlayers = JSON.parse(map.get(key));
			var game = await Games.countDocuments() + 1;
			game = "Game " + game ; 
			const newGame = await Games.create({newGame : game });
			newPlayers.id = newGame._id;
			map.set(getKey(msg),JSON.stringify(newPlayers));
		});
	}catch(error){
		console.log("from practice" , error.message)
	}
}
const pickHand = async ( msg , h ) =>{
	try{
		if(!map.get(getKey(msg)))
			return bot.sendMessage(msg.chat.id,
				'This Game session has Expired , Please /start another one',
				{"reply_to_message_id" : msg.message_id});
		newPlayers = JSON.parse(map.get(getKey(msg)));
		if ( newPlayers.players[0].pick[0] === h){	
			bot.sendMessage(msg.chat.id, 
				"You Cant Pick The Same Hand Twice , Choose Another One. ",
				{"reply_to_message_id" : msg.message_id});
			return;
		}
		else if(!newPlayers.players[ 0].pick[0]){
			var playerName = msg.from.username ? "@"+ msg.from.username : msg.from.last_name ? 
							`${msg.from.first_name}` + `${msg.from.last_name}` : `${msg.from.first_name}`;
			await Games.findByIdAndUpdate(
				newPlayers.id , 
				{ $push: { players : playerName } })
			newPlayers.players[0].pick[0] = h;
			newPlayers.players[ 0].name = msg.chat.first_name;
			map.set(getKey(msg),JSON.stringify(newPlayers));
			return bot.sendMessage(msg.chat.id,
				"Pick a Second One ",	
				{"reply_to_message_id" : msg.message_id}); 
		}
		else if(!newPlayers.players[ 0 ].pick[1] && newPlayers.players[ 0 ].pick[0] !== h){
			newPlayers.players[0].pick[1] = h;
			map.set(getKey(msg),JSON.stringify(newPlayers));
			startPlayingWithBot(msg);
			return;	
		}
	}catch(error){
		console.log("from pickHand" , error.message)
	}
}
const startPlayingWithBot = async (msg) => {
	try{
		newPlayers = JSON.parse(map.get(msg.chat.id));
		newPlayers.players[1].name = "Bot";
		await Games.findByIdAndUpdate(
				newPlayers.id , 
				{ $push: { players : "Bot" } })
		let botPick = [1,2,3,4,5];
		var index = botPick.indexOf(newPlayers.players[0].pick[0]);
		botPick.splice(index, 1);
		index = botPick.indexOf(newPlayers.players[0].pick[1]);
		botPick.splice(index, 1)
		newPlayers.players[1].pick[0] = botPick[Math.floor((Math.random() * 3))];
		index = botPick.indexOf(newPlayers.players[1].pick[0]);
		botPick.splice(index, 1)
		newPlayers.players[1].pick[1] = botPick[Math.floor((Math.random() * 2))];
		
		map.set(msg.chat.id,JSON.stringify(newPlayers));

		bot.sendMessage(msg.chat.id , "The Bot has Picked : "+ hands[newPlayers.players[1].pick[0] - 1] + " and " + hands[newPlayers.players[1].pick[1] - 1] +
			"\nYou have Picked : " + hands[newPlayers.players[0].pick[0] - 1] + " and " + hands[newPlayers.players[0].pick[1] - 1]  +  "\nStart Playing " ,{
				"reply_to_message_id" : msg.message_id,
				"reply_markup":{
					"keyboard": [ [desto , finger  , cow  ] ,
							[couter, ollie ]
							]
				}
			});
	}catch(error){
		console.log("from startPlayingWithBot" , error.message)
	}
}
const compareHands =  async ( msg , h) => {
	try{
		if(!map.get(getKey(msg)))
			return bot.sendMessage(msg.chat.id, 
				'This Game session has Expired , Please /start another one',
				{"reply_to_message_id" : msg.message_id});
		newPlayers = JSON.parse(map.get(getKey(msg)));
		if(newPlayers){
			if(newPlayers.players[0].score > 10 || newPlayers.players[1].score >= ENDPOINT || newPlayers.players[0].score >= ENDPOINT){
				map.set(getKey(msg),JSON.stringify(newPlayers));
				return bot.sendMessage(msg.chat.id,
						"The Game Has Ended , Please /start another one",
						{"reply_to_message_id" : msg.message_id});
			}
			if(!newPlayers.players[0].pick[1]){
				map.set(getKey(msg),JSON.stringify(newPlayers));
				return bot.sendMessage(msg.chat.id,
					{"reply_to_message_id" : msg.message_id}, practice(msg));
			}
			var botHand = Math.floor((Math.random() * 5) + 1);
			var result = (h + botHand) % 5 === 0 ? 5 : (h + botHand) % 5 ;
			if(newPlayers.players[0].pick.includes(result)){
				newPlayers.players[0].score += 1;
				await bot.sendMessage(msg.chat.id, handSigns[botHand - 1] + "\n",
							{"reply_to_message_id" : msg.message_id});
				await bot.sendMessage(msg.chat.id, hands[result - 1] + "! , " + newPlayers.players[0].name + "'s point.\n" +
					newPlayers.players[0].name + " " + newPlayers.players[0].score + " - " +
					newPlayers.players[1].score + " " + newPlayers.players[1].name)
				map.set(getKey(msg),JSON.stringify(newPlayers));
				if(newPlayers.players[0].score >= ENDPOINT){
					bot.sendMessage(msg.chat.id, "🎉 You Won 🎉 " ,{
						"reply_markup":{
		    				"inline_keyboard" : [ 
		    					[{text: "Continue Practicing 🤖" , callback_data: "Practice"}],
		    					[{text: "Play With Friends 👥" , switch_inline_query: "Start"}],
		    					[{text: "Join Tournament 👑" , url: "https://t.me/dftournament"}] 
		    				]} 
					});
				}
			}else if (newPlayers.players[1].pick.includes(result)){
				newPlayers.players[1].score += 1;
				await bot.sendMessage(msg.chat.id, handSigns[botHand - 1] + "\n",
							{"reply_to_message_id" : msg.message_id})
				await bot.sendMessage(msg.chat.id, hands[result - 1] + "! , " + newPlayers.players[1].name + "'s point.\n" +
					newPlayers.players[0].name + " " + newPlayers.players[0].score + " - " + 
					newPlayers.players[1].score + " " + newPlayers.players[1].name)
				map.set(getKey(msg),JSON.stringify(newPlayers));
				if(newPlayers.players[1].score >= ENDPOINT){
					bot.sendMessage(msg.chat.id, "😡 You Lost 😡 ",{
						"reply_markup":{
		    				"inline_keyboard" : [ 
		    					[{text: "Continue Practicing 🤖" , callback_data: "Practice"}],
		    					[{text: "Play With Friends 👥" , switch_inline_query: "Start"}],
		    					[{text: "Join Tournament 👑" , url: "https://t.me/dftournament"}] 
		    				]} 
					});
				}
			}else if (!newPlayers.players[0].pick.includes(result) && !newPlayers.players[1].pick.includes(result))
				bot.sendMessage(msg.chat.id, handSigns[botHand - 1] + "\n",
							{"reply_to_message_id" : msg.message_id}).
				then(() => { bot.sendMessage(msg.chat.id, hands[result - 1] + "! , No one's point.\n" +
					newPlayers.players[0].name + " " + newPlayers.players[0].score + " - " +
					newPlayers.players[1].score + " " + newPlayers.players[1].name)})
		}
		else 
			bot.sendMessage(msg.chat.id , "Send /start to start playing again.")
	}catch(error){
		console.log("from compareHands" , error.message)
	}
}

const multiPlayer = (msg , player) => {
	try{
		var keyboard = multiKeyboard("multiPlayer" , player);
	    var data = { reply_markup: JSON.parse(keyboard)};   
	    if(player === 0){
	    	if(msg.chat)
				return bot.sendMessage(msg.chat.id, `How Many Players ? `, data);
			else if(!msg.inline_message_id)
				data ={
					message_id: msg.message.message_id,
	                chat_id: msg.message.chat.id,
	                reply_markup: JSON.parse(keyboard)
				}
			else 
				data ={
					inline_message_id: msg.inline_message_id,
	                reply_markup: JSON.parse(keyboard)
				}
			bot.editMessageText(`How Many Players ?`, data);
		}
		else{
			if(!msg.inline_message_id)
				data ={
					message_id: msg.message.message_id,
	                chat_id: msg.message.chat.id,
	                reply_markup: JSON.parse(multiKeyboard("groupKeyboard", player))
				}
			else
				data ={
					inline_message_id: msg.inline_message_id,
	                reply_markup: JSON.parse(multiKeyboard("groupKeyboard", player))
				}
			bot.editMessageText(`Player ${player} Pick `, data ,)	
		}	
	}catch(error){
		console.log("from multiPlayer" , error.message)
	}
}
const multiKeyboard = (mode , h) =>{
	if(mode === "multiPlayer" ){
		return JSON.stringify({
				inline_keyboard: [
		            [{ text: finger + " Players", callback_data : "2p"}],
		            [{ text: cow + " Players", callback_data : "3p"}],
		            [{ text: couter + " Players", callback_data : "4p"}],
		            [{ text: ollie + " Players", callback_data : "5p"}]
		        ]
			});
	}
	else if(mode === "groupKeyboard" ){
			return JSON.stringify({
				inline_keyboard: [
				[
		            { text: desto + "Desto", callback_data : desto + `${h}`},
		            { text: finger + "Finger", callback_data : finger + `${h}`},
		            { text: cow + "Cow", callback_data : cow + `${h}`},	
		        ],
		        [
		            { text: couter + "Cowter", callback_data : couter + `${h}`},
		            { text: ollie + "Ollie", callback_data : ollie + `${h}`}
		        ],
		        [
		            { text: "Back" , callback_data : "multiAgain" }
		        ]]
			});
	} 
	else if( mode === "startPlaying") {
		return JSON.stringify({
				inline_keyboard: [
				[
		            { text: desto , callback_data : "Desto" },
		            { text: finger , callback_data : "Finger" },
		            { text: cow , callback_data : "Cow" },	
		        ],
		        [
		            { text: couter , callback_data : "Couter" },
		            { text: ollie , callback_data : "Ollie" }
		        ]]
			});
	}
	else if ( h === -1 && mode < 0) {
		return JSON.stringify({
				inline_keyboard: [
				[
		            { text: "Play Again" , callback_data : "multiAgain" }
		        ]]
			});
	}
	else if(mode === "inline" ){
		return JSON.stringify({
				inline_keyboard: [
				[
		            { text: desto + "Desto", callback_data : desto + `${h}`},
		            { text: finger + "Finger", callback_data : finger + `${h}`},
		            { text: cow + "Cow", callback_data : cow + `${h}`},	
		        ],
		        [
		            { text: couter + "Cowter", callback_data : couter + `${h}`},
		            { text: ollie + "Ollie", callback_data : ollie + `${h}`}
		        ]]
			});
	}
}
const pickHands = async ( msg , h , p) =>{
	try{
		var playerName = msg.from.username ? "@"+ msg.from.username : msg.from.last_name ? 
							`${msg.from.first_name}` + `${msg.from.last_name}` : `${msg.from.first_name}`;
		key = getKey(msg);
		var players = [];
		var round = 0 , i = 0;
		var game = '';
		var playerNames = '' , names = [];
		if(msg.chat_instance === INSTANCE){
			if(!map.get('tournament')){
				return bot.editMessageText("This Tournament Has Ended." ,{ 
					message_id: msg.message.message_id,
		            chat_id: msg.message.chat.id
		        })
			}
			var query = msg.message.text.split(' ')
			if(query.includes('Final')){
				query[1] = 1
				game = "Final Game ";
			}else
				game = "Game " + parseInt(query[1]) +" ";
			round = JSON.parse(map.get('tournament')).round
			map.get(parseInt(query[1])).forEach(p=>{
				if(typeof(p) !== 'object' && i < 5)
					players[i] = p
				i++
			});
			tournamentPlayers = JSON.parse(map.get('tournament')).tournamentPlayers;
			if(!map.has(key))
				createDelPlayers("create",key);
			newPlayers = JSON.parse(map.get(key));
			newPlayers.players.forEach(p => names.push(p.name + " , "));
			if(!tournamentPlayers.includes(playerName))
	   			return bot.answerCallbackQuery(msg.id, { text: 'Wait for the next Tournament', show_alert: false });
			else if(tournamentPlayers.includes(playerName) && names.includes(`${playerName} , ` && newPlayers.totalPlayers > 2))
	   			return bot.answerCallbackQuery(msg.id, { text: 'Already Picked Yours', show_alert: false });
	   		else if(tournamentPlayers.includes(playerName) && !players.includes(playerName))
	   			return bot.answerCallbackQuery(msg.id, { text: 'Look For Your Own Game', show_alert: false });
			if(!newPlayers.totalPlayers)
				newPlayers.totalPlayers = players.length;
			map.set(key,JSON.stringify(newPlayers));
		}

		if(!map.get(key)){
			if(!msg.inline_message_id){
				var won = {
					message_id: msg.message.message_id,
	        		chat_id: msg.message.chat.id,
	        		reply_markup: JSON.parse(multiKeyboard(-1 , -1))
				}
			}
			else 
				var won ={
						inline_message_id: msg.inline_message_id,
	    				reply_markup: JSON.parse(multiKeyboard(-1 , -1))
					}
			return bot.editMessageText('This Game session has Expired , Please start another one', won);
		}
		const id = [];
		const picks =  [];
		var namesPick = '';
		newPlayers = JSON.parse(map.get(key));
		newPlayers.players.forEach( n => {
			id.push(n.id);
			picks.push(n.pick[0]);
			picks.push(n.pick[1]);
		});
		var n =id.indexOf(msg.from.id)
		if( (id.includes(msg.from.id) && newPlayers.players[n].pick[1]) || (id.includes(msg.from.id) && newPlayers.totalPlayers > 2)){
			bot.answerCallbackQuery(msg.id, {text: 'Already Picked Yours', show_alert: false });
			return;
		}	
		if(newPlayers.players[p - 1].pick[0] && (newPlayers.players[p - 1].id) !== msg.from.id){
			bot.answerCallbackQuery(msg.id, {text: 'Wait For Your Turn To Pick', show_alert: false });
	   		return;
		}
		else if ( newPlayers.players[ p - 1 ].pick[0] === h){	
			bot.answerCallbackQuery(msg.id, {text: 'You Cant Pick The Same Hand Twice , Choose Another One', show_alert: false });
	   		return;
		}
		else if( p > 1){
			if(picks.includes(h)){
	   			bot.answerCallbackQuery(msg.id, { text: 'Already Picked By The Other Player Choose Another One', show_alert: false });
	   			return;
			}
		}
		if(!newPlayers.players[ p - 1].pick[0] ){
			if(msg.chat_instance !== INSTANCE){
				await Games.findByIdAndUpdate(
					newPlayers.id , 
					{ $push: { players : playerName } })
			}

			newPlayers.players[ p - 1].pick[0] = h;
			newPlayers.players[ p - 1].name = playerName;
			newPlayers.players[ p - 1 ].id = msg.from.id;
			map.set(key,JSON.stringify(newPlayers));
			if(newPlayers.totalPlayers > 2)
				p++;
			if(!msg.inline_message_id)
				data ={
					message_id: msg.message.message_id,
		            chat_id: msg.message.chat.id,
		            reply_markup: JSON.parse(multiKeyboard("groupKeyboard" , p))
				}
			else
				data ={
						inline_message_id: msg.inline_message_id,
		                reply_markup: JSON.parse(multiKeyboard("inline" , p))
					}
			if(msg.chat_instance === INSTANCE){
				data ={
					message_id: msg.message.message_id,
		            chat_id: msg.message.chat.id,
		            reply_markup: JSON.parse(multiKeyboard("inline" , p))
				}
				if( newPlayers.totalPlayers < 3 ) {
					players.forEach( p => playerNames += p + " , " )
					return bot.editMessageText(game + "\n" + 
						playerNames + "\n" +
						playerName + " Pick a Second One ", data)
				}
				else if(p <= newPlayers.totalPlayers){
					newPlayers.players.forEach(p => names.push(p.name + " , "));
					var index = players.indexOf(playerName);
					playerNames = '' ;
					players.forEach( p => {
						if(!names.includes(`${p} , `))
							playerNames += p + " , " 
					})
					return bot.editMessageText( game + "\n" +
						playerNames.slice(0,-2) + " pick ", data)
				}
			}
			newPlayers.players.forEach(n => {
				if(n.name)
					if(newPlayers.totalPlayers < 3)
						namesPick += n.name + " is : " + hands[n.pick[0] -1 ] + " And " + hands[n.pick[1] - 1] +"\n";
					else
						namesPick += n.name + " is : " + hands[n.pick[0] -1 ] + "\n";
				})
			if( p > newPlayers.totalPlayers ){
				if(!msg.inline_message_id)
					data ={
						message_id: msg.message.message_id,
		                chat_id: msg.message.chat.id,
		                reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
					}
				else 
					data ={
						inline_message_id: msg.inline_message_id,
		                reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
					}
				return bot.editMessageText(game+ " \n" + namesPick +  "\nStart Playing " ,data)
			}
			else if(newPlayers.totalPlayers < 3)
				return bot.editMessageText(`Player ${p} Pick a Second One`, data )
			else
				return bot.editMessageText(`Player ${p} / ${newPlayers.totalPlayers}  Pick `, data)
		}
		else{
			if(!newPlayers.players[ p - 1 ].pick[1] && newPlayers.totalPlayers < 3){
				newPlayers.players[p - 1].pick[1] = h;
				map.set(key,JSON.stringify(newPlayers));
				newPlayers.players.forEach(n => {
				if(n.name)
					namesPick += n.name + " is : " + hands[n.pick[0] -1 ] + " And " + hands[n.pick[1] - 1] +"\n";
				})
				if( p > newPlayers.totalPlayers - 1){
					if(!msg.inline_message_id)
						data ={
							message_id: msg.message.message_id,
			                chat_id: msg.message.chat.id,
			                reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
						}
					else 
						data ={
							inline_message_id: msg.inline_message_id,
			                reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
						}
					return bot.editMessageText(game + " \n" + namesPick +  "\nStart Playing " ,data)
				}
				if(msg.chat_instance === INSTANCE){
					p++;
					players.splice(players.indexOf(playerName) , 1)
					players.forEach( p => playerNames += p + " , " )
					if(!msg.inline_message_id)
					data ={
						message_id: msg.message.message_id,
			            chat_id: msg.message.chat.id,
			            reply_markup: JSON.parse(multiKeyboard("inline" , p))
					}
					else
					data ={
							inline_message_id: msg.inline_message_id,
			                reply_markup: JSON.parse(multiKeyboard("inline" , p))
						}
					return bot.editMessageText(game + "\n" + 
						playerNames.slice(0, -2) + " Pick ", data)
				}
				else{
			    	p++;
		    		if(!msg.inline_message_id)
			    		data = {
							message_id: msg.message.message_id,
			                chat_id: msg.message.chat.id,
			                reply_markup: JSON.parse(multiKeyboard("groupKeyboard",p))
						}
					else
						data ={
							inline_message_id: msg.inline_message_id,
			                reply_markup: JSON.parse(multiKeyboard("inline",p))
						}
					return bot.editMessageText(`Player ${p} / ${newPlayers.totalPlayers} Pick `, data )	
				}
			}
		}
	}catch(error){
		console.log("from pickHands" , error.message)
	}
}
const compareHandsWithPlayer =  async ( msg , h ) =>{
	try{
		var game = ''
		if(msg.chat_instance === INSTANCE){
			if(!map.get('tournament')){
				return bot.editMessageText("This Tournament Has Ended." ,{ 
					message_id: msg.message.message_id,
		            chat_id: msg.message.chat.id
		        })
			}
			round = JSON.parse(map.get('tournament')).round
			var query = msg.message.text.split(' ')
			if(query.includes('Final')){
				query[1] = 1
				game = "Final Game ";
			}else
				game = "Game " + parseInt(query[1]) +" ";
		}
		var key = getKey(msg);
		if(!map.get(key)){
			if(!msg.inline_message_id){
				var won = {
					message_id: msg.message.message_id,
	        		chat_id: msg.message.chat.id,
	        		reply_markup: JSON.parse(multiKeyboard(-1 , -1))
				}
			}
			else 
				var won ={
						inline_message_id: msg.inline_message_id,
        				reply_markup: JSON.parse(multiKeyboard(-1 , -1))
					}
			return bot.editMessageText('This Game session has Expired , Please start another one', won);
		}
		newPlayers = JSON.parse(map.get(key));
		const id = [];
		const picks = [];
		var namesPick = "";
		var names = [];
		var scores = "";
		await newPlayers.players.forEach( async (n) => {
			id.push(n.id);
			if(n.name){
				scores += n.name + " : " + n.score + "\n" ;
				if(!n.turn)
					await names.push(n.name + " , ");
				if(newPlayers.totalPlayers < 3)
					namesPick += n.name + " is : " + hands[n.pick[0] -1 ] + " And " + hands[n.pick[1] - 1] +"\n";
				else 
					namesPick += n.name +  " is : " + hands[n.pick[0] -1 ] + "\n"
				if(n.score === ENDPOINT)
					return;
			}
			picks.push(n.pick[0]);
			if(newPlayers.totalPlayers < 3)
				picks.push(n.pick[1]);	
		});

		if(id.includes(msg.from.id)){
			var n = id.indexOf(msg.from.id)
			if(newPlayers.players[n].turn){
				return bot.answerCallbackQuery(msg.id,{text: ' Wait For Others ', show_alert: false });
			}
			newPlayers.players[n].turn = h;
			await names.splice(names.indexOf(newPlayers.players[n].name + " , "),1)

			var result = 0;
			newPlayers.turned++;
			var text = "" , updatedScores = "";
			var handsReveal = "Hands Drawn : " ;
			if(!msg.inline_message_id)
				var data = {
					message_id: msg.message.message_id,
	        		chat_id: msg.message.chat.id,
	        		reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
				}
			else
				var data ={
						inline_message_id: msg.inline_message_id,
		                reply_markup: JSON.parse(multiKeyboard("startPlaying" , 1))
					}
			map.set(key,JSON.stringify(newPlayers));
			if( newPlayers.turned < newPlayers.totalPlayers ){
				if(msg.chat_instance === INSTANCE)
					return bot.editMessageText( game + "\n" + namesPick + "\n" + scores + "\n" +
						"Waiting for " + names.toString().slice(0 , -2 ) + " ..." , data);
				else
					return bot.editMessageText( namesPick + "\n" + scores + "\n" + 
						"Waiting for " + names.toString().slice(0 , -2 ) + " ..." , data);
			}
			else if( newPlayers.turned === newPlayers.totalPlayers){
				var handSign;
				newPlayers.players.forEach( p => {
					if(p.turn){
						result += p.turn
						handSign = handSigns[[(p.turn) - 1]];
						handsReveal += `${handSign} ,`;	
					}
				});
				if(!(result %= 5))
					result = 5;
				for(var i = 0 ; i < newPlayers.totalPlayers ; i++ ){
					if(newPlayers.players[i].pick.includes(result)){
						newPlayers.players[i].score += 1;
						var winner = newPlayers.players[i].name;
						text = hands[result - 1] + "! ," + winner + "'s point.";
						map.set(key,JSON.stringify(newPlayers));
						if(newPlayers.players[i].score >= ENDPOINT){
							if(msg.chat_instance === INSTANCE){
								var playerName = newPlayers.players[i].name;
								tournamentStatus = JSON.parse(map.get('tournament'));
								tournamentPlayers = tournamentStatus.tournamentPlayers;
								newPlayers.players.forEach( p => {
									var index = tournamentPlayers.indexOf(p.name);
									tournamentPlayers.splice(index , 1);
								})
								tournamentPlayers.push(playerName);
								tournamentStatus.amountOfGames--;
								map.set('tournament',JSON.stringify(tournamentStatus));
								if(tournamentPlayers.length === 1){
									map.delete('tournament')
									return bot.editMessageText( handsReveal.slice( 0 , -1 ) + "\n" 
									+ text + "\n🎉 " + newPlayers.players[i].name +
									 " is the Winner of The Tournament!! 🎉 " ,{
									 	message_id: msg.message.message_id,
					        			chat_id: msg.message.chat.id
					        		}).then((result) => 
										bot.pinChatMessage(USERNAME , result.message_id));
					        	}
								else
									bot.editMessageText( handsReveal.slice( 0 , -1 ) + "\n" 
									+ text + "\n➡️ " + newPlayers.players[i].name + 
									" Passed to Round " + ( round + 1) + " ➡️", {
										message_id: msg.message.message_id,
					        			chat_id: msg.message.chat.id
					        		});
								if(tournamentStatus.amountOfGames === 0){
									tournamentStatus.round++ ;
									map.set('tournament',JSON.stringify(tournamentStatus));
									tournament(msg , "next");
								}
								return;
							}
							else {
								if(!msg.inline_message_id){
									var won = {
										message_id: msg.message.message_id,
						        		chat_id: msg.message.chat.id,
						        		reply_markup: JSON.parse(multiKeyboard(-1 , -1))
									}
								}
								else 
									var won ={
											inline_message_id: msg.inline_message_id,
			                				reply_markup: JSON.parse(multiKeyboard(-1 , -1))
										}
								map.delete(key);
								return bot.editMessageText( handsReveal.slice( 0 , -1 ) + "\n"
								 + text + "\n" + newPlayers.players[i].name + " Won", won );
								
							}
						}
					}
					updatedScores += newPlayers.players[i].name + " : " + newPlayers.players[i].score + "\n" ; 
				}
				newPlayers.players.forEach( p => p.turn = 0);
				newPlayers.turned = 0;
				map.set(key,JSON.stringify(newPlayers));
				if(!picks.includes(result))
					if(newPlayers.previousHands === handsReveal)
						return 0;
					else {
						newPlayers.previousHands = handsReveal;
						if(msg.chat_instance === INSTANCE)
							return bot.editMessageText( game + "\n" 
								+namesPick + "\n" + handsReveal.slice( 0 , -1 ) + "\n" 
								+ hands[result - 1] + "! ," +" No'ones point." + "\n" + updatedScores , data)
						else
							return bot.editMessageText( namesPick + "\n" + handsReveal.slice( 0 , -1 ) + 
								"\n" + hands[result - 1] + "! ," +" No'ones point." + "\n" + updatedScores , data)
					}
				else{
					if(msg.chat_instance === INSTANCE)
						return bot.editMessageText(game + "\n" + namesPick + "\n" + handsReveal.slice( 0 , -1 ) + 
							"\n" +  text + "\n" + updatedScores , data)
					else
						return bot.editMessageText( namesPick + "\n" + handsReveal.slice( 0 , -1 ) + 
							"\n" +  text + "\n" + updatedScores , data)
				}
			}
		}
		else 
			return bot.answerCallbackQuery(msg.id, {text: ' You Can Play In The Next Round , until then why not practice in the Bot ' , show_alert: false });
	}catch(error){
		console.log("from compareHandsWithPlayer" , error.message)
	}
}
const tournament = async ( msg , state) =>{
	try{
		var keyboard = multiKeyboard("inline" , 1);
		tournamentStatus = JSON.parse(map.get('tournament'));
		tournamentPlayers = tournamentStatus.tournamentPlayers;
		tournamentStatus.amountOfGames = Math.ceil(tournamentPlayers.length / 5);
		if(state === 'new'){
			var tournament = await Tournaments.countDocuments() + 1;
			tournament = "Tournament " + tournament ; 
			const newGame = await Tournaments.create({
				newGame : tournament,
				players : tournamentPlayers});
		}
		let players =[];
		var data = { reply_markup: JSON.parse(keyboard)};
		let names ='';
		let text = '';
		if(tournamentPlayers.length > 5)
			text = "Round " + tournamentStatus.round;
		else
			text = "Final Round"
		await bot.sendMessage(USERNAME , text).then((result) => 
			bot.pinChatMessage(USERNAME , result.message_id));
		
		for(let i = 0 ,j = 0; i <= tournamentPlayers.length && tournamentPlayers.length >= 5; i++){
			if( i % 5 === 0 && i > 0){
				let game = "Game " + (j+1) +" ";
				if(tournamentPlayers.length <= 5 )
					game = "Final Game "
				map.set(j+1, players);
				await bot.sendMessage(USERNAME,game  + "\n" +
						names.slice(0,-2) + " , start picking", data).then((result) => {
						players[5] = result;
						map.set(j+1, players);
					});
				j++;
				players = [];
				names = '';
			}
			if( !tournamentPlayers[i] )
				break;
			names += tournamentPlayers[i] + " , ";
			players[i] = tournamentPlayers[i] ;
		}
		if(tournamentPlayers.length % 5 === 1){
			tournamentStatus.amountOfGames--;
			map.set('tournament', JSON.stringify( tournamentStatus))
			bot.sendMessage(USERNAME,"➡️ " + tournamentPlayers[tournamentPlayers.length-1] + 
				" Has passed to Round " + (tournamentStatus.round+1)) + "➡️";
		}
		else if(tournamentPlayers.length % 5 > 1){
			var i = 0;
			players = []
			names = '';
			index = tournamentPlayers.length % 5;
			while(i < index){
				players[i] = tournamentPlayers[tournamentPlayers.length-1-i];
				names += players[i] + " , "
				i++;
			}
			let game = "Game " + tournamentStatus.amountOfGames +" ";
			if(tournamentPlayers.length <= 5 )
				game = "Final Game "
			await bot.sendMessage(USERNAME, game  + " \n" + names.slice(0,-2) +
				 " , start picking", data).then((result) => {
						players[5] = result;
						map.set(tournamentStatus.amountOfGames, players);
					});;		
		}
		map.set('tournament', JSON.stringify( tournamentStatus))
	}catch(error){
		console.log("from tournament" , error.message)
	}
}

module.exports = bot;
