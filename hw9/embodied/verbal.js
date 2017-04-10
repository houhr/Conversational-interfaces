/* verbal part */
var state = "initial"
var slowBreathInc = 0.1
var fastBreathInc = 0.6
var slowTimeBetweenBlinks = 4000
var fastTimeBetweenBlinks = 500

function startDictation() {

  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    /* Nonverbal actions at the start of listening */
    setTimeBetweenBlinks(fastTimeBetweenBlinks);
    setBreathInc(slowBreathInc);

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "zh-CN";
    recognition.start();

    setEyeColor("red");


    recognition.onresult = function(e) {
      document.getElementById('transcript').value
                               = e.results[0][0].transcript;
      var user_said = e.results[0][0].transcript;
      recognition.stop();
      setEyeColor('black');

      /* Nonverbal actions at the end of listening */
      setTimeBetweenBlinks(slowTimeBetweenBlinks);
      jump(); //perform a nonverbal action from nonverbal.js

      var bot_response = decide_response(user_said);
      speak(bot_response);
      console.log(bot_response);
      //`document.getElementById('labnol').submit();
    };

    recognition.onerror = function(e) {
      recognition.stop();
      setEyeColor('black');
    }

  }
}

/* decide what to say.
 * input: transcription of what user said
 * output: what bot should say
 */
function decide_response(user_said) {
   var response = "";

   console.log(user_said);

   var play_re = /(.+)\u5929\u6c14/;  // creating a regular expression
   var play_parse_array = user_said.match(play_re) // parsing the input string with the regular expression

   if (play_parse_array && state === "initial") {

     response = play_parse_array[1] + "\u73b0\u5728\u7684\u6e29\u5ea6\u4e3a\u0031\u0034\u6444\u6c0f\u5ea6\u3002";

     console.log(play_parse_array[1]);

   } else if (user_said.includes("\u5929\u6c14") || user_said.includes("\u6e29\u5ea6") && user_said.includes("\u5317\u4eac") && state === "initial") {
     response = "\u5317\u4eac\u73b0\u5728\u7684\u6e29\u5ea6\u4e3a\u0031\u0034\u6444\u6c0f\u5ea6\u3002";

     // other-repair (AB-yes)
   } else if (user_said.includes("\u5929\u6c14") && state === "initial") {
     response = "\u5317\u4eac\u7684\u5929\u6c14\uff1f";
     state = "weather_report"
   } else if (user_said.includes("\u662f\u7684") && state === "weather_report") {
     response = "\u5317\u4eac\u73b0\u5728\u7684\u6e29\u5ea6\u4e3a\u0031\u0034\u6444\u6c0f\u5ea6\u3002";
     state = "initial"

   } else if (user_said.includes("\u518d\u89c1")) {
     response = "\u518d\u89c1";
     state = "initial"

   } else {
     response = "\u6211\u4e0d\u660e\u767d\u4f60\u8bf4\u7684\u662f\u4ec0\u4e48\u610f\u601d\u3002";
   }
   return response;
 }


/* Load and print voices */
function printVoices() {
 // Fetch the available voices.
 var voices = speechSynthesis.getVoices();

 // Loop through each of the voices.
 voices.forEach(function(voice, i) {
      // console.log(voice.name)
 });
}

printVoices();


/*
 *speak out some text
 */
function speak(text, callback) {

 /* Nonverbal actions at the start of robot's speaking */
 setBreathInc(fastBreathInc);

 //console.log("Voices: ")
 printVoices();

 var u = new SpeechSynthesisUtterance();
 u.text = text;
 u.lang = 'zh-CN';
 u.volume = 0.8 //between 0.1
 u.pitch = 2.0 //between 0 and 2
 u.rate = 1.0 //between 0.1 and 5-ish
 u.voice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == "Google 普通话（中国大陆）"; })[0]; //pick a voice

 u.onend = function () {

     /* Nonverbal actions at the end of robot's speaking */
     setBreathInc(slowBreathInc);

     if (callback) {
         callback();
     }
 };

 u.onerror = function (e) {
     if (callback) {
         callback(e);
     }
 };

 speechSynthesis.speak(u);
}
