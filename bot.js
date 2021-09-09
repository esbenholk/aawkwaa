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
} else {
   bot = new TelegramBot(token, { polling: true });
}


let missions = ["Go home and pet your neighbours cat","Find my van and buy a dip", "recite the whole lord of the rings movie (all 3), and do it backwards afterwards", "Tell your crush you love him/her", "Call your parents and tell them you are running away from home", "Call your boss and tell him his an a-hole", "Look under your shoes and tell me what you see", "Treat yo self - Go eat a snickers", "fail at a handshake.", "Go wash your face 10 times at the bathroom", "Look into the toilet for 1 minute", "Read a book in 1 minute", "Kiss yourself", "Pursuit happiness in 10 seconds", "Pursuit sadness in 5 seconds", "Prove you are a human", "Convince yourself a lie", "Kiss the school", "Steal Jesper’s dream last night", "Yell “I love you guys” at the school canteen at lunchtime", "Yell “I love you guys” at the school canteen at lunchtime", "Practice some juicy black magic", "Pick another random person and both speak in your native language for 30 seconds", "Prove earth is flat", "Sing a song", "Walk like a bird", "Tell the Netto assistant how much you love them", "Purchase some Covid", "Ride a ladybug", "Go to Sweden", "Hug your favorite building", "spread a rumour about Rene Dip", "say your name backwards", "Go outside and enjoy the rain", "Collect some delicious dust", "Be angrier everyday", "Sing your favorite soundtrack", "Tell me your vaguest secret", "Walk like a human", "Talk like a human"]
let answers = ["I have a cat in my basement","I like tacos","Have some dip!","YOU SHALL NOT PASS","You are the honey to my bee","I love you with all my feet","You are prettier than a burnt egg on a Monday morning","I love you to the taco van and back again!","You make my heart flutter with salsa!","You are the cheese to my nachos!","You and I are like fish and marmalade, we just don’t match! - You are the fish of course!","You are like surströmming, nobody wants to be in the same room as you","You are like an amusement park - you make my stomach really sick!","I like locking people up… wait what?","I eat dip for breakfast!","Dip(s) for you!!! <3","I like to have a dip in the water", "They see me dippin, they hatin", "Do you mind if i dip in?", "Would you like some dip for your taco?", "When b*tches see me dippin, they be trippin!"]

bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Hello " + msg.chat.first_name + "it's me Rene Dip");
  bot.sendMessage(msg.chat.id, "And welcome to my taco van! I have a menu full of - nothing! But you can ask me for a mission, and I will provide you with a bound-to-be failed mission! Just write -- /mission -- and see for yourself if you’re able to do the task. Your stomach may not be filled with delicious tacos, but your heart will definitely be filled up with the feeling of sadness and disaster! Doesn't that sound great? Good! let’s begin!");

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "use /mission to interact with me");

});

bot.onText(/\/mission/, (msg) => {



  var randMission = missions[Math.floor(Math.random() * missions.length)];

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, randMission);

  bot.sendPhoto(msg.chat.id, "https://random.imagecdn.app/500/500")


  setTimeout(  bot.sendMessage(msg.chat.id, "did you /succeed ? or did you /fail ?"), 15000 );

});

bot.onText(/\/succeed/, (msg) => {


  var randAnswer = answers[Math.floor(Math.random() * answers.length)];

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, randAnswer);
  bot.sendMessage(msg.chat.id, "you want more missions? get /mission or say /goodbye");

});

bot.onText(/\/fail/, (msg) => {


  var randAnswer = answers[Math.floor(Math.random() * answers.length)];

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, randAnswer);
  bot.sendMessage(msg.chat.id, "you want more missions? get /mission or say /goodbye");

});









bot.onText(/\/goodbye/, (msg) => {
  bot.sendMessage(msg.chat.id, "Farewell " + msg.chat.first_name );
  bot.sendMessage(msg.chat.id, "lol" );
  bot.sendMessage(msg.chat.id, "Bye Bitch " );

});

bot.onText(/\/help/, (msg) => {

  bot.sendMessage(msg.chat.id, "Are you confused " + msg.chat.first_name + "?");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "i usually just go with the flow. Follow instructions and keep it simple: send me an image. make sure its not a movie or a gif. ");


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

  bot.sendMessage(msg.chat.id, 'Wanna /FeedMe some more?, or /SayGoodbye already');


}


///express app config for deployed Telegram Bot
const app = express();

app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});