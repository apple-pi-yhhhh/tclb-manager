//モジュールとか
const http = require("http");
const fs = require('fs');
const os = require('os');
const querystring = require("querystring");
const discord = require("discord.js");
const { Client, Intents, MessageEmbed,MessageActionRow, MessageButton, TextChannel, ButtonInteraction, InteractionCollector, Interaction, CommandInteraction } = require("discord.js");
const { entersState, AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel,  StreamType } = require('@discordjs/voice');
const options = { intents: ["GUILDS", "GUILD_MESSAGES"] };
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

//BOTのいろいろ
const token = "OTQ2NTgwODI2Nzc3MzU0MjUy.YhgyFw.F_GvLyH_GCLhsm3blITWv4BZE7c";
const id = "946580826777354252";
const prf = "//"
const cmds = {
	"update": {
		cmd: "update",
		function: "update_cmd",
	}
}

//functionたち
function log(a){ console.log(a) }
function someActivity(){
  //アクティビティを時間ごとに変更するプログラムを書く。
}

//起動時
client.on("ready", () => {
	console.log("Bot準備完了！");
	client.user.setActivity(someActivity(), {
		type: "WATCHING",
	});
});

//メッセージ
client.on("messageCreate", async message => {
	try { if(message.author == client.user) { return }
		//認証
		if (message.content == "申請"/* && message.channel.id == "892785349993046067"*/){
			var pass = Math.random().toString(36).slice(-8);//コードのランダム生成
			const tryConectingMsg = await message.channel.send(`認証をします。15秒以内に「${pass}」と入力して送信してください。`);//メッセージの送信
			message.channel.sendTyping();//「_が入力中...」の開始
			await message.channel.awaitMessages({ max: 1, time: 15000 })//15秒間送信を待つ
			.then(collected => {//メッセージが送信されたとき
				if(collected.first().content==pass){//コードが正しいとき
					message.member.roles.add(message.guild.roles.cache.find(role => role.name === '部員'))//ユーザーに全員のロールを追加
					collected.first().delete();
					message.react("✅");//「申請」のメッセージにリアクション
					tryConectingMsg.edit('認証が完了しました。');
				}else if(collected.first()){//コードが間違っているとき
					collected.first().delete();
					message.react("❎");//「申請」のメッセージにリアクション
					tryConectingMsg.edit("コードに誤りがあります。\nセッションを終了しました。\nもう一度「申請」と入力して送信してください。");
				}
			})
			.catch(collected => {//メッセージが送信されなかったとき
				message.react("❎");//「申請」のメッセージにリアクション
				tryConectingMsg.edit('タイムアウトしました');
			})
		}
		//コマンドたち
		for(key in cmds){
			if(!message.content.indexOf(prf+cmds[key].cmd)){
				eval(`${cmds[key].function}(${message})`);
			}
		}
		  /*
		 if (message.mentions.has(client.user) && message.mentions.has(client.users.fetch('946580826777354252'))) {
			message.channel.send("メンションを検知したため、仮BANにしました。")
			const role = message.guild.roles.cache.find(role => role.name === '仮BAN')
			message.member.roles.add(role)
			message.member.roles.remove()
		 }
		 */

		 } catch (error) {
			 const embed = new MessageEmbed()
			 .setTitle("例外処理されていないエラーが発生しました。")
			 .setColor("#FFAC33")
			 .addField("詳細：", "```" + error + "```")
			 .setTimestamp();
			 message.channel.send({
				 embeds: [embed]
			 });
			 console.error(error);
		 }
});
client.login(token);

//コマンドのファンクションたち
function update_cmd(msg){
	msg.channel.send(message.content);
}