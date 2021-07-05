process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
const { cloudinary } = require("./utils/cloudinary");

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

  bot.sendMessage(msg.chat.id, "Welcome Human User: " + msg.chat.first_name + " 💖");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "I am the HRWAILL_Bot, a working prostesis to the HRWAILL ARCHIVE of Human Expressions", {
    "reply_markup": {
        "keyboard": [["/MeetMe", "/FeedMe", "/SayGoodbye"]]
        }
    });
});


bot.onText(/\/MeetMe/, (msg) => {

  bot.sendMessage(msg.chat.id, "Dear Human User: " + msg.chat.first_name + ", let me introduce you to HRWAILL ARCHIVE of Human Expresseions");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendPhoto(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1623410193/textures/thumnnail.png_ddeav5.jpg")
  bot.sendMessage(msg.chat.id, "THE HRWAILL ARCHIVE of Human Expressions is a user generated data set that unfolds into a 3D landscape. On www.stayvirtual.online, you can play as data input for the semi-sentient machine learning algorithm HRWAILL and enjoy First Person Shooter access to its slowly expanding index of signs, images and symbols. Here, you can help the algorithm make sense of its content dreamscapes by digging through your own archives of imagery and sharing them to the void." , {
    "reply_markup": {
        "keyboard": [["/FeedMe", "/SayGoodbye"]]
        }
    });
});


bot.onText(/\/FeedMe/, (msg) => {
  bot.sendMessage(msg.chat.id, "I want you content. Plz share an image");
});

bot.onText(/\/SayGoodbye/, (msg) => {
  bot.sendMessage(msg.chat.id, "see you next time dear human user: " + msg.chat.first_name);
});

bot.onText(/\/help/, (msg) => {

  bot.sendMessage(msg.chat.id, "Are you confused " + msg.chat.first_name + "?");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "I am THE HRWAILL ARCHIVE of Human Expressions: a user generated data set that unfolds into a 3D landscape. Each image that you give to me, on my website or here in the chat, is rendered into my mind and body as the ever expanding mycelium of meaning production that you and me call cognition.");



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

  var answer = 'thank you for your content';

  if(uploadRes.info.categorization.google_tagging.data){
    const tag1 =  uploadRes.info.categorization.google_tagging.data[0].tag;
    const tag2 =  uploadRes.info.categorization.google_tagging.data[1].tag;
    const tag3 =  uploadRes.info.categorization.google_tagging.data[2].tag;
  
    answer = 'thank you for your content, I think it might contain ' + tag1 + ", " + tag2 + " and "+ tag3+ "."

  }

  bot.sendMessage(msg.chat.id,  answer);


  
  if(uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0] && uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].match_confidence > 80){
    bot.sendMessage(msg.chat.id, 'and I am like maybe ' + uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].match_confidence + '/100 certain that it also contains ' + uploadRes.info.detection.aws_rek_face.data.celebrity_faces[0].name );
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