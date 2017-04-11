// controller for Amazon Polly API
// Note: scroll to bottom for notes from dev guide and more commenting of code

// Issues:
  // • how to programatically access file on s3?
  // • do we need to generate a unique key for each object to append to its name so that each audio file is identifiable?
  // • how to programmatically generate an audio stream?
  // • how to programmatically generate an audio file?
  // • how to programmatically chop a text file up for audio processing, then concatenate it afterwards?

// => from within routes.js

  // app.post('/mailer', function(req,res) {
  //   let readcast = utils.readcastBuilder(req.body);
  //   //req.body will need all fields required for conversion, including title, author, and source, at a minimum, in addition to text
  //   //invoke function that converts article to speech, grab path
  //   readcast.location = //path to file;
  //   mailer.sendMail(req.body.email,readcast,function(confirmation){
  //     res.send(confirmation);
  //   });
  // });


// => from within utils.js => readcastBuilder ???
// req.body.text = ''
// req.body.fileName = `${}.mp3`
// req.body.type = 'stream'

// voiceId = 'Joanna', text = '', filename = 'speech.mp3', type = 'file'


// 1. Create a Polly Instance; load SDK, set config variables 
require('dotenv').config();
const AWS = require('aws-sdk')
AWS.config.accessKeyId = process.env.AWS_AKID
AWS.config.secretAccessKey = process.env.AWS_SAK
AWS.config.region = process.env.AWS_REGION 
// const Fs = require('fs')
// const uuid = require('node-uuid'); // needed? adds 37 chars  //$ npm install uuid --save
  // ref: https://github.com/kelektiv/node-uuid
const polly = new AWS.Polly(); 


// 2. Make API call to Polly (in Promise form); generate Audio Stream 
const generatePollyAudio = (text, voiceId) => {
  const params = {
    Text: text,
    TextType: 'text',
    OutputFormat: 'mp3',
    VoiceId: voiceId,
    SampleRate: '22050' 
  }

  // was return polly.synthesizeSpeech(params).promise().then
  Promise.resolve(polly.synthesizeSpeech(params))
  .then( data => {
    if (data.AudioStream instanceof Buffer) return data
  })
  .catch( err => throw 'AudioStream is not a Buffer.') 
};



// 3. Upload to S3
// ********** do we need to implement uuid.v4() ?
// ***** or is filename a unique value?
const bucketName = 'readcastly-user-files'// + uuid.v4();
const writeAudioStreamToS3 = ( audioStream, filename ) =>
  putObject(bucketName, filename, audioStream,'audio/mp3').then( res => {
    if(!res.ETag) throw res
    else return {
      msg: 'File successfully generated.',
      ETag: res.ETag,
      // was=> url: `https://s3-us-east-1.amazonaws.com/${bucketName}/${filename}`
      url: `https://s3.amazonaws.com/${bucketName}/${filename}`
    }
  })

const putObject = (bucket, key, body, ContentType) =>
  // was originally just s3.putObject({...}).promise()
  Promise.resolve(
    s3.putObject({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType
    }))


// ????? not clear on what is going on here **********
// helper function to chop up text for polly
const chopUpText = (text, charSeparator = '\n', maxLength = 1000) => {
  return text.split(charSeparator).reduce((memo, p) => {
    if(memo[memo.length - 1].length < maxLength) {
      memo[memo.length - 1] += charSeparator + p
      return memo
    }
    else {
      memo[memo.length] = p
      return memo
    }
  }, [[]])
}

// 4. contains main logic of pollyController
// query parameters dictate whether audio is generated as a file (to be saved) or stream (to be played)
export const textToSpeech = async (req, res) => {

  // ????? req.query ********** or req.body (?)
  const { voiceId = 'Joanna', text = '', filename = 'speech.mp3', type = 'file' } = req.body  
  // const { voiceId = 'Joanna', text = '', filename = 'speech.mp3', type = 'file' } = req.query

  // // Break in parts small enough to be handled by Polly API
  // ????? returns text in array of arrays; each subarray contains text amount within polly processing limit (???) **********
  const textParts = chopUpText(text) // => [['chunks'], ['of'], ['text']]
  // const audios = parts.map(part => await generatePollyAudio(part, voiceId)) // ???
  // alternative: code from https://github.com/Aaronbest94/Polly-Character-Limitations/blob/master/Polly.js

  // try {
  // const unifiedBuffer = 
  textParts.map((onePart) => await generatePollyAudio(onePart, voiceId))
  .then(function(audios) {
    return audios.map(a => a.AudioStream)
  })
  .then(function(audioStreams) {
    return Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))
  })
  .then(function(unifiedBuffer) {
    // save unifiedBuffer to s3 as mp3 file ////////////
    return writeAudioStreamToS3(unifiedBuffer.AudioStream, filename)
  })
  .then(function(response) {
    res.send({url: response.url})
  })
  .catch(function(err) {
    if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
    else res.status(500).send(err)    
  })
}


    // const audio = await generatePollyAudio(text, voiceId) // ???

    // // Concat AudioStreams into one Buffer
    // const audioStreams = audios.map(a => a.AudioStream)
    // const buffer = Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))
    // // ??? sending out buffer object? or url? (does url need to be accessed through server?)


//     // case: save an audio file
//     if(type === 'file') {
//       const data = await writeAudioStreamToS3(audio.AudioStream, filename)
//       res.send(data)
//     }
//     // case: provide an audio stream
//     else if (type === 'stream') {
//       res.send(audio.AudioStream)
//     }
//     else throw { errorCode: 400, error: 'Wrong type for output provided.' }
//   }
//   catch (err) {
//     if(err.errorCode && err.error) res.status(err.errorCode).send(err.error)
//     else res.status(500).send(err)
//   }
// }

/*-----------------------------------------------------------------*/

// ????? **********

// const someReallyUsefullFunction = async (text) => {
//     // Break in parts small enough to be handled by Polly API
//     const parts = chopUpText(text)
    
    // Concat AudioStreams in one Buffer
    // const audioStreams = audios.map(a => a.AudioStream)
    // const buffer = Buffer.concat(audioStreams, audioStreams.reduce((len, a) => len + a.length, 0))
    
    /*...*/
// }

////////////
// const generatePollyAudio = (text, voiceId) => {
//   const params = {
//     Text: text,
//     VoiceId: voiceId,
//     TextType: 'text'
//   }

//   return polly.synthesizeSpeech(params).promise().then( audio => {
//     if (audio.AudioStream instanceof Buffer) return audio
//     else throw 'AudioStream is not a Buffer.'
//   })

// }


// const chopUpText = (text, charSeparator = '\n', maxLength = 1000) => {
//   return text.split(charSeparator).reduce((memo, p) => {
//     if(memo[memo.length - 1].length < maxLength) {
//       memo[memo.length - 1] += charSeparator + p
//       return memo
//     }
//     else {
//       memo[memo.length] = p
//       return memo
//     }
//   }, [[]])
// }


// // PARAMS object (Note: scroll down for heavily commented version
// const params = {
//   OutputFormat: 'mp3',
//   SampleRate: '22050', 
//   Text: 'It was the best of times, it was the worst of times',
//   TextType: 'text',  
//   VoiceId: 'Joanna'
// };

// Polly Method to turn text into audio stream (Note: scroll down for commented version)
// polly.synthesizeSpeech( params, 
//   (err, data) => { 
//     if (err) console.error(err); 
//     else if (data) {  
//       console.log('RESPONSE.DATA: ', data);   
//       if (data.AudioStream instanceof Buffer) { 
//         Fs.writeFile("./speech.mp3", data.AudioStream, (err) => {
//           if (err) {
//             return console.error(err);
//           }
//           console.log("The file was saved!");
//         });
//       }
//     }
//   }
// );




/* 1.) NOTES and 2.) COMMENTED CODE below: ________________________________________*/


/* 1.) NOTES: __________________

From Amazon Polly Developer Guide:
"Amazon Polly converts input text into life-like speech. 
You just need to call the SynthesizeSpeech method, provide the text you wish to synthesize, 
select one of the available Text-to-Speech (TTS) voices, and specify an audio output format. 
Amazon Polly then synthesizes the provided text into a high-quality speech audio stream."

Re: Input Text: (plain text or SSML)
"...You can provide the input as plain text or in Speech Synthesis Markup Language (SSML) format. 
With SSML you can control various aspects of speech such as pronunciation, volume, pitch, and speech rate."
(SSML info: polly-dg: pp. 12 - 23)

Re: Output format: "...you might request the speech in the MP3 or Ogg Vorbis format to consume in web 
and mobile applications. Or, you might request the PCM output format for AWS IoT devices 
and telephony solutions."

SDKs vs CLI:
When using the SDKs, your requests to Amazon Polly are automatically signed and authenticated 
using the credentials you provide. This is the recommended choice for building your applications.

SynthesizeSpeech API Operation: LIMITS
-  input text can be up to 1500 billed characters (3000 total characters)
- The output audio stream (synthesis) is limited to 5 minutes, after which, 
any remaining speech is cut off.
(ref: polly-dg: pp. 61)
 ________________ */



/* 2.) COMMENTED CODE: 
How to use: select a block below and "uncomment" it to view code with comments alongside, 
then "comment" the block back before executing the code  __________________ */



// // PARAMS OBJECT: configure settings, as needed, for api request
// // ref: (ref: polly-dg: pp. 75 ~ 76)
// const params = {
//   // Applying LEXICONS Using the Console (Synthesize Speech) (polly-dg: pp. 24 ~ 37 )
//   // LexiconNames: ['STRING_VALUE'], /* optional list of one or more pronunciation lexicon names to be applied during synthesis */
//   // 
//   // mp3 || ogg_vorbis || pcm
//   OutputFormat: 'mp3', 
//   // SampleRate: valid values include:
//     // - for mp3 and ogg_vorbis: "8000", "16000", and "22050"; (default is "22050").
//     // - for pcm: "8000" and "16000" (default is "16000")
//   SampleRate: '8000', 
//   // Input text to synthesize
//   Text: 'It was the best of times, it was the worst of times',
//   // ssml || text
//   TextType: 'text',
//   // various voice choices available
//   // see Polly API for the list http://docs.aws.amazon.com/fr_fr/polly/latest/dg/API_Voice.html#API_Voice_Contents
//   VoiceId: 'Joanna'
// };



// // Polly Method to synthesize text into audio returned as stream of bytes:
// // (docs: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html#synthesizeSpeech-property)
// polly.synthesizeSpeech( params, // params object, detailed above
//   (err, data) => { // callback, invoked when response comes back from api service 
//     if (err) console.error(err); // handle error case
//     else if (data) { // if data returns successfully 
//       console.log('RESPONSE.DATA: ', data); 
//       // returned audio stream is nodejs Buffer instance   
//       if (data.AudioStream instanceof Buffer) { 
//         Fs.writeFile("./speech.mp3", data.AudioStream, (err) => {
//           if (err) {
//             return console.error(err);
//           }
//           console.log("The file was saved!");
//         });
//       }
//     }
//   }
// );


   /* 
   (AWS.Response): response object contains the following properties: error, data, AWS.Request
   • headers:
      ContentType: <string> (e.g., "audio/mpeg", reflects 'OutputFormat' specified in req params)
      RequestCharacters: <integer> (number of characters synthesized) 
   • (error): `null` if request is successful
   • (data): object contained in the response body:
     <varlistentry>
       AudioStream containing the synthesized speech as Binary String
     </varlistentry>
   • (AWS.Request): the original request object
   */

// 6c84fb90-12c4-11e1-840d-7b25c5ee775a
// https://readcastly-user-files.s3.amazonaws.com/polly-speech-sample.mp3
// https://s3-us-east-1.amazonaws.com/readcastly-user-files/polly-speech-sample.mp3
// us-east-1

// 6c84fb90-12c4-11e1-840d-7b25c5ee775a


