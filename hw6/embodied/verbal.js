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

    recognition.lang = "en-US";
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

      var bot_response = decide_response(user_said)
      speak(bot_response)

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
   var response;

   var play_re = /weather\sin\s(.+)/i;  // creating a regular expression
   var play_parse_array = user_said.match(play_re) // parsing the input string with the regular expression

   if (play_parse_array && state === "initial") {

     response = "The current weather in" + play_parse_array[1] + "is 14 celsius degree";

   } else if (user_said.toLowerCase().includes("weather") || user_said.toLowerCase().includes("temperature") && user_said.toLowerCase().includes("san francisco") && state === "initial") {
     response = "The current weather in san francisco is 14 celsius degree";

     // embedded corrections
   } else if (user_said.toLowerCase().includes("weather") || user_said.toLowerCase().includes("temperature") && user_said.toLowerCase().includes("SF") && state === "initial") {
     response = "The current weather in san francisco is 14 celsius degree";

     // other-repair (AB-yes)
   } else if (user_said.toLowerCase().includes("weather") && state === "initial") {
     response = "Weather in San Francisco?";
     state = "weather_report"
   } else if (user_said.toLowerCase().includes("yes") && state === "weather_report") {
     response = "The current weather in san francisco is 14 celsius degree";
     state = "initial"

   } else if (user_said.toLowerCase().includes("bye")) {
     response = "good bye to you!";
     state = "initial"

   } else if (user_said.toLowerCase().includes("usually looks like")) {
     response = "It's cold in the morring and evening, but warm in the noon.";
     state = "initial"

   } else {
     response = "i don't get it";
   }
   return response;
 }

/*
 *speak out some text
 */
function speak(text, callback) {

  /* Nonverbal actions at the start of robot's speaking */
  setBreathInc(fastBreathInc);

  var u = new SpeechSynthesisUtterance();
  u.text = text;
  u.lang = 'en-US';

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
