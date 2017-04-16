require('dotenv').config();
const User = require('./database/models/user');

const errors = {
    hasAlready: {"error": "This article is already in your database"},
    badUrl: {"error": "Sincere apologies from the Read.cast.ly team, but the URL submitted is one of a small number that our service cannot currently handle (such as URLs from LinkedIn Pulse). We will work on this!"}, // this is Mercury parser issue where it won't accept certain URLs
    mercuryCantParse: {"error": "The URL submitted is malformed. Please check that it does not have any extra characters on the front or back (e.g., a quotation mark) and resubmit the URL."}
};

const domainExtractor = function(url) {
  let start,end;
  let i=0;
  let length = url.length;
  while (!start || !end) {
    if(url[i] === '/' && url[i+1] === '/') {
      start = i+2;
      i+=3;
    } else if (url[i] === '/' || i === length) {
      end = i;
    } else {
      i++;
    }
  }
  return url.slice(start,end);
};

const textInspector = function(dbContents) {
  var cache = {};
  var pattern = /&#?\w+;/g;
  var results;
  console.log('========textInspector: Array.isArray(dbContents): ', Array.isArray(dbContents) )
  // console.log('------------dbContents[0]: ', dbContents[0] )
  dbContents.forEach(function(entryObj) {
    url = entryObj.url;
    results = entryObj.text.match(pattern);
    // (results === null) ? console.log('---- FOR this URL, results are NULL: ', url) : console.log('-----(utils.js: L-36) One Set of Results: ', results);
    if (results !== null) {
      results.forEach(function(item) {
        (!cache[item]) ? (cache[item] = 1) : cache[item]++;
      })
    }
  })
  return cache;
}

//=====================

const dbStats = function(dbContents) {
  console.log('server.utils.js l 28: running dbStats...');
  var count = 0;
  var total = 0;
  var highest = 0;
  var highestArray = [];
  var numOfHighestCountsToTrack = 25;

  var avg1 = function(arr) {
    for(var item of arr) {
    // console.log('\narticle id = ', item["id"]);
    // console.log('article word count = ', item["word_count"]);
      count++;
      total+= item["word_count"]
      // console.log('highestArray[highestArray.length-1] = ', highestArray[highestArray.length-1]);
      if(highestArray[highestArray.length-1] === undefined || item["word_count"] >    highestArray[highestArray.length-1]) {
        highestArray.push(item["word_count"]);
        highestArray.sort(function(a, b) {return b-a});
        if(highestArray.length > numOfHighestCountsToTrack) {
          highestArray.pop();
        }
        highest = highestArray[0];
      }
    }
    console.log('\n\nTotal # words in all articles in db = ', total);
    console.log('# of articles in db = ', count);
    console.log('Average word count = ', Math.floor(total / count));
    // console.log('\n', numOfHighestCountsToTrack, ' articles with highest word counts: ', highestArray);
  };
  avg1(dbContents);

  var variedAverages = function(arr) {
    var reduction = function(numOfHighestToSubtract) {
      // console.log('\n\n# of highest word counts to remove = ', numOfHighestToSubtract);
      var subArray = highestArray.slice(0, numOfHighestToSubtract);
      var reduced = subArray.reduce(function(acc, val) {
        return acc + val;
      });
      // console.log('\nReducing # words by: ', reduced);
      return reduced;
    }

    for(var z=0; z < arr.length; z++) {
      var newAvg = Math.floor((total - reduction(arr[z])) / (count - arr[z]));
      // console.log('i.e., the avg. word count if we remove the ', arr[z], ' longest articles = ', newAvg);
    }
  }
  variedAverages([10, 7, 5, 3, 1]) // these are the scenarios to run: # of highest word counts to remove
};


const readcastBuilder = function(articleObj) {
// placeholder
  return articleObj.title;

}


// invoked (in mercuryController) when first posting an article / url
const preStripSpacing = function(textInput) {
  let headerTag = /(\<)(h[1-6])(\>)(.*?)(\<\/)(h[1-6])(\>)/g;
  let breakTag = /(\<br\>)/g;
  let periodTag = /(\.)(\<)/g;
  let parenTag = /(\.)(\<)/g;
  let tagCaps = /\>([A-Z])/g;
  return textInput
    .replace(headerTag, " $1$2$3\'$4\.\'$5$6$7\n") // e.g., before("</h>") => after(". </h>") // WAITERS  
    .replace(breakTag, ". $1") // e.g., before("<br>") => after(". <br>") // WAITERS
    .replace(periodTag, "$1 $2") // e.g., before(".<") => after(". <")
    .replace(parenTag, "$1 $2") // e.g., before(")<") => after(") <")
    .replace(tagCaps, "\>\. $1") // e.g., before(">A") => after("> A")
}

// function to convert hexadecimal character codes into their character equivalents; 
const unescapeHex = function(unsafe) {
  return unsafe
    .replace(/&quot;/g, "\"")    
    .replace(/&apos;/g, "\'") 
    .replace(/&#x22;/g, "\"")
    .replace(/&#x201(C|D);/g, "\"")
    .replace(/&#x201(8|9);/g, "\'")    
    .replace(/&#xA0;/g, " ")    
    .replace(/&#x2026;/g, "...")
    // catch-all for other hexadecimal char patterns, replacing them with a "-"
    .replace(/&#?\w+;/g, "-")
}

const postStripSpacing = function(textInput) {
  let parenChar = /(\))(\w)/g
  let dotCaps = /\.([A-Z])/g  
  return textInput
    .replace(parenChar, "$1 $2") // e.g., before(")a") => after(") a")
    .replace(dotCaps, "\.\s$1") // e.g., before(".A") => after(". A") // DOT - MELO
}


/*
http://www.espn.com/nba/story/_/id/19159149/carmelo-anthony-better-somewhere-else-phil-jackson-says
*/

// const addPausesToHtml = function(textInput) {
//   // let manyTag = /(\<\s?\/?\s?)(br|h\d?|li)\s?\>/g;
//   // let periodTag = /(\.)(\<)/g;
//   return textInput
//       .replace(/(\<\s?\/?\s?)(br|h\d?|li)\s?\>/g, " . $1$2")
//       .replace(/(\.)(\<)/g, "$1 $2")
// }
// const addPausesToHtml = function(textInput) {
//   let manyTag = /(\<\s?\/?\s?)(br|h\d?|li)\s?\>/g;
//   let periodTag = /(\.)(\<)/g;
//   return textInput
//     .replace(manyTag, " . $1$2")
//     .replace(periodTag, "$1 $2")
// }

module.exports = { 
  errors, 
  domainExtractor, 
  dbStats, 
  readcastBuilder, 
  textInspector, 
  preStripSpacing,
  unescapeHex,
  postStripSpacing
};



