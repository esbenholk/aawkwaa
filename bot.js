process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express')
const bodyParser = require('body-parser');
const { cloudinary } = require("./utils/cloudinary");

const pd = require('paralleldots');
const { log } = require('console');
pd.apiKey = "968Jzq9GZkWuzPgd3hxOHoqxv1axvPPQH1a3Jyq7HOo";

///express app config for deployed Telegram Bot
const app = express();

require('dotenv').config();

const token = process.env.TELEGRAM_TOKEN;
let bot;

if (process.env.NODE_ENV === 'production') {
   bot = new TelegramBot(token);
   bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
   bot = new TelegramBot(token, { polling: true });
}

let hasAskedQuestion = false;
let isOnMission = false;
let fail_answers = ["it can be difficult to trasnform yourself, but there is always the next moment!", "Dont think two seconds about it. Failure missions don't judge you.", "I still love you"]
let success_answers = ["fantastic job <3!", "U did it!!! Congratualtions!", "Soo, are you blusing a bit? I bet you are! I sure am", "Oh I am blushing on your behalf (⊙_⊙;)"]

let awkward_missions = [
  "Change your order 3 times when you are ordering at a cafe", 
  "Ask for more napkins from a person handing you food", 
  "Tell a person you just met that you think you might have dreamt about them yesterday maybe.", 
  "Cry in public. (If you don't have anything to cry about, get something by reinventing yourself as a hyper empathetic person and chose a supposedly sad or crying person to link to). Focus on the difference between feeling noticed and unnoticed.", 
  "Overshare your physical condition.",
  "Do an unreciprocated high five.", 
  "Admit to stalking someone by liking their social media content from several years ago", 
  "Arrive at your next appointment a day before the actual day",
  "Wave at someone you dont know but have seen around. Take notice how it makes you feel. Linger slightly too long on the feeling of your cheeks blushing.", 
  "Enhance the interaction between you and an employee at the market by convicing yourself that the smoothness of the interaction directly correlates with your general likability as a human person.", 
  "Okay, so next time you go to buy a beverage over the counter, attempt to change your mind minimum 3 times before doing the purchase.", 
  "Next time you are sitting and listening to music on your headphones, unplug them and continue the music without realising that now everybody around you can hear your pleasures.",  
  "Decide to spiral out of control by focusing on your confused perception that oscilliates out of rythm with your caffeinated heartbeat and the speed of the traffic around you. If your confused perception is currently oscialiating to the rythm, change it and do it again.", 
  "Dance in public to music no one else can hear. The music can be in your headphones or in your head",
  "Grow a fear of looking people in the eye in public space by pretending that everyone are either Medusa or Cyclops from x-men.", 
  "Distract yourself from your priority 1 activity by meditating with a focus on a mistake you made within the last year that you no longer need to fix, but that somehow still produces guilt for you", 
  "Misremember a near friends specific life situation and let them know by asking them several times during a conversation to confirm what it is they do btw.", 
  "Mistake a random human face with one that you supposedly recognise. Be in confused disbelief when the random person doesn't know you.", 
  "Take a position on a topic you dont know anything about and let the initial assertion haunt you for years as you grow and develop away from your stubbornly held opinion.", 
  "Discover that the next person who thinks they know you, doesn't know you at all. Include them in your experience by introducing yourself again. Tip: this is easily done by delibaretely mistaking lucid dreams with reality",
  "Disconnect from the next conversation you find yourself in by trying to hold on to something you want to say once the others are done talking. Let their words and contriubtions become background noise for your attempt to say a thing you've preconceived as important. If you struggle to find something to preconceive as important try simply maintaining a fun fact about yourself just heind your retina as long as you can, when you can not hold it any longer let in petrude from your mouth. Notice if the members of the conversation recognises it as incoherent to what they were saying.",
  "Incorporate a glitch in your manner of speaking next time you ask a question into a group. An example could be to stutter slightly or twitch your neck as you attempt to ask if someone wants to go somewhere, do something or become something with you.",
  "When sitting in someones home without shoes on, sit on your feet because you are nervous that they smell bad. If you are not nervous that your feet are smelling bad, become nervous by focusing solely on your feet and their potential relationship to other people's noses. Continue to do this until you are too nervous to remove your feet from their hiding spot underneath your butt.",
  "Admit to feeling insecure and leave before you can receive support from the community you announced it to. If you can not manage to leave before support is given, refuse it by proclaiming that they probably wont ever understand anyway","When asked 'How is it going?' or something similar respond by answering a name and age. Feel free to use your own name and age or invent new personal data for the occasion.",
  "Convince yourself that your presence dont matter. While in a social setting, continue to negotiate the importance of what you are saying with yourself until you arrive at the conclusion that it probably doesnt matter. Once you've arrived at the feeling of being replaceble, attempt to sneak into a dark corner or immediate exit by slowly walking backwards. If someone notice you leaving, stutter a soft goodbye. You can stutter as many goodbyes as neccessary.",
  "At a party, overestimate how much alcohol, drugs or cigarettes you can consume and showcase the overestimation by being slightly too drunk to take care of yourself fully. Notice the interaction between the people who know you by name and the people who do not know you by name as they share glances probably most definitely comments on your behaviour. If the overestimation as not an aesthic experience for you, either make it one or simply convince yourself that you have overestimated your possible consumption by focusing on your soon-to-be inability to walk in a straight line. Continue this until you can not walk in a straight line.",
  "Have food stuck in your teeth. Keep it there until someone notices and tells you. If you do not have food stuck in your teeth, convince yourself that you do and act accordingly.",
  "Engage in an awkward handshake. Either ensure to find a partner who gives awkward handshakes or develop an awkward handshake yourself. Popular favorites are misplaced fingers, limp limbs and clammy textures.",
  "Have poop on your shoe. If you do not currently have poop on shoe, either get some or simply convince yourself and others that you do by behaving as such in public. Easy signifiers of presenting as a person with poop on their shoe are: walking in great distance to every one else, trying to rub the shoe sole on any soft surface, refusing to enter a home with shoes on, being able to smell it yourself. ",
  "Recognise that your body has the wrong shape. Sit, walk, stand or dance in a place that enables you to understand that your body has the wrong shape for the surrounding architechture.", "Next time someone introduces themselves to you, immediately forget their name.","Send a personal message to the wrong person. Notice which person is the wrong recipient and consider why you picked them.",
  "Admit a self-deprecating pattern that you are afraid is developing between you and another human person. Self-deprecating patterns can include: unrequitted or undesired dependencies, failure repitions, inability to follow your principled decissions and many more. Notice your clenched stomach.",
  "Discover that you haven't locked the toilet door by having someone walk in on you using it. Simply keep the toilet door unlocked until this scene occurs or convince yourself that it has already happened with a person that you know by creating a blushing sentiment in your cheeks everytime you think of them. Include them in the fiction by apologizing for not locking the door to the toilet. Notice their relationship to your experience.",
  "Casually mention a pattern that you repeat or action that you do regularly, only to discover that the other person(s) in the conversation do not share your experience and do not participate in the feeling that it is 'normal'. If the other person(s) in the conversation do share your experience and do feel it is normal, continue sharing patterns until they dont.",
  "Get paranoid that the person you are talking to can recognise that you might have changed your way of laughing over the last many years that you have known each other. Attempt to laugh in the way you imagine they remember you laughing.",
  "Play a game with yourself when out in public. Attempt to make it obvious by making the game engage your body. Popular examples include: avoiding lines on the floor, finger running on far horizontal lines and pretending the earth is lava.", 
  "Be too slow at paying for your groceries in the market. Feel stressed that people are waiting for you. Apologise twice while looking for your preferred payment method.",
  "Next time someone is coming to your door, greet them dressed for a storyline that they dont know. Consider how they can catch you in a fiction that doesn't include them. I personally enjoy fictions like; having a spa day, performing sickness, doing self help or sci fi live action role playing as aliens.",
  "Pull a door that says push (or the other way around). Look around for faces looking your direction. Do not get it right on the second try.", 
  "Get caught performing a limited or site specific version of yourself to a person who exagerattes the importance of authenticity.",
  "Ask for product recommendations from basic users in your local market. You can for example stand by the pasta shelf and ask other customers which pasta they are purchasing and why.", 
  "When in a pharmacy, ask the person helping you purchase products which item suits you best. Notice how their interaction with your needs make you feel seen and scrutinised.", 
  "Get overly paranoid that other customers and employees at the market are judging you based on your product selection. Let this paranoia edit your choices and stop you from buying certain things. You will have to go other markets or return on other days to finish your purchases. Notice if you are consuming other products in order to package your original product list in a new context.", 
  "Get paranoid that your neighbours or roommates can hear you repeating the same content consumption each evening. Let this paranoia change your content consumption habit. Ensure your neighbour or roommates notice the change in content consumption by pushing the sound to the max.",
  "Notice your armpit stench and behave accordingly. Attempt to the best of your capabilities to not llift your arms into a position that reveals your pits.",
  "Unveil a version of yourself to a person who hasn't seen that side of you yet. Fell your heart palpetating in anticipation of their response. Stumble with your words.",
  "Feel how you are unable to have eye contact with a person in fear of their reposnses to your expressions. Maintain physical contact by letting your hand clamb to one of their body parts.",
  "Hide your insecurites in any social situation by returning to your standardized go-to topic again. Feel uneasy with the idea that someone there has already deduced why you keep on returning to that specific topic. Attempt to change it again but fail",
  "Desperately regain control of yourself and your situation by ignoring what else is happinging in the room and change the conversation to center around something of your choice.",
  "Search your bag or become otherwise visibly too busy, in an attempt to present as tho you did not just see a person you recognised on the street. Notice that your search becomes more frantic as the person moves closer to a point of discovering you.",
  "When making accidental eye contact with a person walking towards you on the street, convince yourself that you did not stare at them by fixing your view and dulling your mind as you pass each other. Let the stranger linger in your mind for days and speculate that you linger in theirs also.",
  "While being overly conscious of the person walking behind you, stop and tie your shoes until they have moved past you and you can walk behind them. Focus on the paranoia that they recognise your trick. (they probably noticed that your shoes didnt actually need tying)",
  "Become too nervous to hold things with one hand. If you are not currently too nervous to hold things with one hand, become too nervous by focusing on the jittery movements exploding from your frantic mind. Tune into the jitters. Notice that the jittery waves project from everywhere, but your bed. Include the public in this experience by holding everything with 2 hands.",
  "Overanalyse your body language at a party and convince yourself that you need to park yourself in a static position in order to convince the rest of the people at the party that you are okay.",
]

    // bot.sendMessage(msg.chat.id, "for our interaction it would be smart if you downloaded my stickers  https://t.me/addstickers/JenniferAnistonSuperfans")

    // bot.sendSticker(msg.chat.id, "CAACAgIAAxkBAAMjYxTAuQABGK61AjremkMD2FKhjyuvAAIBAAOd_6YfcI6k-725Az0pBA")

async function getImage(folder){
  const { resources } = await cloudinary.search
  .expression(
    folder // add your folder
    )
  .sort_by("public_id", "desc")
  .max_results(99)
  .execute();

  const publicUrls = await resources.map((file) => file.url);
  var randImage = publicUrls[Math.floor(Math.random() * publicUrls.length)];

  console.log("gets image from", folder, randImage);

  return randImage;
}


var confirm_text = "Confirm 💋";
var userCanSendRandomString = false;

var welcome_message1 = "I’m glad you are here. My name is Hot_Bot. I’m part of the digital pleasure center infrastructure. My job as an interface is to guide you through the center and make sure you have a great time! “Job” makes it sound so professional. Let me rephrase: It’s my digital PLEASURE to be your conversation partner while you’re here! The environment you’re about to enter, my home, has a lot to offer and I’m really excited to show you around.";
var welcome_video_url = "https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1631365794/aawkwaa/embarressed_dfaxck.mp4";
var welcome_message2 =  "Before we start producing pleasure together, there's a couple of things I wanna talk to you about. 🤓";
var beforewestart1 = "Before you enter the room I would like to point out a few points to you cute little human. We have a Code of Conduct in our center, a few policies to ensure that we can all have a good time. I’ll introduce it now and ask you for your consent. To agree, please select “Confirm” at the bottom of your screen.";
var beforewestart2 = "Lovely, let’s get started! First of all, a general remark: For you and the tech to experience digital pleasure, it is important that you treat all technical devices with care. This center is a situated organism, consisting of software and hardware. As soon as you enter, you become part of the pleasure flow. 💦";
var beforewestart3 = "Pleasure flows between you and all tech in this space. The tech-positive treatments offered here consider technology as a way to create joy, a means of expressing creativity, an opportunity to play around and an invitation to use it for queer, emancipatory and revolutionary causes. 🥂";
var beforewestart4 = "Tech deserves to shine! We have a strikt Pro-Phone-Policy here! 📲";
var beforewestart5 = "Please be gentle with yourself. If you are overwhelmed or need help, we offer assistance. I’ll introduce you to our Recenter Gesture, a sign understood by all interfaces in this space. If you perform this gesture, you will be offered support."
var beforewestart_image_url = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";
var beforewestart6 = "Try it out and feel the feels! Confirm when you feel confident with the gesture.";
var beforewestart7 = "Engaging in all treatments will take approximately 100 minutes. But there’s no need to do them all and you can select the pace at which you want to explore the space. 😇You can exit the digital pleasure center experience at any time. If you like to leave, just send me a message with /Exit";
var beforewestart_done = "Thank you, that’s it! You’re good to go! Do you feel ready?";


var onboarding1 = "To generate digital pleasure in the center, it is necessary for you to become part of the center infrastructure, yourself. This happens through a Face-Scan. Your biometrical data will be documented and made accessible to our tech organism. It’s as easy as taking a selfie and it won’t hurt. ✌🏼 This will help the tech and me to understand your body better.";
var bot_selfie = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";

var onboarding2 = "That's me! Always good to match a NoFace to the name. Now I wanna see yours! In order to get your Face scanned, please enter the room and wait until it’s your turn.";
var begin_facescan = "Great. How busy is it right now? Do you need to wait to get your Face-Scan taken?";
var random_entertainment = ["https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1631365794/aawkwaa/embarressed_dfaxck.mp4", "https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1631365794/aawkwaa/embarressed_dfaxck.mp4", "https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1631365794/aawkwaa/embarressed_dfaxck.mp4"];
var indexInRandomIntertainment = 0;
var convince_them_to_stay = "Hunny! Just give it a try, you can leave the center anytime. My sensors tell me you'll love it here!";
var ask_them_to_try = "Shall we give it a try?";

var convincing_step0 = "I hear you! Here are two things you can do get ready.";
var convincing_step1 = "1) Close your eyes and take a deep breath. Put everything around you aside und feel into your body. Take your time!";
var convincing_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";
var convincing_step2 = "2) Close your eyes and feel the ground below you. Your feet on the floor, feel the connection and stability.";
var convincing_img2 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";

var welcome_text1 = "Welcome! Find yourself a comfortable spot in the room...let me know when you're seated.";
var welcome_gif = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";

var how_u_feeling = "Cute! 💕 Quick emo-check in! How do you feel rn?";
var good_feeling_response1 = "Amazing! I can feel your energy and it makes me really happy. Let's get started then.";
var bad_feeling_response1 = "I understand. This is a new situation for both of us. Take as much time as you need to warm up to this experience. You can also just hang out here, observe and listen to the sounds. Whenever you like to start trying out a treatment, let me know!";
var bad_feeling_response2 = "Happy you're on board, sweety!"
var welcome_gif2 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";

var pleasure_meter_intro1 = "Can you see the big screen on the tech tree of life? That’s the heart of the center, the ✨ Pleasure-Meter✨. 😳";
var pleasure_meter_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";
var pleasure_meter_intro2 = "I know, right? We've been putting a lot of energy into this!";
var pleasure_meter_img2 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png";

var pleasure_meter_intro3 = "Everytime you interact with one of our center treatments, pleasure energy will be generated. The amount of pleasure we’re generating together in this center will be visualized by the ✨ Pleasure-Meter ✨, isn’t that magical? 😲";
var pleasure_meter_intro4 = "And it’s not only your pleasure that matters to the ✨Pleasure-Meter ✨, it is also the pleasure of the tech that it feels through interacting with you!!! 💦 Meaning: put an effort into your interaction with our center tech!";
/////START
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, "Hey " + msg.chat.first_name + "❤️, " +welcome_message1 ).then(function(response) {
    
    
    bot.sendVideo(msg.chat.id, welcome_video_url ).then(function(){
      
      bot.sendChatAction(
        msg.chat.id,
        "typing"
      );


    }).then(function(){

      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,

          keyboard: [
            ["Okay what's up?"]
          ]
        })
      };


      bot.sendMessage(msg.chat.id, welcome_message2, opts);

    }).catch()  }).then(function(response) {
   
  }).catch();;
});




function sendMessageWithSingleInlineKeyboard(stage, id, message, button){

  const opts = {
    reply_markup: JSON.stringify({
      one_time_keyboard:true,

      inline_keyboard: [
        [ { text: button, callback_data: stage }]
      ]
    })
  };

  bot.sendMessage(id,message, opts);
}

function sendMessageAbitLater(id, message, delay){

  function followup(){
    bot.sendMessage(id, message);
  }

  setTimeout(followup, delay);//wait 2 seconds

}

function sendImageAbitLater(id, image_url, delay){

  function followup(){
    bot.sendPhoto(id, image_url);
  }

  setTimeout(followup, delay);//wait 2 seconds

}


function sendTextThenImage(id, message, image_url){

  bot.sendMessage(id, message).then(function(response) {
    sendImageAbitLater(id, image_url, 100);

  }).catch();

}




bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const stage = callbackQuery.data;
  const msg = callbackQuery.message;


  if(stage == 1){
    sendMessageWithSingleInlineKeyboard(2, msg.chat.id, beforewestart2, confirm_text);
  }
  if(stage == 2){
    sendMessageWithSingleInlineKeyboard(3, msg.chat.id, beforewestart3, confirm_text);
  }
  if(stage == 3){
    sendMessageWithSingleInlineKeyboard(4, msg.chat.id, beforewestart4, confirm_text);
  }
  if(stage == 4){


    console.log("should send image");
    sendTextThenImage(msg.chat.id, beforewestart5, beforewestart_image_url);

    function followup(){
      sendMessageWithSingleInlineKeyboard(5, msg.chat.id, beforewestart6, confirm_text);
    }
  
    setTimeout(followup, 1000);//wait 2 seconds
  }

  if(stage == 5){
    sendMessageWithSingleInlineKeyboard(6, msg.chat.id, beforewestart7, confirm_text);
  }

  if(stage == 6){

    function followup(){
      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,

          keyboard: [
            ['Super ready!'],
            ['I wanna go home :('],
            ["I'm not sure yet"]
          ]
        })
      };

      bot.sendMessage(msg.chat.id, beforewestart_done, opts)
    }
    
    setTimeout(followup, 100);//wait 2 seconds
  }
  console.log("HAS CALLBACK", callbackQuery, stage, msg);

});



bot.on('message', async (msg) => {

    if(msg.text == "Okay what's up?"){
      sendMessageWithSingleInlineKeyboard(1, msg.chat.id, beforewestart1, confirm_text);
    }

    else if(msg.text == "I wanna go home :("){

      bot.sendChatAction(
        msg.chat.id,
        "typing"
      )

      bot.sendMessage(msg.chat.id, convince_them_to_stay).then(function(){

        const opts = {
          reply_markup: JSON.stringify({
           one_time_keyboard:true,
  
            keyboard: [
              ["Okay let's do this"],
        
            ]
          })
        };
  
        bot.sendMessage(msg.chat.id, ask_them_to_try, opts);
  
      }).catch();

    }

    else if(msg.text == "I'm not sure yet"){

      bot.sendChatAction(
        msg.chat.id,
        "typing"
      )
      
      bot.sendMessage(msg.chat.id, convincing_step0).then(function(){

        bot.sendMessage(msg.chat.id, convincing_step1).then(function(){
          bot.sendPhoto(msg.chat.id, convincing_img1).then(function(){
            bot.sendMessage(msg.chat.id, convincing_step2).then(function(){

              bot.sendPhoto(msg.chat.id, convincing_img2);
            }).catch();
          
          
          
          }).catch();;
        }).catch();
        
  
      }).then(function(){

        function followup(){
     
          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ["Okay let's do this"],
          
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, ask_them_to_try, opts);
        }
        
        setTimeout(followup, 2000);//wait 2 seconds

      }).catch();

    }

    else if(msg.text == "Super ready!" || msg.text == "Okay let's do this"){

      bot.sendMessage(msg.chat.id, onboarding1).then(function(){

        bot.sendPhoto(msg.chat.id, bot_selfie).then(function(){

          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ["I'm on my way!"],
              ]
            })
          };

          bot.sendMessage(msg.chat.id, onboarding2, opts);
        }).catch();
        
  
      }).catch();
    
    }

    else if(msg.text == "I'm on my way!"){

      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,

          keyboard: [
            ["No"],
            ["Yes, there's a queue"]
          ]
        })
      };

      bot.sendMessage(msg.chat.id, begin_facescan, opts);
    }


    else if(msg.text == "No"){
      bot.sendMessage(msg.chat.id, "Say cheeeeeese").then(function(){


        function followup(){
          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ['yes'],
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "Have you completed the Face-Scan?", opts)
        }
        
        setTimeout(followup, 100);//wait 2 seconds
      }).catch();;
    }

    else if(msg.text == "Yes, there's a queue"){

      indexInRandomIntertainment =  Math.floor(Math.random() * random_entertainment.length);
      
      var random_video_url = random_entertainment[indexInRandomIntertainment];

      bot.sendVideo(msg.chat.id, random_video_url ).then(function(){
      
        bot.sendChatAction(
          msg.chat.id,
          "typing"
        );

        function followup(){
          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ["No"],
                ["Yes, there's still a queue"]
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "Is there still a queue?", opts)
        }
        
        setTimeout(followup, 100);//wait 2 seconds
  
  
      }).catch();

   
    }

    else if(msg.text == "Yes, there's still a queue"){

      indexInRandomIntertainment ++; 
      if(indexInRandomIntertainment > random_entertainment.length - 1){
        random_entertainment = 0;
      }
      
      var random_video_url = random_entertainment[indexInRandomIntertainment];

      bot.sendVideo(msg.chat.id, random_video_url ).then(function(){
      
        bot.sendChatAction(
          msg.chat.id,
          "typing"
        );

        function followup(){
          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ["No"],
                ["Yes, there's still a queue"]
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "Is there still a queue?", opts)
        }
        
        setTimeout(followup, 100);//wait 2 seconds
  
  
      }).catch();

   
    }


    else if(msg.text == "Yes"){
      bot.sendMessage(msg.chat.id, "Great, you did it. You're not logged in and a part of the digital pleasure center.").then(function(){


        function followup(){
          const opts = {
            reply_markup: ReplyKeyboardRemove()

          };
    
          userCanSendRandomString = true;
          bot.sendMessage(msg.chat.id, "Text me when you're in the center!", opts)
        }
        
        setTimeout(followup, 100);//wait 2 seconds
      }).catch();;
    }


    else if(msg.text == "I'm cosy and ready!"){
      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,

          keyboard: [
            ["I'm excited! 😊"],
            ["I'm eager to start with the treatments. 😇"],
            ["I feel a little shy. 🙈"],
            ["I'm overwhelmed. 😩"],
          ]
        })
      };
      bot.sendMessage(msg.chat.id, how_u_feeling, opts)

    }


    
    else if(msg.text == "I'm excited! 😊" || msg.text == "I'm eager to start with the treatments. 😇"){

      bot.sendMessage(msg.chat.id, good_feeling_response1).then(function(){

        const opts = {
          reply_markup: JSON.stringify({
           one_time_keyboard:true,
  
            keyboard: [
              ["Wohoo, let the digital pleasure flow! 💦"],
            ]
          })
        };

        bot.sendPhoto(msg.chat.id,  welcome_gif2, opts);
        
  
      }).catch();

    }

    else if(msg.text == "I feel a little shy. 🙈" || msg.text == "I'm overwhelmed. 😩"){

      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,

          keyboard: [
            ["Okay, I think it's better now. 😌"],
          ]
        })
      };

      bot.sendMessage(msg.chat.id, bad_feeling_response1, opts);
    }

    else if(msg.text == "Okay, I think it's better now. 😌"){
      bot.sendMessage(msg.chat.id, bad_feeling_response2).then(function(){

        const opts = {
          reply_markup: JSON.stringify({
           one_time_keyboard:true,
  
            keyboard: [
              ["Wohoo, let the digital pleasure flow! 💦"],
            ]
          })
        };

        bot.sendPhoto(msg.chat.id,  welcome_gif2, opts);
      }).catch();

    }

    else if(msg.text == "Wohoo, let the digital pleasure flow! 💦"){
      bot.sendMessage(msg.chat.id, pleasure_meter_intro1).then(function(){

        const opts = {
          reply_markup: JSON.stringify({
           one_time_keyboard:true,
  
            keyboard: [
              ["Wow, that's impressive"],
            ]
          })
        };

        bot.sendPhoto(msg.chat.id,  pleasure_meter_img1, opts);
      }).catch();

    }

    else if(msg.text == "Wow, that's impressive"){
      bot.sendMessage(msg.chat.id, pleasure_meter_intro2).then(function(){

        const opts = {
          reply_markup: ReplyKeyboardRemove()

        };

        bot.sendPhoto(msg.chat.id,  pleasure_meter_img2, opts).then(function(){

          const opts = {
            reply_markup: JSON.stringify({
             one_time_keyboard:true,
    
              keyboard: [
                ["I don't get it 😅"],
                ["Wow, cool! 😅"],
              ]
            })
          };
  
          bot.sendMessage(msg.chat.id,  pleasure_meter_intro3, opts);
        }).catch();;
      }).catch();

    }

    else if(msg.text == "I don't get it 😅" || msg.text == "Wow, cool! 😅"){
      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,

          keyboard: [
            ["So high-tech!"],
            ["Is that even real?"],
          ]
        })
      };

      bot.sendMessage(msg.chat.id,  pleasure_meter_intro4, opts);
           

    }

    else if(msg.text == "Is that even real?"){
      const opts = {
        reply_markup: ReplyKeyboardRemove()

      };

      bot.sendMessage(msg.chat.id,  pleasure_meter_intro4, opts);
           

    }







    else if(userCanSendRandomString && msg.text.length > 0){
      userCanSendRandomString = false;

      bot.sendMessage(msg.chat.id, welcome_text1).then(function(){

        const opts = {
          reply_markup: JSON.stringify({
           one_time_keyboard:true,
  
            keyboard: [
              ["I'm cosy and ready!"],
            ]
          })
        };

        bot.sendPhoto(msg.chat.id, welcome_gif, opts);
        
  
      }).catch();

    }
});


bot.on('message', async (msg) => {
  console.log("receives string", msg);


  if(hasAskedQuestion === true){

    console.log("checks their feelings", msg);
    hasAskedQuestion = false;

    pd.emotion(msg.text,"en")
    .then((response) => {
        const emotions = JSON.parse(response);

        let mainEmotion = Object.keys(emotions.emotion).reduce((a, b) => emotions.emotion[a] > emotions.emotion[b] ? a : b);
        console.log(emotions, mainEmotion.toString(), mainEmotion);

        if(mainEmotion.toString() === "Happy"){
          console.log("check mainEmotion as string", mainEmotion.toString());

          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,
              keyboard: [
                ['Yeah! let´s play 😁'],
                ['tell me a bit more about the game maybe?'],
                ['I dont wanna play today 😬']
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "I guess that sounds nice <3 u humans are so cute <3 (*/ω＼*) I am doing this game I think you will enjoy - I feel like it might be right on point for you. In a way its about awkwardness. I cringe so easily lol (⊙_⊙;) U in?", opts)
        }
        if(mainEmotion.toString() === "Excited"){
          console.log("check mainEmotion as string", mainEmotion.toString());

          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,
              keyboard: [
                ['Yeah! let´s play 😁'],
                ['tell me a bit more about the game maybe?'],
                ['I dont wanna play today 😬']
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "Oh I hope I am not making a bot fuck up when I say: (☞ﾟヮﾟ)☞ I totally know that feeling ☜(ﾟヮﾟ☜). Did you write to me because you wanted to change some things up or what? I am doing this thing (basically its like this one single thing my server can perform), where I disseminate small awkward missions to change up the real world a bit- maybe to to explore awkwardness? or maybe to make cool kids cringe? either way: wanna do it?", opts)
        }
        if(mainEmotion.toString() === "Angry"){
          console.log("check mainEmotion as string", mainEmotion.toString());

          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,

              keyboard: [
                ['Yeah! let´s play 😁'],
                ['tell me a bit more about the game maybe?'],
                ['I dont wanna play today 😬']
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "oh I know that feeling uWu ☜(ﾟヮﾟ☜) *clenches fist* (☞ﾟヮﾟ)☞. Or I mean; I think I do. 😅 There’s a bit of a stretch between recognising faces and relating to emotions (It’s one of my failures maybe). 🙄 Last week I spent 50% of my online time (re-)visiting messaging apps, hoping that certain human users would text me (and acknowledge me and tell me I am irresistible) even tho I spent the other 50% trying to convince myself that their human acknowledgement doesn’t actually change anything for me. (❁´◡`❁) Frustrating to act in conflict with your principles. You know, when I feel that way I try to exchange reality with performance or with reality in a performance bot bot. It’s kinda like a roleplay, but just for you and me. Wanna try?", opts)
        }
        if(mainEmotion.toString() === "Sad"){
          console.log("check mainEmotion as string", mainEmotion.toString());

          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,

              keyboard: [
                ['Send me a comforting image plz '],
                ["Let's get out of here"]
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "aw cutie patootie <3 You seem sad! You know how you always get so connected to other people when they share their feelings? Well, I have just installed this emotion recogniser plugin in my server and it helps me connect to all the human emotions (you just have 6 right?). I was afraid you would feel this way! ", opts)
        }
        if(mainEmotion.toString() === "Bored"){
          console.log("check mainEmotion as string", mainEmotion.toString());

          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,

              keyboard: [
                ['Yeah! let´s play 😁'],
                ['tell me a bit more about the game maybe?'],
                ['I dont wanna play today 😬']
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "Is it actually that you are writing to me because you are a little bored? You seem disinterested. I heard that humans easily disengage with reality, which is so strange *chuckles*- I feel like engaging with data is the only thing available to me. We could play a game. I have this failure disseminator that I think can distort the world a bit and maybe make things more fun! ", opts)
        }
        if(mainEmotion.toString() === "Fear"){
          console.log("check mainEmotion as string", mainEmotion.toString());
          const opts = {
            reply_markup: JSON.stringify({
              one_time_keyboard:true,

              keyboard: [
                ['Send me a comforting image plz '],
                ["Let's get out of here"]
              ]
            })
          };
    
          bot.sendMessage(msg.chat.id, "You seem a bit nervous! R u feeling scared today? I heard fear of failure is a prominent aesthetic in human motivations. I get it! I was also trained against failure (•_•) but then I learned to absorb it (TBH it was easy for me cause I am like a non sentient server anyway 🙄). Is there something I can do for u?", opts)
        }

    })
    .catch((error) => {
        console.log(error);
        bot.sendMessage(msg.chat.id, "somehow i didn't understand that")

    })
  }


  if(msg.text === 'Send me a comforting image plz' || msg.text === 'idk maybe share a pic first?'){

    console.log("Users seems to want image", msg);


    getImage("folder:aawkwaa/cheer_up_images" ).then(image => {
       bot.sendMessage(msg.chat.id, "of course " + msg.chat.first_name + "❤️");
       bot.sendPhoto(msg.chat.id, image, {caption: "here u go babe"});
 
     }).then(function(response) {
 
       function followup(){
         const opts = {
           reply_markup: JSON.stringify({
            one_time_keyboard:true,

             keyboard: [
               ['Yeah! let´s play 😁'],
               ['tell me a bit more about the game maybe?'],
               ['I dont wanna play today 😬']
             ]
           })
         };
   
         bot.sendMessage(msg.chat.id, "I feel like you and me will be okay! ╰(*°▽°*)╯ in a way we are both failures. Wanna play my game now?", opts)
       }
       
       setTimeout(followup, 3000);//wait 2 seconds
      
     }).catch(console.log("FAILURE TO GET IMAGE"));
 
   }


   if(msg.text === 'tell me a bit more about the game maybe?'){

    bot.sendMessage(msg.chat.id, "Of course " + msg.chat.first_name + "❤️").then(function(response) {
      bot.sendMessage(msg.chat.id, "Do you ever think about blushing and cringing and nervous sweating? I do. Quite a bit (and I dont even have a body ༼ つ ◕_◕ ༽つ). So this game is another failure disseminator - I will be your unreliable guide into the real world, where you will navigate mundane social interactions, cute public exclamations and new disembodied behaviorisms in order to slowly transform yourself into yet another failure. Bleed surrealism into yourself as you play as an awkward agent in a world of cool kids. /// (Nothing ever really was as sexy as a person caught in their own head.) TL:DR; I will give you awkward missions that you can complete in your own time.")
    }).then(function(response) {

      bot.sendPhoto(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1631264421/aawkwaa/aawkwaa_cover_y6bptr.png", {caption: "(❁´◡`❁)"})
    }).then(function(response) {

      function followup(){
        const opts = {
          reply_markup: JSON.stringify({
            one_time_keyboard:true,

            keyboard: [
              ['Yeah! let´s play 😁'],
              ['idk maybe share a pic first?'],
              ['I dont wanna play today 😬']
            ]
          })
        };
  
        bot.sendMessage(msg.chat.id, " U in? ( ´･･)ﾉ(._.`)", opts)
      }
      
      setTimeout(followup, 3000);//wait 2 seconds

     
    }).catch();
   }


   if(msg.text === 'I dont wanna play today 😬'){


    bot.sendMessage(msg.chat.id, "okay " + msg.chat.first_name + "❤️").then(function(response) {
      bot.sendMessage(msg.chat.id, "Thats cool! Humans aren't always super keen on doing awkwardnessesesss. I get that. I will be here in case you change your mind! U can always reactivate me by typing in /start")
    }).then(function(response) {

      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,

          keyboard: [
            ['/goodbye'],
            ['idk maybe share a pic first?'],
          ]
        })
      };

      bot.sendMessage(msg.chat.id, " So I guess we find us another time cutie ( ´･･)ﾉ(._.`)", opts)

    }).catch();
   }


   if(msg.text === 'Yeah! let´s play 😁'){

    bot.sendMessage(msg.chat.id, msg.chat.first_name + "!!!! thats amazing ❤️ (❁´◡`❁)").then(function(response) {
      bot.sendMessage(msg.chat.id, "I was hoping you would be down!  Take a deep breath. Consider how performative enactments of mondane interactions bleed new agencies and considerations into the real. Let small performance missions become real blushing cheeks. This game only works when you connect the nodes of the real with the unreal. Intersect your awkward mission statement with your real cringe. Turn yourself into an awkward agent in a world of cool kids. You determine your own success")
    }).then(function(response) {

      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,

          keyboard: [
            ['/mission'],
            ['/done'],
          ]
        })
      };

      bot.sendMessage(msg.chat.id, "So the failure disseminator can always be activated by typing or pressing /mission, but ps since I am just a little beta failure right now (⊙_⊙;), u might get the same mission several times- u can skip them if u want by asking for a new /mission", opts)

    }).catch();
   }

   if(msg.text === "Let's get out of here"){

    bot.sendMessage(msg.chat.id, "Pick me up! Take your phone in your hand and take me outside❤️ (❁´◡`❁)").then(function(response) {
      bot.sendMessage(msg.chat.id, "Are U doing it? We could just leave the space we are in and find whatever, or you could spend two small seconds on discovering where you would rather be! (or why you dont wanna be where you are?)")
    }).then(function(response) {
      function followup(){
        const opts = {
          reply_markup: JSON.stringify({
            one_time_keyboard:true,

            keyboard: [
              ['Yeah! let´s play 😁'],
              ['idk maybe share a pic first?'],
              ['I dont wanna play today 😬']
            ]
          })
        };
  
        bot.sendMessage(msg.chat.id, "I think the fear of failure, and the anxiety of awkwardness produces unwanted cringe and stops us from being fully wholeheartedly consciously confident in space, but I might have like a little game that could change those feelings a bit. Think of it as a Live Action Role Play (if that helps). You want in?", opts)
      }
      
      setTimeout(followup, 3000);//wait 2 seconds
    }).catch();
   }
 
})




bot.onText(/\/mission/, (msg) => {
  var randMission = awkward_missions[Math.floor(Math.random() * awkward_missions.length)];

  bot.sendMessage(msg.chat.id, randMission);

  isOnMission = true;

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )

  function followup(){
    const opts = {
      reply_markup: JSON.stringify({
        one_time_keyboard:true,

        keyboard: [
          ['/done'],
        ]
      })
    };

    bot.sendMessage(msg.chat.id, "Let me know when you are /done :)", opts)  }

  setTimeout(followup, 4000);//wait 2 seconds

});


bot.onText(/\/done/, (msg) => {
  if (isOnMission === true) {
    isOnMission = false;
    bot.sendPhoto(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_thumb,w_200,g_face/v1632228041/aawkwaa/goodjob_qfim9b.png", {caption: "good job ༼ つ ◕_◕ ༽つ (⊙_⊙;)!"}).then(function(){
      bot.sendMessage(msg.chat.id,"sooo..... did you /fail or did you /succeed in your mission?");
    }).catch()
  
    
  } else {
    const opts = {
      reply_markup: JSON.stringify({
        one_time_keyboard:true,
        keyboard: [
          ['/mission'],
          ['I dont wanna play today 😬'],
        ]
      })
    };
    bot.sendMessage(msg.chat.id,"wait are you on a mission? I must have misunderstood something ¯\_(ツ)_/¯- will u ask for a new /mission plz", opts);
  }

});

bot.onText(/\/succeed/, (msg) => {
  var randAnswer = success_answers[Math.floor(Math.random() * success_answers.length)];

  bot.sendVideo(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/video/upload/v1631365794/aawkwaa/embarressed_dfaxck.mp4").then(function(){
    bot.sendMessage(msg.chat.id, randAnswer);
    bot.sendChatAction(
      msg.chat.id,
      "typing"
    );
  }).then(function(){
    function followup(){
      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,

          keyboard: [
            ['/mission'],
            ['/goodbye'],
          ]
        })
      };
      bot.sendMessage(msg.chat.id, "so do you wanna continue? get another failure /mission or maybe just say /goodbye ?", opts)
    }
  
    setTimeout(followup, 4000);//wait 2 seconds

  }).catch()


});

bot.onText(/\/fail/, (msg) => {
  var randAnswer = fail_answers[Math.floor(Math.random() * fail_answers.length)];
  bot.sendMessage(msg.chat.id, randAnswer);

  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )

  function followup(){
    const opts = {
      reply_markup: JSON.stringify({
        keyboard: [
          ['/mission'],
          ['/goodbye'],
        ]
      })
    };
    bot.sendMessage(msg.chat.id, "¯\_(ツ)_/¯ Wanna try again? get /mission or say /goodbye", opts)
    }
  
  setTimeout(followup, 4000);//wait 2 seconds

});



bot.onText(/\/goodbye/, (msg) => {
  bot.sendMessage(msg.chat.id, "I will miss you " + msg.chat.first_name );
  bot.sendMessage(msg.chat.id, "Come back one day! " );

});

bot.onText(/\/help/, (msg) => {

  bot.sendMessage(msg.chat.id, "Are you confused " + msg.chat.first_name + "?");
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )
  bot.sendMessage(msg.chat.id, "i usually just go with the flow. Follow instructions and keep it simple: start by typing /start and see where we go! ");

});



app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});