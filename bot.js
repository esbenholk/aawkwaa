process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
const { cloudinary } = require("./utils/cloudinary");

const greetings = ["hi", "hello", "greetings", "ciao", "bonjour", "hej"]
const goodbyes = ["goodbye", "farewell", "over", "bye", "fuck off"]


require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
let bot;

if (process.env.NODE_ENV === 'production') {
   bot = new TelegramBot(token);
   bot.setWebHook(process.env.HEROKU_URL + bot.token);
   console.log("on production:", process.env.HEROKU_URL + bot.token);
} else {
   bot = new TelegramBot(token, { polling: true });
   console.log("not on production:", token);

}



bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Welcome Human User: " + msg.chat.first_name + " <3.");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "Send me images and then I will try to decode them and add them to my expanding dataset current live on www.stayvirtual.online");



});

bot.on('photo', (msg) => {
  var file_id  = (msg.photo[msg.photo.length-1].file_id);

  console.log("picture sent", msg);
  uploadImage(file_id, msg)
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(msg.chat.id, 'processing you content');
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
});



async function uploadImage(file_id, msg){
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  const image_url = await bot.getFileLink(file_id)
  
  const uploadRes = await cloudinary.uploader.upload(image_url, {
      upload_preset: "contentRedistribution",
      detection: "aws_rek_face",
      categorization: "google_tagging",
      public_id:
        "file_" +
        Math.random().toString(36).substring(2) +
        "_from_" + msg.chat.username,

    });

  const tag1 =  uploadRes.info.categorization.google_tagging.data[0].tag;
  const tag2 =  uploadRes.info.categorization.google_tagging.data[1].tag;
  const tag3 =  uploadRes.info.categorization.google_tagging.data[2].tag;

  const answer = 'thank you for your content, I think it might contain ' + tag1 + ", " + tag2 + " and "+ tag3+ "."

  bot.sendMessage(msg.chat.id,  answer);
  
  if(uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0] && uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].match_confidence > 80){
    bot.sendMessage(msg.chat.id, 'and I am like maybe' + uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].match_confidence + '/100 certain that it also contains ' + uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].name );
  } else if(uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0] && uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].match_confidence < 80){
    bot.sendMessage(msg.chat.id, 'and I am pretty unsure about this one, but maybe this is ' + uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].name +'?');
  }

}


///express app config for deployed Telegram Bot
const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});