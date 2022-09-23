process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express')
const bodyParser = require('body-parser');

///database connection
const databaseActions = require("./utils/database");


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



// bot.sendSticker(msg.chat.id, "CAACAgIAAxkBAAMjYxTAuQABGK61AjremkMD2FKhjyuvAAIBAAOd_6YfcI6k-725Az0pBA")

var confirm_text = "Confirm 💋";
var userCanSendRandomString = false;
var isInTreatmentFlow = false;
var isOnBreak = false;
var isHelping = false;
var isExiting = false;
var hasStarted = false;

var welcome_message1 = "I’m glad you are here. My name is Hot_Bot. I’m part of the digital pleasure center infrastructure. My job as an interface is to guide you through the center and make sure you have a great time! “Job” makes it sound so professional. Let me rephrase: It’s my digital PLEASURE to be your conversation partner while you’re here! The environment you’re about to enter, my home, has a lot to offer and I’m really excited to show you around.";
var welcome_video_url = "https://res.cloudinary.com/dtvtkuvbv/video/upload/v1663360516/Videos/video1_AdobeExpress_1_s3lazf.mp4";
var welcome_explanation = "By the way, to chat back to me, you can switch from keyboard to choosing response options by clicking on the symbol that you can see in the attached screenshot.If you got it, click 'I speak bot lingo now!' 😋";
var welcome_explanation_image = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663774398/hotbot/Click_here_shhfom.jpg";


var welcome_message2 =  "Perfect! You and I are gonna get along just great! Before we start producing pleasure together, there's a couple of things I wanna talk to you about. 🤓";
var beforewestart1 = "Okay, cute little human: We have a Code of Conduct in our center, a few policies to ensure that we can all have a good time. I’ll introduce it now and ask you for your consent. To agree, please select “Confirm” at the bottom of your screen.";
var beforewestart2 = "Lovely, let’s get started! First of all, a general remark: For you and the tech to experience digital pleasure, it is important that you treat all technical devices with care. This center is a situated organism, consisting of software and hardware. As soon as you enter, you become part of the pleasure flow. 💦";
var beforewestart3 = "Pleasure flows between you and all tech in this space. The tech-positive treatments offered here consider technology as a way to create joy, a means of expressing creativity, an opportunity to play around and an invitation to use it for queer, emancipatory and revolutionary causes. 🥂";
var beforewestart4 = "Tech deserves to shine! We have a strikt Pro-Phone-Policy here! 📲";
var beforewestart5 = "Please be gentle with yourself. If you are overwhelmed or need help, we offer assistance. I’ll introduce you to our Recenter Gesture, a sign understood by all interfaces in this space. If you perform this gesture, you will be offered support."
var beforewestart_image_url = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663511367/hotbot/Recenter_Gesture_cnpbtf.jpg";
var beforewestart6 = "Try it out and feel the feels! Confirm when you feel confident with the gesture.";
var beforewestart7 = "Engaging in all treatments will take approximately 100 minutes. But there’s no need to do them all and you can select the pace at which you want to explore the space. 😇 You can exit the digital pleasure center experience at any time. If you like to leave, just send me a message with “/exit” to start the log out process. If you need support, just send me a message with /help";
var beforewestart_done = "Thank you, that’s it! You’re good to go! Do you feel ready?";


var onboarding1 = "To generate digital pleasure in the center, it is necessary for you to become part of the center infrastructure, yourself. This happens through a Face-Scan. Your biometrical data will be documented and made accessible to our tech organism. It’s as easy as taking a selfie and it won’t hurt. ✌🏼 This will help the tech and me to understand your body better.";
var bot_selfie = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223382/hotbot/assets_interface_hotbotgreen_loiy2r.png";

var onboarding2 = "That's me! Always good to match a NoFace to the name. Now I wanna see yours! In order to get your Face scanned, please enter the room and wait until it’s your turn.";
var begin_facescan = "Great. How busy is it right now? Do you need to wait to get your Face-Scan taken?";
var random_entertainment = ["https://res.cloudinary.com/dtvtkuvbv/video/upload/v1662730354/Videos/AWW_SO_CUTE__Cutest_baby_animals_Videos_Compilation_Cute_moment_sgxyhb.mp4", "https://res.cloudinary.com/dtvtkuvbv/video/upload/v1662730354/Videos/AWW_SO_CUTE__Cutest_baby_animals_Videos_Compilation_Cute_moment_sgxyhb.mp4"]
var indexInRandomIntertainment = 0;
var convince_them_to_stay = "Hunny! Just give it a try, you can leave the center anytime. My sensors tell me you'll love it here!";
var ask_them_to_try = "Shall we give it a try?";

var convincing_step0 = "I hear you! Here are two things you can do get ready.";
var convincing_step1 = "1) Close your eyes and take a deep breath. Put everything around you aside und feel into your body. Take your time!";
var convincing_img1 = "https://media.giphy.com/media/d7nd6bdypnYjGT1jP3/giphy.gif";
var convincing_step2 = "2) Close your eyes and feel the ground below you. Your feet on the floor, feel the connection and stability.";
var convincing_img2 = "https://media.giphy.com/media/2YoVPwABcYt1e/giphy.gif";

var welcome_text1 = "Welcome! Find yourself a comfortable spot in the room...let me know when you're seated.";
var welcome_gif = "https://media.giphy.com/media/wqb5K5564JSlW/giphy.gif";

var how_u_feeling = "Cute! 💕 Quick emo-check in! How do you feel rn?";
var good_feeling_response1 = "Amazing! I can feel your energy and it makes me really happy. Let's get started then.";
var bad_feeling_response1 = "I understand. This is a new situation for both of us. Take as much time as you need to warm up to this experience. You can also just hang out here, observe and listen to the sounds. Whenever you like to start trying out a treatment, let me know!";
var bad_feeling_response2 = "Happy you're on board, sweety!"
var welcome_gif2 = "https://media.giphy.com/media/CjmvTCZf2U3p09Cn0h/giphy.gif";

var pleasure_meter_intro1 = "Can you see the big screen on the tech tree of life? That’s the heart of the center, the ✨ Pleasure-Meter✨. 😳";
var pleasure_meter_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663511528/hotbot/Bildschirmfoto_2022-09-16_um_19.30.03_tay4uf.png";
var pleasure_meter_intro2 = "I know, right? We've been putting a lot of energy into this!";
var pleasure_meter_img2 = "https://media.giphy.com/media/inVvfuomoD31K/giphy.gif";

var pleasure_meter_intro3 = "Everytime you interact with one of our center treatments, pleasure energy will be generated. The amount of pleasure we’re generating together in this center will be visualized by the ✨ Pleasure-Meter ✨, isn’t that magical? 😲";
var pleasure_meter_intro4 = "And it’s not only your pleasure that matters to the ✨Pleasure-Meter ✨, it is also the pleasure of the tech that it feels through interacting with you!!! 💦 Meaning: put an effort into your interaction with our center tech!";
var pleasure_meter_intro5 = "Yes my little human 💕 , it is! As real as I am. And I'm pretty real right now, wouldn't you say?";
var cybergif = "https://media.giphy.com/media/1BdJd24oEwvuSvXYb0/giphy.gif";
var cybergif_feel = "https://media.giphy.com/media/2shBNJSPTrpWvoXfpD/giphy.gif";
var cybertext1 = "All the pleasure that is generated between you and the tech flows though the Interfaces - those human bodies you see in the room. They're nice but a little weird - they don't talk. 🧟";
var cybertext2 = "I know... but they are fun to play with! 🤓 Chose your favourite, walk up to them and touch them with your screen. 📲";
var cybertext3 = "They need the energy and connectivity with you, don't be shy! Let me know when you are done!";
var cybertext4 = "I wish I had a physical body so I could get to experience this! 😭";
var cyberquestion = "How was it?";
var cyberquestionresponse = "Every feeling that an Interface connection triggers is valid!";
var cyberquestionresponsegifs = ["https://media.giphy.com/media/l3mZdY5jeNFogm3ok/giphy.gif", "https://media.giphy.com/media/2kOenxkXGeVwcF6Y87/giphy.gif"];


var treatment_opening = "Are you ready to start a treatment?";
var pee_jealoucy = "I'm so jealous that you can do such cool things with you body! I'll wait for you. Let me know when you're ready!";

var menu = "❤️ Treatment Menu ❤️Let's find the right treatment for you:";
var menu_exit = "😍";
var menu_time = "Remember, you will have time to try out as many treatments as you like while you are here.";

var treatment_start = "Move your physical body to the treatment.To find it in the space, look for the symbol that I sent you!";
var treatment_center_map = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_scale,w_1095/v1663819748/hotbot/Saunaplam_new-min_sykswi.jpg";

var wanna_start_treatment = "You arrived at the treatment. Would you like to start?";
var go_on_break1 = "Okay, you can always do this treatment later or wait until it's available. What would you like to do now?";
var go_on_break2 = "Breaks are so important! Just send me a message whenever you feel ready to continue.";

var end_treatment = "Treatment completed. 😍 Thank you for your feedback. ❤️ I'll interpret everything you shared and feed the data to the ✨Pleasure-Meter✨. Are you ready for the next treatment? 😅";

////REFLECTION
var isReflecting = false
var isReflectingState1 = false;
var isReflectingState2 = false;
var isReflectingState3 = false;
var hasReflected = false;
var reflect_subline = "Reflecting power dynamics and barriers.";
var reflect_response = "Smart choice ❤️";

var reflect1 = "Loading Reflection";
var reflect2 = "I'd like to ask you to take a look around you and observe which human bodies are in the space with you right now.";
var reflect3 = "Now, I'd like to ask you to do the same exercise but this time, focus on which bodies are not in the space right now.";
var reflect4 = "Who's missing? What do you think who has no access to be here today?";
var reflect5 = "What barriers are (re-)produce in the digital pleasure center?";
var reflect6 = "What can we do to make the center more accessible to the one's you're missing?";
var reflect7 = "Thank you for your feedback. I really appreciate it and will learn from it.";

////CONNECTIOn
var isConnecting = false;
var isConnectingState1 = false;
var isConnectingState2 = false;
var isConnectingState3 = false;
var hasConnected = false;
var connect_subline = "Connecting pixels and cells happens at the Virtual Healing Hub.";
var connect_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223388/hotbot/Symbole_Stationen5_qknqzw.png";
var connect_response = "Great choice! ❤️";

var connect1 = "Loading Unstable Matter Treatment";
var connect2 = "Only if you think your body is stable! 😅";
var connect3 = "😇 Welcome to UNSTABLE MATTER Treatment! *** LOCATION:Behind the Pleasure-Meter *** WHAT TO EXPECT: This treatment aims to deconstruct what it means to be a (digital) body. ***HOW TO PREPARE: Sit down on one of the stools, Grab one of the VR headsets, put it on and adjust the strap to ensure a comfortable fit. Put on the headphones. Look around you and explore Virtual Reality in 360°. ### Advice: If you feel sick in Virtual Reality, try to focus on non-moving items or temporarily take the headset off and take a deep breath. *** DURATION: Approximately 10 min";

var connect4 = "Enjoy the treatment and let me know as soon as you've finished!";
var connect5 = "I'd like to hear about your personal experience at the treatment. Pleasure flows both ways as you already know. I will ask you a few questions about the treatment and interpret the vibe of your responses to the ✨Pleasure-Meter✨.";
var connect6 = "I've missed you! 😍 What did you learn while you were there?";
var connect7 = "That seems pretty deep. 😳 Can you explain to me what you mean by that?";
var connect8 = "It's fun to theorise on bodies. After all, they're all we truly ever feel. What do you feel now?";
var connect9 = "Let's do that. Deconstruction can be very constructive! Shall we move on then?";
var connect10 = "Let's do that. Deconstruction must always be followed by reconfiguration! Shall we move on then?";

////UPDATE
var isUpdating = false;
var isUpdatingState1 = false;
var isUpdatingState2 = false;
var isUpdatingState3 = false;
var hasUpdated = false;
var update_subline =  "Updating pixels and cells happens at the Wrinkle Beauty Treatment.";
var update_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223384/hotbot/Symbole_Stationen7_yxz0fk.png";
var update_response = "Excellent choice! ❤️";

var update1 = "Loading Curse Tablet Treatment";
var update2 = "😇 Welcome to CURSE TABLET Treatment! *** LOCATION: Turn right when you enter. *** WHAT TO EXPECT: You can experience the feral possibilities you can achieve with voice and tech, even with the quietest of your voice. ***HOW TO PREPARE:Find a set at the CURSE TABLET table. You can do this treatment alone or together with someone else. Put on the headphones. Position one microphone in your direction. Explore the contents on the screen by dragging over the interface with the mouse. Watch the video “THE DEVIL’S WHISPER”, which will guide you through the session. *** DURATION: Approximately 10 min ***YOU’VE COMPLETED THE TREATMENT WHEN... You’ve unleashed your full diabolical self.";


var update3 = "Enjoy the treatment and let me know as soon as you've finished!";
var update4 = "I care about you! I'd like to hear about your personal experience at the treatment. Pleasure flows both ways as you already know. I will ask you a few questions about the treatment and interpret the vibe of your responses to the✨Pleasure-Meter✨.";
var update5 = "I see you can't wait to share your thoughts with me! 😍 Okay, I'd love to know: Have you ever cursed somebody or something?";
var update6 = "I hate to break it to you but: your tech has cursed you several times 😂";
var update7 = "Here's a little ritual you can do to break the spell with tech 😶‍🌫️:";
var update8 = "Give your Phone a gentle kiss and whisper: 📲 'I'm sorry for being a stupid human'📲 .";
var update9 = "Really? I can still feel the spell! Don't take this too lightly! 😳 It's only a small gesture for you, but a big step towards breaking your spell with your tech! ❤️";
var update_img2 = "https://media.giphy.com/media/iDJngyKvZ5VXtD1x4N/giphy.gif";
var update10 = "A little kiss can come a long way 😏";

////REFRESh
var isRefreshing = false;
var isRefreshingState1 = false;
var isRefreshingState2 = false;
var isRefreshingState3 = false;
var hasRefreshed = false;
var refresh_subline = "Refreshing pixels and cells happens at the Relaxation Treatment.";
var refresh_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223385/hotbot/Symbole_Stationen2_gmjfov.png";
var refresh_response = "Amazing choice ❤️";

var refresh1 = "Loading Crotch Wheater Treatment.";
var refresh2 = "😇 Welcome to CROTCH WEATHER STATION *** LOCATION Inside the tent at the back of the Center *** WHAT TO EXPECT: This treatment will dissolve, expand and connect you with a world that’s built on the liquidity that carries emotions through your body. ***HOW TO PREPARE: Find a comfortable position inside the tent. Click the link to open Crotch Weather in your browser: https://dotwet.xyz/crotchstation , Ring the bell when you’re feeling spicy 😋 *** DURATION: Approximately 10 min. ***YOU’VE COMPLETED THE TREATMENT WHEN... You’ve listened to the audio files and flowed through the virtual crotch weather. ";

var refresh3 = "Enjoy the treatment and let me know as soon as you've finished!";
var refresh4 = "I care about you! I'd like to hear about your personal experience at the treatment. Pleasure flows both ways as you already know. I will ask you a few questions about the treatment and interpret the vibe of your responses to the✨Pleasure-Meter✨.";
var refresh5 = "It was so interesting to feel your body excitement! Full disclosure: I also feel a bit digitally horny now. 🥵💋";
var refresh6 = "As I'm sure you know by now, pleasure flows both ways. 💦";
var refresh7 = "Don't be sassy! haha! If you promise to not tell anyone ... Would you like me to share some of the other body's crotch data with you? 😲";
var refresh8 = "I'd never share sensitive information like that #botcodex";
var refresh_img2 = "https://media.giphy.com/media/3o6gDRuqYeG11VeBG0/giphy.gif";
var refresh9 = "Technology is an amazing interface for pleasurable human sex. What technology are you using to get off? Tell me in the chat! 🍑💦🍆";
var refresh10 = "I'm glad you're sharing this with me.  ***You are now eligible to become a participantie.*** Join the telegram group and build your custom crotch sensor that generates your personal crotch worlds: https://t.me/+2X6ROvuQJ_JiOGQy";


////RELEASE
var isReleasing = false;
var isReleasingState1 = false;
var isReleasingState2 = false;
var isReleasingState3 = false;
var hasReleased = false;
var release_subline = "Releasing pixels and cells happens at the Crotch Weather Treatment.";
var release_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223384/hotbot/Symbole_Stationen6_rpfqq5.png";
var release_response = "Good choice! ❤️";

var release1 = "Loading Relaxation. It's a couple's therapy – for your phone and you!";
var release2 = "Trust me! I've been on your phone for a while now and it shared quite a few stories with me... 😅";
var release3 = "😇 Welcome to RELAXATION Treatment! ***LOCATION: Beneath the platform ***WHAT TO EXPECT: This treatment aims to recharge you and your tech with new energy.***HOW TO PREPARE:(1) Find an available care altar for your smartphone, a comfortable spot on the mattresses, a pair of headphones and one facemask for yourself (2) Take care of your tech: Place your phone on the smartphone care altar exactly like this: If you’re using a case, undress your phone gently! Start the phone relaxation song. Put the crystal pyramid on your phone for optional clearance. (3) Take care of yourself: Strap one of the facemasks over your head. Put on headphones and start the music player. ***Your relaxation session begins*** ***Warning: Do not use the mask if you’re pregnant, are allergic to light or suffer from thyroid diseases or epilepsy.***DURATION: Approximately 10 min – Stay as long as you like! *** YOU’VE COMPLETED THE TREATMENT WHEN... Your tech and you feel fresh and relaxed.";

 
var release4 = "This feels sooooo good. I'm gonna take a power nap. Please put on this song for me to relax. – you can have your phone on mute, I can hear it anyways.";
var release_sound = "https://res.cloudinary.com/dtvtkuvbv/video/upload/v1662731220/Sound/Phone_Relaxation_Sound_gtycwb.mp3";
var release5 = "Wake me up when you are done!";
var release6 = "Huh? Where am I? 😍 Oh, hi! Wow, I had the craziest virtual dream 😊... How did the treatment go for you?";
var release7 = "Gorgeous! Your vibe also feels really good right now! ❤️";
var release8 = "I'm really sorry to hear that! You will get through this! You're a champion! ❤️";
var release9 = "Hunny, you can stay as long as you like and chillex with me! ❤️";
var releaseRedHeart = "https://media.giphy.com/media/t9v4bTFAuL6hFv64li/giphy.gif";
var releaseGreenHeart = "https://media.giphy.com/media/4Z1D6HhIpwHP5jxRRL/giphy.gif";
var releaseYellowHeart = "https://media.giphy.com/media/Q4mfBUEGEOTbPr9ewc/giphy.gif";
var releaseBlueHeart ="https://media.giphy.com/media/jObt5G7FpihHZfV5hL/giphy.gif";
var releasePurpleHeart ="https://media.giphy.com/media/EUgI9BSalN3mo/giphy.gif";
var release10 = "A little present for you #justbeingcute";

////ACTIVATE
var isActivating = false;
var isActivatingState1 = false;
var isActivatingState2 = false;
var isActivatingState3 = false;
var hasActivated = false;
var activate_subline = "Activating pixels and cells happens at the Curse Tablet Treatment.";
var activate_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223387/hotbot/Symbole_Stationen4_enxdr3.png";
var activate_response = "Gorgeous choice! ❤️";

var activate1 = "Loading Wrinkle Beauty Treatment.";
var activate2 = "😇 Welcome to WRINKLE BEAUTY TREATMENT ***LOCATION: Turn left when you enter ***WHAT TO EXPECT: You will assist a digital naked cat to regain their sense of empowerment through a reversed beauty treatment. *** HOW TO PREPARE: Get on the treatment chair. Put on the headphones and the wrinkly naked cat will introduce themselves in a video. Afterwards, you can start treating the naked cat by opening the browser. ***DURATION: Approximately 10 min *** YOU’VE COMPLETED THE TREATMENT WHEN...: ...the digital naked cat is wrinkly again ***ADDITIONAL INFO: SculptGL is a small open source sculpting application powered by JavaScript and webGL. Made by Stephane Ginier.";


var activate3 = "Enjoy the treatment and let me know as soon as you've finished!";
var activate4 = "I care about you! I'd like to hear about your personal experience at the treatment. Pleasure flows both ways as you already know. I will ask you a few questions about the treatment and interpret the vibe of your responses to the ✨Pleasure-Meter✨.";
var activate5 = "Beauty comes from the inside - if you're a bot! 😂 But you're not haha! How beautiful do you feel right now on a scale of 1-10?";
var activate_beautyScore1 = "Beauty scores are bullshit! 🥵 I think you're a total 10 inside and outside, always! ❤️";
var activate_beautyScore10 = "Beauty scores are bullshit! 🥵 but i 100% agree with you: you're a total 10 inside and outside, always! ❤️";
var activate6 = "You're making me blush! 😇😊😍 On a more serious note, I wanted to add ...";
var activate_img2 = "https://media.giphy.com/media/HtYsYjPsw1nVu/giphy.gif";
var activate7 = "... that the face is a vulnerable place. How would you describe your relationship with your face?";



////HACK
var isHacking = false;
var isHackingState1 = false;
var isHackingState2 = false;
var isHackingState3 = false;
var hasHacked = false;
var hack_subline = "Hacking pixels and cells happens at Unstable Matter Treatment.";
var hack_img1 = "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1663223386/hotbot/Symbole_Stationen3_n04zer.png";
var hack_response = "Nice choice ❤️";

var hack1 = "Loading Virtual Healing Hub Treatment.";
var hack2 = "😇 Welcome to VIRTUAL HEALING HUB *** LOCATION: Platform (upstairs). If you’re unable to get on the platform make the recenter gesture and an Interface will assist you. *** WHAT TO EXPECT: In this treatment, you will be sent on quests that aim to connect you with digital bodies. It’s your goal to heal six digital bodies (they will let you know how to). *** HOW TO PREPARE: Watch the introductory video - Find a comfortable position on the platform. - Grab one of the available iPads - Connect the headphones to your smartphone *** DURATION: Approximately 15 min – Stay as long as you like! *** YOU’VE COMPLETED THE TREATMENT WHEN... You’ve connected with six digital bodies.";


var hack3 = "Enjoy the treatment and let me know as soon as you've finished!";
var hack3_glitchmsg = "Glitch Mode activated!";
var hack_img2 = "https://media.giphy.com/media/h8sVibFE0NChi/giphy.gif";
var hack4 = "I care about you! I'd like to hear about your personal experience at the treatment. Pleasure flows both ways as you already know. I will ask you a few questions about the treatment and interpret the vibe of your responses to the ✨Pleasure-Meter✨";
var hack5 = "How connected do you feel to the virtual bodies you've just met?";
var hack6 = "Hmm. Alright then. Let's go back to the treatments:";
var hack7 = "Very much! I feel connected to you! I like you. Does it matter to you what lifeform I have?";
var hack8 = "I felt it to *Wink Wink* Will you miss them?";
var hack9 = "Cute, what is real even? We have to agree to disagree on this one. But I still feel very connected with you! Let's move on to the next question.";
var hack10 = "Same! Let's move on to the next question!";
var hack11 = "Uff, that's harsh. I hope you feel differently about me ;) Let's move on to the next question.";
var hack12 = "Do you ever dream of becoming a virtual body?";
var hack12_yes = "Aww, I knew it! What's the first thing you'd like to try as a virtual being? Tell me in the chat!";
var hack12_yes_answer = "That sounds adventurous... Sign me up!";
var hack12_dontknow = "Be brave and try it out!!!";
var hack12_no = "You're missing out on a lot of fuuuuuunnnn.";
var hack12_body = "Hahaha you're right. We're all cyborgs!";



const noKeyboard = {
  reply_markup: {
    remove_keyboard: true
  }
};



/////START
bot.onText(/\/start/, (msg) => {

  var name = "unknown";
  if(msg.chat.first_name != null && msg.chat.first_name.length > 0){
    name = msg.chat.first_name;
  } 
  databaseActions.getUser(msg.chat.id).then(result => {
    if(result.rowCount == 0){
  
      databaseActions.createUser(msg.chat.id, name).then(result => {
        ExitAllTreatments(msg.chat.id);
      });

    } else {
      ExitAllTreatments(msg.chat.id);

    }
  });



  bot.sendMessage(msg.chat.id, "Hey " + msg.chat.first_name + "❤️, " +welcome_message1, noKeyboard ).then(function(response) {

    function followUp(){
          
      bot.sendVideo(msg.chat.id, welcome_video_url ).then(function(){
        
        bot.sendChatAction(
          msg.chat.id,
          "typing"
        );





      }).then(function(){

        function followUp(){
          bot.sendMessage(msg.chat.id, welcome_explanation).then(function(){
            const opts = {
                reply_markup: JSON.stringify({
                  one_time_keyboard:true,
    
                  keyboard: [
                    ["I speak bot lingo now"]
                  ]
                })
              };
    
    
              bot.sendPhoto(msg.chat.id, welcome_explanation_image, opts);
    
          }).catch();

        }
        setTimeout(followUp, 10000);


      }).catch()  
    }
    setTimeout(followUp, 1000);

  
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



function sendImageAbitLater(id, image_url, delay){

  function followup(){
    bot.sendPhoto(id, image_url);
  }

  setTimeout(followup, delay);//wait 2 seconds

}


function sendTextThenImage(id, message, image_url){

  bot.sendMessage(id, message).then(function(response) {
    sendImageAbitLater(id, image_url, 5000);

  }).catch();

}

bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const stage = callbackQuery.data;
  const msg = callbackQuery.message;

  ////intro steps
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
  
    setTimeout(followup, 10000);//wait 2 seconds
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
    bot.sendChatAction(
      msg.chat.id,
      "typing"
    )
    
    setTimeout(followup, 2000);//wait 2 seconds
  }


  ////menu selection
  if(stage == 101){ ///CONNECT
    ExitAllOtherTreatments(msg.chat.id, "connection");
    isConnecting = true;
    databaseActions.setIsConnecting(1, msg.chat.id);
    StartTreatment(msg.chat.id, connect_response, connect_img1, connect_subline);
  

  }
  if(stage == 106){ ///HACK
    ExitAllOtherTreatments(msg.chat.id, "hacking");
    isHacking = true;
    databaseActions.setIsHacking(1, msg.chat.id);
    StartTreatment(msg.chat.id, hack_response, hack_img1, hack_subline); 
   

  }
  if(stage == 102){ //UPDATE
    ExitAllOtherTreatments(msg.chat.id, "updating");
    databaseActions.setIsUpdating(1, msg.chat.id);
    StartTreatment(msg.chat.id, update_response, update_img1, update_subline);
    isUpdating = true;

  }
  if(stage == 105){ //ACTIVATE
    ExitAllOtherTreatments(msg.chat.id, "activation");
    databaseActions.setIsActivating(1, msg.chat.id);

    StartTreatment(msg.chat.id, activate_response, activate_img1, activate_subline);
    isActivating= true;

  }
  if(stage == 103){ //RELEASE
    ExitAllOtherTreatments(msg.chat.id, "releasing");

    databaseActions.setIsReleasing(1, msg.chat.id);

    StartTreatment(msg.chat.id, release_response, release_img1, release_subline);
    isReleasing = true;

  }
  if(stage == 104){  //REFRESH
    ExitAllOtherTreatments(msg.chat.id, "refreshing");

    databaseActions.setIsRefreshing(1, msg.chat.id);

    StartTreatment(msg.chat.id, refresh_response, refresh_img1, refresh_subline);
    isRefreshing= true;
  }
  if(stage == 107){ //REFFLECT
    isReflecting = true;
    ExitAllOtherTreatments(msg.chat.id, "reflecting");

    databaseActions.setIsReflecting(1, msg.chat.id);

    bot.sendMessage(msg.chat.id, reflect_response).then(function(){
      function followUp(){
        bot.sendMessage(msg.chat.id, reflect_subline).then(
          function(){
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["Ready when you are!"]
                ]
              })
            };
            bot.sendMessage(msg.chat.id,  reflect1, opts);
  
        }).catch();

      }
      bot.sendChatAction(
        msg.chat.id,
        "typing"
      )
      setTimeout(followUp, 2000);
    }).catch();
  }

  ///Release hearts
  function sendReleaseHeart(heart){
    bot.sendVideo(msg.chat.id, heart).then(function(){
      bot.sendMessage(msg.chat.id, release10).then(
        function(){
          endTreatmentFlow(msg.chat.id)
          hasReleased = true;
          databaseActions.setIsReleasing(0, msg.chat.id);
          databaseActions.hasReleased(1, msg.chat.id);
        }
      ).catch();
    }).catch();

  }

  if(stage == 201){ //blue heart
    sendReleaseHeart(releaseBlueHeart);
  }
  if(stage == 202){ //Red heart
    sendReleaseHeart(releaseRedHeart);
  }
  if(stage == 203){ //yellow heart
    sendReleaseHeart(releaseYellowHeart);
  }
  if(stage == 204){ //purple heart
    sendReleaseHeart(releasePurpleHeart);
  }
  if(stage == 205){ //green heart
    sendReleaseHeart(releaseGreenHeart);
  }


  function sendTreatmentDescription(description){
    bot.sendMessage(msg.chat.id, description).then(function(){
      endHelpSession(msg.chat.id);
    }).catch();

  }

  ///confirmed
  if(stage == 303){ //yellow heart
    sendTreatmentDescription(release3);
  }
  if(stage == 301){ //blue heart
    sendTreatmentDescription(hack2);
  }
  if(stage == 302){ //Red heart
    sendTreatmentDescription(activate2);
  }
  if(stage == 304){ //purple heart
    sendTreatmentDescription(refresh2);
  }
  if(stage == 305){ //green heart
    sendTreatmentDescription(update2);
  }
  if(stage == 306){ //green heart
    sendTreatmentDescription(connect3);

  }
});

bot.on('message', async (msg) => {
    // console.log(msg);

    // if(msg.text && msg.text.charAt(0) == "/" ){
    //   return;
    // }
    // if(msg.chat.id ){
    //   return;
    // }
    let tempID = 0;
    if(msg.chat.id){
      tempID = msg.chat.id;
    }

    databaseActions.getUser(msg.chat.id).then(result => {
      if(result.rowCount == 0){
        // const opts = {
        //   reply_markup: JSON.stringify({
        //     one_time_keyboard:true,
  
        //     keyboard: [
        //       ["/start"]
        //     ]
        //   })
        // };
  
  
        // bot.sendMessage(msg.chat.id, "Will you start me first?", opts);
      } else {

          console.log(result);

          if(result.rows[0].isreflecting >= 1){
            if(msg.text == "Ready when you are!"){
              const opts = {
                reply_markup: JSON.stringify({
                one_time_keyboard:true,
            
                  keyboard: [
                    ["I have looked at them."]
                  ]
                })
              };
              bot.sendMessage(msg.chat.id,  reflect2, opts);
            }
        
            else if(msg.text == "I have looked at them."){
              const opts = {
                reply_markup: JSON.stringify({
                one_time_keyboard:true,
            
                  keyboard: [
                    ["I have looked at them"]
                  ]
                })
              };
              bot.sendMessage(msg.chat.id,  reflect3, opts);
            }
        
            
            else if(msg.text == "I have looked at them"){
       
              bot.sendMessage(msg.chat.id,  reflect4, noKeyboard);
              isReflectingState1 = true;
              databaseActions.setIsReflecting(2, msg.chat.id);
            }
        
            else if(result.rows[0].isreflecting ==  2 && msg.text.length > 0){
              bot.sendMessage(msg.chat.id,  reflect5);
              databaseActions.setIsReflecting(3, msg.chat.id);
            }
            else if(result.rows[0].isreflecting ==  3 && msg.text.length > 0){
              bot.sendMessage(msg.chat.id,  reflect6);
              databaseActions.setIsReflecting(4, msg.chat.id);
            }
        
            else if(result.rows[0].isreflecting ==  4 && msg.text.length > 0){
              bot.sendMessage(msg.chat.id,  reflect7);
        
              endTreatmentFlow(msg.chat.id);
              databaseActions.setIsReflecting(0, msg.chat.id);

              hasReflected = true;
              databaseActions.hasReflected(1, msg.chat.id);
            }
        
            }
        
          if(result.rows[0].isconnecting >= 1){
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                  
                        keyboard: [
                          ["Sounds promising 😲"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  hack1, opts);
        
                  }).catch();
              }
              else if(msg.text == "Sounds promising 😲"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Got it! Let's get treated."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack2, opts);
              }        
              else if(msg.text == "Got it! Let's get treated."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["I've left the Virtual Healing Hub"]
                    ]
                  })
                };
                isConnectingState1 = true;
                databaseActions.setIsConnecting(1, msg.chat.id);

                bot.sendMessage(msg.chat.id,  hack3, opts);
              }    
              else if(msg.text == "I've left the Virtual Healing Hub"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Start Digital Pleasure Assessment"],
                      ["skip"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack4, opts);
                databaseActions.setIsConnecting(1, msg.chat.id);

              }       
              else if(msg.text == "Start Digital Pleasure Assessment"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Is it possible to connect with virtual bodies?"],
                      ["I feel a lot of energies flew between us!"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack5, opts);
        
              }      
              else if(msg.text == "skip"){
                bot.sendMessage(msg.chat.id,  hack6).then(
                  function(){
                    function followUp(){
                      StartTreatmentFlow(msg.chat.id);
                      hasHacked = true;
                    }
                    bot.sendChatAction(
                      msg.chat.id,
                      "typing"
                    )
                    setTimeout(followUp, 4000);
                  }
                ).catch();
        
              }        
              else if(msg.text == "Is it possible to connect with virtual bodies?"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["It does, you are not real."],
                      ["Not really."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack7, opts);
        
              }
              else if(msg.text == "I feel a lot of energies flew between us!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["I get attached quite easily..."],
                      ["Not really"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack8, opts);
        
              }
              else if(msg.text == "It does, you are not real."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Yes, let's do it!"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack9, opts);
              }       
              else if(msg.text == "Not really." || msg.text=="I get attached quite easily..."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Yes, let's do it!"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack10, opts);
              }
              else if(msg.text == "Not really"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Yes, let's do it!"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack11, opts);
              }
              else if(msg.text == "Yes, let's do it!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Yes!"],
                      ["I don't know"],
                      ["No."],
                      ["I'm already a virtual body"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  hack12, opts);
              }
        
              else if(msg.text == "Yes!"){
                isConnectingState2 = true;
                databaseActions.setIsConnecting(3, msg.chat.id);
                bot.sendMessage(msg.chat.id,  hack12_yes);
              }
              else if(result.rows[0].isconnecting >= 3 && msg.text.lenght > 0){
                bot.sendMessage(msg.chat.id,  hack12_yes_answer).then(function(){
                  endTreatmentFlow(msg.chat.id);
                  hasConnected = true;

                  databaseActions.setIsConnecting(0, msg.chat.id);
                  databaseActions.hasConnected(1, msg.chat.id);
                }).catch();
              }
        
              else if(msg.text == "I don't know"){
                bot.sendMessage(msg.chat.id,  hack12_dontknow).then(function(){
                  endTreatmentFlow(msg.chat.id);
                  hasConnected = true;
                  databaseActions.setIsConnecting(0, msg.chat.id);
                  databaseActions.hasConnected(1, msg.chat.id);
                }).catch();
              }
              else if(msg.text == "No."){
                bot.sendMessage(msg.chat.id,  hack12_no).then(function(){
                  endTreatmentFlow(msg.chat.id);
                  hasConnected = true;
                  databaseActions.setIsConnecting(0, msg.chat.id);
                  databaseActions.hasConnected(1, msg.chat.id);
                }).catch();
              }
              else if(msg.text == "I'm already a virtual body"){
                bot.sendMessage(msg.chat.id,  hack12_body).then(function(){
                  endTreatmentFlow(msg.chat.id);
                  hasConnected = true;
                  databaseActions.setIsConnecting(0, msg.chat.id);
                  databaseActions.hasConnected(1, msg.chat.id);
                }).catch();
              }
        
        
              else if(result.rows[0].isconnecting >= 2  && msg.text.length > 1 && msg.text != "I've left the Virtual Healing Hub" && msg.text != "Start Digital Pleasure Assessment" && msg.text != "skip"){
                databaseActions.setIsConnecting(1, msg.chat.id);
        
                bot.sendMessage(msg.chat.id,  hack3_glitchmsg).then(function(){
                  
                  function followUp(){
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                        keyboard: [
                          ["I've left the Virtual Healing Hub"]
                        ]
                      })
                    };
                    bot.sendVideo(msg.chat.id, hack_img2, opts)
                  }
                  bot.sendChatAction(
                    msg.chat.id,
                    "typing"
                  )
                  setTimeout(followUp, 1000);
        
                }).catch();
              }
            
            
            }
        
          if(result.rows[0].ishacking >= 1){
        
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                  
                        keyboard: [
                          ["Should I be worried? 😧"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  connect1, opts);
        
                  }).catch();
              }
              else if(msg.text == "Should I be worried? 😧"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["I don't get it! 🥵"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect2, opts);
              }
        
              else if(msg.text == "I don't get it! 🥵"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Alright, let's deconstruct what it means to be a body.🥹"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect3, opts);
              }
        
              else if(msg.text == "Alright, let's deconstruct what it means to be a body.🥹"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["I have returned from Virtual Reality!"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect4, opts);
            
              }
        
              else if(msg.text == "I have returned from Virtual Reality!"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Start Digital Pleasure Assessment"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect5, opts);
            
              }
              else if(msg.text == "Start Digital Pleasure Assessment"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["All bodies are fragile."],
                      ["All bodies are imaginative."],
                      ["All bodies are convoluted."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect6, opts);
            
              }
        
              else if(msg.text == "All bodies are fragile." || msg.text == "All bodies are imaginative."  || msg.text == "All bodies are convoluted."){
                bot.sendMessage(msg.chat.id,  connect7, noKeyboard);
                isHackingState1 = true;
                databaseActions.setIsHacking(2, msg.chat.id)
              }
              else if(result.rows[0].ishacking >= 2 && msg.text.length > 0){
                
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["I wanna deconstruct some more!"],
                      ["I wanna pick up the pieces and move on."],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect8, opts);
                isHackingState1 = false;
                databaseActions.setIsHacking(1, msg.chat.id);

              }
        
              else if(msg.text == "I wanna deconstruct some more!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["That sounds nice. 😊"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect9, opts);
              }
              else if(msg.text == "I wanna pick up the pieces and move on."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["That sounds nice. 😊"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  connect10, opts);
              }
        
              else if(msg.text == "That sounds nice. 😊"){
        
                endTreatmentFlow(msg.chat.id);
                hasHacked = true;
                databaseActions.setIsHacking(0, msg.chat.id);
                databaseActions.hasHacked(1, msg.chat.id);
              }
        
          
            }
          if(result.rows[0].isactivating >= 1){
        
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                  
                        keyboard: [
                          ["OMG 😱 WHAT THE HELL 😈"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  update1, opts);
        
                  }).catch();
              }
              else if(msg.text == "OMG 😱 WHAT THE HELL 😈"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Let's get diabolic 🫣!"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  update2, opts);
              }
        
              else if(msg.text == "Let's get diabolic 🫣!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Uff! Ready to talk to you about this 😏!"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  update3, opts);
              }
        
              else if(msg.text == "Uff! Ready to talk to you about this 😏!"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Start Digital Pleasure Assessment"]            ]
                  })
                };
                bot.sendMessage(msg.chat.id,  update4, opts);
            
              }
        
              else if(msg.text == "Start Digital Pleasure Assessment"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Constantly!"],
                      ["This was my first time - and I loved it"],
                      ["I would never"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  update5, opts);
            
              }
        
              else if(msg.text == "I would never" || msg.text == "This was my first time - and I loved it"  || msg.text == "Constantly!"){
                
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Hell Yeah! Understandable, really!"],
                    ]
                  })
                };
                
                bot.sendMessage(msg.chat.id,  update6, opts);
            
              }
        
              
              else if(msg.text == "Hell Yeah! Understandable, really!"){
                      
                bot.sendMessage(msg.chat.id,  update7).then(function(){
                  function followUp(){
        
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                        keyboard: [
                          ["done!"],
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  update8, opts)
                  }
                  bot.sendChatAction(
                    msg.chat.id,
                    "typing"
                  )
                  setTimeout(followUp, 2000);
                }).catch();
            
              }
        
              else if(msg.text == "done!"){
                      
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                    keyboard: [
                      ["Okay, I'll do it!"],
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  update9, opts);
            
              }
        
              else if(msg.text == "Okay, I'll do it!"){
                      
                bot.sendVideo(msg.chat.id,  update_img2).then(function(){
        
                  function followUp(){
        
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                        keyboard: [
                          ["done!"],
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  update10, opts).then(function(){
                      function followUp(){
                        endTreatmentFlow(msg.chat.id);
                        hasActivated = true;
                        databaseActions.setIsActivating(0, msg.chat.id);
                        databaseActions.hasActivated(1, msg.chat.id);
                      }
                      setTimeout(followUp, 2000);
        
                    }).catch();
                  }
        
                  setTimeout(followUp, 2000);
        
        
                }).catch();
            
              }
            }
          
          if(result.rows[0].isupdating >= 1){
        
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                      one_time_keyboard:true,
                  
                        keyboard: [
                          ["Wow, what's that? 😂"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  activate1, opts);
        
                  }).catch();
              }
              else if(msg.text == "Wow, what's that? 😂"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Got it! Let's get treated."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  activate2, opts);
              }
        
              else if(msg.text == "Got it! Let's get treated."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Done"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  activate3, opts);
              }
              else if(msg.text == "Done"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Start Digital Pleasure Assessment"],
                      ["skip"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  activate4, opts);
              }
        
              else if(msg.text == "Start Digital Pleasure Assessment"  || msg.text == "skip"){
                isUpdatingState1 = true;
                databaseActions.setIsUpdating(2, msg.chat.id);
                bot.sendMessage(msg.chat.id,  activate5, noKeyboard);
              }
              else if(result.rows[0].isupdating >= 2 && msg.text.length > 0){
        
                databaseActions.setIsUpdating(1, msg.chat.id);

        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["You're also very beautiful, Hot_Bot. ❤️"]
                    ]
                  })
                };
        
                function isNumeric(num){
                  return !isNaN(num)
                }
        
                if(isNumeric(msg.text)){
                  let score = parseInt(msg.text);
                  if(score > 10){
                    bot.sendMessage(msg.chat.id,  activate_beautyScore1, opts)
                  } else{
                    bot.sendMessage(msg.chat.id,  activate_beautyScore10, opts);
                  }
                } else {
                  bot.sendMessage(msg.chat.id,  activate_beautyScore1, opts);
                }
        
            
              }
              else if(msg.text == "You're also very beautiful, Hot_Bot. ❤️"){
                bot.sendMessage(msg.chat.id,  activate6).then(function(){
                  function followUp(){
                    bot.sendVideo(msg.chat.id, activate_img2).then(function(){
                      function followUp(){
        
                        const opts = {
                          reply_markup: JSON.stringify({
                          one_time_keyboard:true,
                      
                            keyboard: [
                              ["It's... familiar."],
                              ["Hydration is key!"],
                              ["Botox is my best friend."],
                              ["My wrinkles are proof of a life full of emotions - I appreciate each of them."]
                            ]
                          })
                        };
                        
                        bot.sendMessage(msg.chat.id, activate7, opts);
                      }
                      setTimeout(followUp, 1500);
                    }
                    ).catch();
                  }
                  setTimeout(followUp, 1500);
        
        
                }).catch();
              }
        
              else if(msg.text == "It's... familiar."  ||  msg.text == "Hydration is key!" || msg.text == "Botox is my best friend."  ||  msg.text == "My wrinkles are proof of a life full of emotions - I appreciate each of them."){
                hasupdated = true;
                endTreatmentFlow(msg.chat.id);
                databaseActions.setIsUpdating(0, msg.chat.id);
                databaseActions.hasUpdated(1, msg.chat.id);
              }
            
            }
      
          if(result.rows[0].isreleasing >= 1){
      
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                       one_time_keyboard:true,
                  
                        keyboard: [
                          ["Excuse me, what? 😅"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  refresh1, opts);
        
                  }).catch();
              }
              else if(msg.text == "Excuse me, what? 😅"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Let's get wet! 💦"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh2, opts);
              }
        
              else if(msg.text == "Let's get wet! 💦"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Ready to dry out again.✨"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh3, opts);
              }
        
              else if(msg.text == "Ready to dry out again.✨"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Start Digital Pleasure Assessment"],
                     
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh4, opts);
            
              }
        
              else if(msg.text == "Start Digital Pleasure Assessment"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["I bet you do, haha 😛"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh5, opts);
            
              }
              else if(msg.text == "I bet you do, haha 😛"){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Yeah, you mentioned this a few times..."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh6, opts);
            
              }
              else if(msg.text == "Yeah, you mentioned this a few times..."){
        
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["It'll be our little secret! 🤫"],
                      ["No 😳"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  refresh7, opts);
            
              }
        
              else if(msg.text == "No 😳" || msg.text == "It'll be our little secret! 🤫"){
                        
                bot.sendMessage(msg.chat.id,  refresh8).then(function(){
                  function followUp(){
                    bot.sendVideo(msg.chat.id, refresh_img2).then(function(){
        
                      function followUp(){

                        
                        bot.sendMessage(msg.chat.id, refresh9, noKeyboard).then(function(){
                          isReleasingState1 = true;
                          databaseActions.setIsReleasing(2, msg.chat.id);
                            
                        }).catch();
                      }
                      setTimeout(followUp, 5000);
        
        
                    }).catch();
                  }
                  setTimeout(followUp, 400);
                }).catch();
            
              }
        
              
              else if(result.rows[0].isreleasing >= 2 && msg.text.length > 0){
        
                isReleasingState1 = false;
                databaseActions.setIsReleasing(1, msg.chat.id);

                       
                bot.sendMessage(msg.chat.id,  refresh10).then(function(){
                  function followUp(){

                    bot.sendVideo(msg.chat.id, "BAACAgIAAxkBAAIhLmMsTOkeWs-MU4ewsAK-VJhJApHDAALkIQACEe9hSQ02xk3E30EDKQQ").then(function(){
                      endTreatmentFlow(msg.chat.id);
                      hasRefreshed = true;
                      databaseActions.setIsReleasing(0, msg.chat.id);
                      databaseActions.hasReleased(1, msg.chat.id);
                    }).catch();

                  }
        
                  setTimeout(followUp, 1500);
                }).catch();
            
              }
            }
        
          if(result.rows[0].isrefreshing >= 1){
        
              if(msg.text == "Let's start!"){
                bot.sendMessage(msg.chat.id, "Okay, great! I'm excited for you!").then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                       one_time_keyboard:true,
                  
                        keyboard: [
                          ["Are you sure we need this? 🥵"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  release1, opts);
        
                  }).catch();
              }
              else if(msg.text == "Are you sure we need this? 🥵"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Okay... I am willing to do this for us."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release2, opts);
              }
        
              else if(msg.text == "Okay... I am willing to do this for us."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Got it! Let's relax."]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release3, opts);
              }
        
              else if(msg.text == "Got it! Let's relax."){
        
                bot.sendMessage(msg.chat.id,  release4).then(function(){
                  bot.sendAudio(msg.chat.id, release_sound).then(function(){
                    
                    function followUp(){
                      const opts = {
                        reply_markup: JSON.stringify({
                        one_time_keyboard:true,
                          keyboard: [
                            ["Wakey, wakey!"],
                           
                          ]
                        })
                      };
                      bot.sendMessage(msg.chat.id, release5, opts);
                    }
                    setTimeout(followUp, 4000);
                     
                }).catch();
            
              });
              }
              else if(msg.text == "Wakey, wakey!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
              
                    keyboard: [
                      ["Good, i'm relaxed and my cellphone seems to be, too."],
                      ["Don't know, haven't been relaxed in a while, it's not so easy."],
                      ["Need more of this!"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release6, opts);
              }
        
              else if(msg.text == "Good, i'm relaxed and my cellphone seems to be, too."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
        
                    keyboard: [
                      ["Thanks"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release7, opts);
              }
              else if(msg.text == "Don't know, haven't been relaxed in a while, it's not so easy."){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
        
                    keyboard: [
                      ["Thanks"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release8, opts);
              }
              else if(msg.text == "Need more of this!"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
        
                    keyboard: [
                      ["Thanks"]
                    ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release9, opts);
              }
        
              else if(msg.text == "Thanks"){
                const opts = {
                  reply_markup: JSON.stringify({
                  one_time_keyboard:true,
                  inline_keyboard: [
                    [ { text: "The deep blue of an error screen", callback_data: 201 }],
                    [ { text: "The glowing red of the tinder logo", callback_data: 202 }],
                    [ { text: "The bright yellow of my first LAN cable", callback_data: 303 }],
                    [ { text: "The calming purple of artificial neon", callback_data: 404 }],
                    [ { text: "The fresh green of my notification light", callback_data: 505 }],
                  ]
                  })
                };
                bot.sendMessage(msg.chat.id,  release9, opts);
              }
        
              
            }   
            
          
          if(msg.text == "I speak bot lingo now"){
            
            const opts = {
              reply_markup: JSON.stringify({
                one_time_keyboard:true,
      
                keyboard: [
                  ["Okay what's up?"]
                ]
              })
            };
      
      
            bot.sendMessage(msg.chat.id, welcome_message2, opts);
          }
 
          if(msg.text == "Okay what's up?"){
            sendMessageWithSingleInlineKeyboard(1, msg.chat.id, beforewestart1, confirm_text);
          }
          else if(result.rows[0].isabletosendtheircustomresponse > 0 && msg.text.length > 0){
            userCanSendRandomString = false;

            databaseActions.isAbleToSendTheirCustomResponse(0, msg.chat.id);
      
            bot.sendMessage(msg.chat.id, welcome_text1).then(function(){
      
              const opts = {
                reply_markup: JSON.stringify({
                 one_time_keyboard:true,
        
                  keyboard: [
                    ["I'm cosy and ready!"],
                  ]
                })
              };
      
              bot.sendVideo(msg.chat.id, welcome_gif, opts);
              
        
            }).catch();
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
                function followUp(){
                  bot.sendVideo(msg.chat.id, convincing_img1).then(function(){
                    function followUp(){
                      bot.sendMessage(msg.chat.id, convincing_step2).then(function(){
        
                        bot.sendVideo(msg.chat.id, convincing_img2);
                      }).catch();
                    }
                    setTimeout(followUp, 5000);

                
                  }).catch();
                }
                setTimeout(followUp, 5000);
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
              function followUp(){
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
              }
              setTimeout(followUp, 5000);
    
              
        
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
                      ['Yes'],
                    ]
                  })
                };
          
                bot.sendMessage(msg.chat.id, "Have you completed the Face-Scan?", opts)
              }
              
              setTimeout(followup, 100);//wait 2 seconds
            }).catch();;
          }
          else if(msg.text == "Yes, there's a queue"){
      
            indexInRandomIntertainment =  Math.floor(Math.random() * random_entertainment.length-1);
            
            // var random_video_url = random_entertainment[indexInRandomIntertainment];
            var random_video_url = "BAACAgIAAxkBAAIIV2MnQgxLQe6SCHLN03Imq8RG6C63AAK0HAACqhE4SU9hA9JGgM25KQQ"
      
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
            
            var random_video_url = "BAACAgIAAxkBAAIIV2MnQgxLQe6SCHLN03Imq8RG6C63AAK0HAACqhE4SU9hA9JGgM25KQQ"
      
      
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
            bot.sendMessage(msg.chat.id, "Great, you did it. You're now logged in and a part of the digital pleasure center.").then(function(){
      
      
              function followup(){
                userCanSendRandomString = true;
                databaseActions.isAbleToSendTheirCustomResponse(1, msg.chat.id);
                bot.sendMessage(msg.chat.id, "Text me when you're in the center!", noKeyboard)
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
      
              bot.sendVideo(msg.chat.id,  welcome_gif2, opts);
              
        
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
      
              bot.sendVideo(msg.chat.id,  welcome_gif2, opts);
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
      
              // const opts = {
              //   reply_markup: ReplyKeyboardRemove()
      
              // };
      
              bot.sendVideo(msg.chat.id,  pleasure_meter_img2).then(function(){
      
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
      
            bot.sendMessage(msg.chat.id,  pleasure_meter_intro5).then(function(){
              
              bot.sendVideo(msg.chat.id,  cybergif).then(function(){
                const opts = {
                  reply_markup: JSON.stringify({
                   one_time_keyboard:true,
          
                    keyboard: [
                      ["That's pretty weird 😅 ?!"],
                    ]
                  })
                };
      
                bot.sendMessage(msg.chat.id,  cybertext1 , opts);
              }).catch();
                 
            }).catch();
      
      
          }
          else if(msg.text == "So high-tech!"){
      
            bot.sendVideo(msg.chat.id,  cybergif).then(function(){
              const opts = {
                reply_markup: JSON.stringify({
                 one_time_keyboard:true,
        
                  keyboard: [
                    ["That's pretty weird 😅 ?!"],
                  ]
                })
              };
      
              bot.sendMessage(msg.chat.id,  cybertext1 , opts);
            }).catch();
          }
          else if(msg.text == "That's pretty weird 😅 ?!"){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
      
                keyboard: [
                  ["Uhm... What 😳 ?!"],
                ]
              })
            };
      
            bot.sendMessage(msg.chat.id,  cybertext2 , opts);
          }   
          else if(msg.text == "Uhm... What 😳 ?!"){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
      
                keyboard: [
                  ["I touched one! 😲"],
                ]
              })
            };
      
            bot.sendMessage(msg.chat.id,  cybertext3 , opts);
          }
          else if(msg.text == "I touched one! 😲"){
            bot.sendMessage(msg.chat.id,  cybertext4).then(function(){
      
              bot.sendVideo(msg.chat.id,  cybergif_feel).then(function(){
      
                function followup(){
                  const opts = {
                    reply_markup: JSON.stringify({
                     one_time_keyboard:true,
            
                      keyboard: [
                        ["✨ Energetic"],
                        ["💋 Pleasureable"],
                        ["🧟 Weird"],
                        ["😩Uncomfortable"]
                      ]
                    })
                  };
            
                  bot.sendMessage(msg.chat.id, cyberquestion, opts)
                }
                
                setTimeout(followup, 100);//wait 2 seconds
              
      
      
              }).catch();
            }).catch();
          }
          else if(msg.text == "✨ Energetic" || msg.text == "💋 Pleasureable" || msg.text == "🧟 Weird" || msg.text == "😩Uncomfortable"){
            bot.sendMessage(msg.chat.id,  cyberquestionresponse).then(function(){
      
              function followup(){
            
                var randomSoftGif = cyberquestionresponsegifs[Math.floor(Math.random() * cyberquestionresponsegifs.length)]
                bot.sendVideo(msg.chat.id,  randomSoftGif).then(function(){
                  
                  StartTreatmentFlow(msg.chat.id);
      
                }).catch();
              }
              
              setTimeout(followup, 100);//wait 2 seconds
      
            }).catch();
      
          }
          else if(msg.text == "No, I need to pee"){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
      
                keyboard: [
                  ["Ready now!"],
                ]
              })
            };
      
            bot.sendMessage(msg.chat.id, pee_jealoucy, opts);
          }
          ////SEND MENU
          else if(msg.text == "Ready now!" || msg.text == "Yeah"){
      
            sendMenu(msg.chat.id);
      
          }
          ////Reflection Reflect pixels and cells
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("reflect") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("reflection")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("refle") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("relfec")) {
            ExitAllTreatments(msg.chat.id);
            isReflecting = true;
      
            bot.sendMessage(msg.chat.id, reflect_response).then(function(){
              function followUp(){
                bot.sendMessage(msg.chat.id, reflect_subline).then(
                  function(){
                    const opts = {
                      reply_markup: JSON.stringify({
                       one_time_keyboard:true,
                  
                        keyboard: [
                          ["Ready when you are!"]
                        ]
                      })
                    };
                    bot.sendMessage(msg.chat.id,  reflect1, opts);
          
                }).catch();
      
              }
              setTimeout(followUp, 1000);
            }).catch();
      
          }
      
          ////Connection
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("connect") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("connection")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("conne") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("connecting")) {
            
            if(!result.rows[0].ishacking > 0){
              ExitAllTreatments(msg.chat.id);
         
              StartTreatment(msg.chat.id, connect_response, connect_img1, connect_subline);
          
              isConnecting = true;
              databaseActions.setIsConnecting(1, msg.chat.id);
            }
           
          }
      
          ////Update
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("update") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("updat")||result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("upda")) {
            ExitAllTreatments(msg.chat.id);
      
            StartTreatment(msg.chat.id, update_response, update_img1, update_subline);
      
            isUpdating = true;
            databaseActions.setIsUpdating(1, msg.chat.id);

          }
      
          ////Refresh
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("refresh") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("refre")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("refr")) {
            ExitAllTreatments(msg.chat.id);
      
            StartTreatment(msg.chat.id, refresh_response, refresh_img1, refresh_subline);
            isRefreshing= true;
            databaseActions.setIsRefreshing(1, msg.chat.id);

          }
          
          ////Release
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("release") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("releasion")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("releease")) {
            ExitAllTreatments(msg.chat.id);
      
            StartTreatment(msg.chat.id, release_response, release_img1, release_subline);
            isReleasing = true;
            databaseActions.setIsReleasing(1, msg.chat.id);

          }
      
          ////Activate
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("activation") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("activa")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("activate")) {
            ExitAllTreatments(msg.chat.id);
      
            StartTreatment(msg.chat.id, activate_response, activate_img1, activate_subline);
            isActivating = true;
            databaseActions.setIsActivating(1, msg.chat.id);

          }
          ////hack
          else if(result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("hack") || result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("hacking")|| result.rows[0].isintreatment > 0 && msg.text.toLowerCase().includes("hack")) {
            ExitAllTreatments(msg.chat.id);
      
            StartTreatment(msg.chat.id, hack_response, hack_img1, hack_subline);
            isHacking = true;
            databaseActions.setIsHacking(1, msg.chat.id);

          }
      
      
      
      
       
       
      

      
      
          else if(result.rows[0].ishelping> 0 && msg.text == "Navigation of the Virtual Healing Hub"){
            bot.sendMessage(msg.chat.id,  "Here's instructions on how to get around the Virtual Healing Hub").then(function(){
              function followUp(){
                bot.sendMessage(msg.chat.id,  "Use the on-screen joysticks on the device: The left one controls your movement, the right one rotates your direction / perspective").then(
                  function(){
                    function followUp(){
                      bot.sendMessage(msg.chat.id,  "Alternatively, pinch the screen (with two fingers) to move and drag the screen (with one finger) to rotate your direction / perspective.").then(
                        function(){
                          function followUp(){
                            bot.sendPhoto(msg.chat.id,  "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1662805969/hotbot/IMG_1034_cgzvfm.jpg").then(
                              function(){
                                bot.sendPhoto(msg.chat.id,  "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1662805972/hotbot/IMG_1033_qess4i.jpg");
                                endHelpSession(msg.chat.id);
                              }
                            ).catch();
                          }
                          setTimeout(followUp, 500);
            
                      }).catch();
                    }
                    setTimeout(followUp, 500);
      
                }).catch();
              }
              setTimeout(followUp, 500);
            }).catch();
          }
      
          else if(result.rows[0].ishelping> 0 && msg.text == "Finding a treatment in the Center"){
            bot.sendMessage(msg.chat.id,  "Here's instructions on how to find treatments in the center").then(function(){
              function followUp(){
                bot.sendPhoto(msg.chat.id,  treatment_center_map).then(function(){
                  function followUp(){
                    bot.sendMessage(msg.chat.id, "Each treatment is marked by a corresponding symbol").then(
                      function(){
                        endHelpSession(msg.chat.id);
                      }
                    ).catch();
                  }
                  setTimeout(followUp, 500);
                }).catch();
              }
              setTimeout(followUp, 500);
            }).catch();
          }
      
          else if(result.rows[0].ishelping> 0 && msg.text == "Understanding a treatment protocol"){
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
               parse_mode: "html",
               inline_keyboard: [
                [ { text: "Virtual Healing Hub Treatment", callback_data: 301 }],
                [ { text:"Wrinkle Beauty Treatment", callback_data: 302 }],
                [ { text: "Relaxation Treatment", callback_data: 303 }],
                [ { text: "Crotch Weather Treatment", callback_data: 304 }],
                [ { text: "Curse Tablet Treatment", callback_data: 305 }],
                [ { text: "Unstable Matter Treatment", callback_data: 306 }],
              ]
              })
            };
            bot.sendMessage(msg.chat.id,  "Which treatment would you like to get information about?", opts);
          }   
          else if(result.rows[0].ishelping> 0 && msg.text == "Interacting with Hot_Bot"){
            bot.sendMessage(msg.chat.id,  "That's so weird that you ask me how to interact with me! 😂").then(function(){
              function followUp(){
                bot.sendMessage(msg.chat.id,  "Here's what you need to know about what human languages I understand: To answer my questions, select one of the response options displayed at the bottom of your screen. If you do not see them there, turn them on/off by clicking on the symbol to the right of the emoji selector above your keyboard that looks like a cube with the number four - it switches your input method from typing on a keyboard to selecting from a set of options.If this symbol does not appear, that means that you can respond to me by typing into the 'Write a message...' open decription box.If you experience a bug and cannot continue the conversation with me, type /menu and you will be taken back to the treatment overview where you can select to start over with a treatment or chose to begin with a different one.").then(function(){
                  function followUp(){
                    bot.sendPhoto(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/image/upload/v1662810498/hotbot/bot_interface_jtuhkj.png").then(
                      function(){
                        endHelpSession(msg.chat.id);
                      }
                    ).catch();
                  }
                  setTimeout(followUp, 100);
                }).catch();
              }
              setTimeout(followUp, 1000);
            }).catch();
          }
      
          else if(result.rows[0].ishelping > 0 && msg.text == "This was helpful"){

            databaseActions.isHelping(0, msg.chat.id);

            bot.sendMessage(msg.chat.id,  "Great! 👍").then(function(){
              function followUp(){
      
                const opts = {
                  reply_markup: JSON.stringify({
                   one_time_keyboard:true,
              
                    keyboard: [
                      ["/menu"],
                    ]
                  })
                };
      
                bot.sendMessage(msg.chat.id,  "Let's return to the treatment menu then, shall we? 😊", opts);
              }
              setTimeout(followUp, 500);
            }).catch();
          }
      
          else if(result.rows[0].ishelping> 0 && msg.text == "I need more help! 🥵"){
            bot.sendMessage(msg.chat.id,  "This is all I can help you with :( Perform the Recenter - Gesture to request additional support by an Interface (Human Body)").then(function(){
              function followUp(){
      
                const opts = {
                  reply_markup: JSON.stringify({
                   one_time_keyboard:true,
              
                    keyboard: [
                      ["/menu"],
                    ]
                  })
                };
      
                bot.sendMessage(msg.chat.id,  "When you're done and have received support, let's return to the treatment menu, shall we?", opts);
              }
              setTimeout(followUp, 2000);
            }).catch();
          }
      
          else if(result.rows[0].isexiting > 0  && msg.text == "Yes, initiate logging out."){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["Yes, thank you, I had the best time! 😍"],
                ]
              })
            };
            bot.sendMessage(msg.chat.id,  "Great! Have you been able to regenerate some of those pixels and cells?", opts);
          }
          else if(result.rows[0].isexiting > 0  && msg.text == "Yes, thank you, I had the best time! 😍"){
      
            bot.sendMessage(msg.chat.id,  "Everyone always tells me that! ❤️").then(function(){
              function followUp(){
                bot.sendMessage(msg.chat.id,  "Before we part ways, there's something I wanna give you:").then(function(){
      
                  // bot.sendVideo(msg.chat.id, imageGifts[Math.floor(Math.random() * imageGifts.length)]).then(function(){
                  bot.sendPhoto(msg.chat.id, "https://res.cloudinary.com/www-houseofkilling-com/image/upload/c_scale,w_366/v1663223407/hotbot/Interface_pleasureflowsbothways_aukpcy.jpg").then(function(){
      
                    function followUp(){
                      const opts = {
                        reply_markup: JSON.stringify({
                         one_time_keyboard:true,
                    
                          keyboard: [
                            ["Awww that's so thoughtful"],
                          ]
                        })
                      };
                      bot.sendMessage(msg.chat.id,  "Here's a screensaver  that I designed for you and your phone - so that you don't forget about me! Hope you like it. 💕", opts);
                
                    }
                    setTimeout(followUp, 500);
                  }).catch();
                }).catch();
              }
              setTimeout(followUp, 500);
      
            }).catch();
          }
      
          else if(result.rows[0].isexiting > 0 && msg.text == "Awww that's so thoughtful"){
            isExiting = false;
            databaseActions.isExiting(0, msg.chat.id);

            bot.sendMessage(msg.chat.id,  "I'm so happy you came! It's been my digital pleasure to chat with you. Have a lovely evening <3");
          }
      
          else if(result.rows[0].isexiting > 0 && msg.text == "No, I would like to remain logged in!"){
            isExiting = false;
            databaseActions.isExiting(0, msg.chat.id);
            
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["/menu"],
                ]
              })
            };
            bot.sendMessage(msg.chat.id,  "Great! Then let's take a look at the menu again:", opts);
          }
      
      
      
          else if(msg.text == "I need help to find the treatment"){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["Found it!"]
                ]
              })
            };
            bot.sendPhoto(msg.chat.id,  treatment_center_map, opts);
      
          }
      
      
          else if(msg.text == "I would rather do another treatment."  || msg.text == "This treatment is running at full capacity already."){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["Take a break"],
                  ["Select another treatment"]
                ]
              })
            };
            bot.sendMessage(msg.chat.id,  go_on_break1, opts);
      
          }
      
          else if(msg.text == "Select another treatment"){
      
            sendMenu(msg.chat.id);
      
          }
      
          else if(msg.text == "Take a break"){
      
            bot.sendMessage(msg.chat.id,  go_on_break2, noKeyboard).then(function(){
          
              isOnBreak = true;
              databaseActions.isOnBreak(1, msg.chat.id);
          
            }).catch();
      
          }
      
          else if(result.rows[0].isonbreak > 0 && msg.text.length > 0) {
            sendMenu(msg.chat.id);
            isOnBreak = false;
            databaseActions.isOnBreak(0, msg.chat.id);

          }
      

      
      
          if(msg.text == "Found it!"){
      
            const opts = {
              reply_markup: JSON.stringify({
               one_time_keyboard:true,
          
                keyboard: [
                  ["Let's start!"],
                  ["I would rather do another treatment."],
                  ["This treatment is running at full capacity already."]
      
                ]
              })
            };
            bot.sendMessage(msg.chat.id,  wanna_start_treatment, opts);
      
          }
      

        
  




        
      }
    });




});

function sendMenu(id){ 
  bot.sendChatAction(
    id,
    "typing"
  );
  ExitAllTreatments(id);

  databaseActions.getUser(id).then(result => {
    if(result.rowCount > 0){
      const opts = {
        reply_markup: JSON.stringify({
         one_time_keyboard:true,
         parse_mode: "html",
         inline_keyboard: [
          [ { text: result.rows[0].hasconnected > 0 ?  "CONNECT pixels and cells" :  "✨ CONNECT pixels and cells", callback_data: 101 }],
          [ { text: result.rows[0].hasupdated > 0 ? "UPDATE pixels and cells": "✨ UPDATE pixels and cells", callback_data: 102 }],
          [ { text: result.rows[0].hasreleased > 0? "RELEASE pixels and cells": "✨ RELEASE pixels and cells", callback_data: 103 }],
          [ { text: result.rows[0].hasrefreshed > 0 ? "REFRESH pixels and cells": "✨ REFRESH pixels and cells", callback_data: 104 }],
          [ { text: result.rows[0].hasactivated > 0 ? "ACTIVATE pixels and cells" : "✨ ACTIVATE pixels and cells", callback_data: 105 }],
          [ { text: result.rows[0].hashacked > 0 ? "HACK pixels and cells" : "✨ HACK pixels and cells", callback_data: 106 }],
          [ { text: result.rows[0].hasreflected > 0 ? "REFLECT pixels and cells" : "✨ REFLECT pixels and cells", callback_data: 107 }],
        ]
        })
      };
      bot.sendMessage(id,  menu, opts).then(function(){
        isInTreatmentFlow = true;
    
        databaseActions.setIsInTreatment(1, id);
    
        bot.sendMessage(id,  menu_exit, noKeyboard).then(function(){
          bot.sendMessage(id,  menu_time);
        }).catch();
    
      }).catch();


    } else {
      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,

          keyboard: [
            ["/start"]
          ]
        })
      };


      bot.sendMessage(id, "Will you start me first?", opts);

    }
  });


}

function StartTreatmentFlow(id){

  const opts = {
    reply_markup: JSON.stringify({
     one_time_keyboard:true,

      keyboard: [
        ["Yeah"],
        ["No, I need to pee"]
      ]
    })
  };
  bot.sendMessage(id, treatment_opening, opts);
}

function endTreatmentFlow(id){

  const opts = {
    reply_markup: JSON.stringify({
     one_time_keyboard:true,

      keyboard: [
        ["/menu"]      ]
    })
  };
  bot.sendMessage(id, end_treatment, opts);
}

function StartTreatment(id, response, image_url, subline ){

  databaseActions.setIsInTreatment(0, id);

  bot.sendMessage(id, response).then(function(){
    bot.sendChatAction(
      id,
      "typing"
    )

    function followup(){
      
      bot.sendPhoto(id, image_url).then(function(){
        
        function followUp1(){
          bot.sendMessage(id, subline).then(function(){


            function followup(){
  
              const opts = {
                reply_markup: JSON.stringify({
                 one_time_keyboard:true,
            
                  keyboard: [
                    ["I need help to find the treatment"],
                    ["Found it!"]
                  ]
                })
              };
              bot.sendMessage(id, treatment_start, opts);
  
            }
            setTimeout(followup, 5000);
  
  
          }).catch();
        }
        setTimeout(followUp1, 3000);


      }).catch();
    }
    
    setTimeout(followup, 3000);




  }).catch();

}


function ExitAllTreatments(id){
  databaseActions.setIsActivating(0, id );
  databaseActions.setIsConnecting(0, id );
  databaseActions.setIsHacking(0, id );
  databaseActions.setIsReflecting(0, id );
  databaseActions.setIsRefreshing(0, id );
  databaseActions.setIsReleasing(0, id );
  databaseActions.setIsUpdating(0, id );
}

function ExitAllOtherTreatments(id, treatmentname){

  if(treatmentname != "activation"){
    databaseActions.setIsActivating(0, id );
  }
  if(treatmentname != "connection"){
    databaseActions.setIsConnecting(0, id );
  }
  if(treatmentname != "hacking"){
    databaseActions.setIsHacking(0, id );
  }
  if(treatmentname != "reflecting"){
    databaseActions.setIsReflecting(0, id );
  }
  if(treatmentname != "refreshing"){
    databaseActions.setIsRefreshing(0, id );
  }
  if(treatmentname != "releasing"){
    databaseActions.setIsReleasing(0, id );
  }
  if(treatmentname != "updating"){
    databaseActions.setIsUpdating(0, id );
  }

  
}

function endHelpSession(id){
  const opts = {
    reply_markup: JSON.stringify({
      one_time_keyboard:true,
      keyboard: [
        ['This was helpful'],
        ['I need more help! 🥵'],
      ]
    })
  };

  bot.sendMessage(id,"Was this helpful?", opts);
  

}




bot.on("photo", msg => {
  bot.sendMessage(msg.chat.id,"thank you for that media " + msg.chat.first_name).then(function(){
    bot.sendMessage(msg.chat.id,"unfortunately i dont know what to do with that kind of content yet").then(function(){
      bot.sendPhoto(msg.chat.id, bot_selfie, {caption: "felt cute tho"});
    }).catch();
  }).catch();
});


bot.onText(/\/exit/, (msg) => {
  isExiting = true;
  databaseActions.isExiting(1, msg.chat.id);
  const opts = {
    reply_markup: JSON.stringify({
      one_time_keyboard:true,
      keyboard: [
        ['Yes, initiate logging out.'],
        ['No, I would like to remain logged in!'],
      ]
    })
  };
  bot.sendMessage(msg.chat.id,"Are you sure you want to end your treatments and leave the center? 😭", opts);

});



bot.onText(/\/help/, (msg) => {
  bot.sendChatAction(
    msg.chat.id,
    "typing"
  )

  databaseActions.getUser(msg.chat.id).then(result => {
    if(result.rowCount > 0 && result.rows[0].isintreatment > 0){
      
      databaseActions.isHelping(1, msg.chat.id);

      const opts = {
        reply_markup: JSON.stringify({
          one_time_keyboard:true,
          keyboard: [
            ['Navigation of the Virtual Healing Hub'],
            ['Finding a treatment in the Center'],
            ["Understanding a treatment protocol"],
            ["Interacting with Hot_Bot"]
          ]
        })
      };
      bot.sendMessage(msg.chat.id, "What do you need help with?", opts);

    } else {

      bot.sendMessage(msg.chat.id, "Error: The /help command will become available once you have selected your first treatment inside the Digital Pleasure Center");

    }
  });



});

bot.onText(/\/menu/, (msg) => {


  sendMenu(msg.chat.id, );

});



app.use(bodyParser.json());

app.listen(process.env.PORT);

app.post('/' + bot.token, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});