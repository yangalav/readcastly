// require('dotenv').config();
//
// const getTopNews = function(any args?) {
//
// }
//
// module.exports = {getTopNews: getTopNews};

// sample articles obj from API:
//
// {
//   "status": "ok",
//   "source": "the-next-web",
//   "sortBy": "latest",
//   "articles": [
//     {
//       "author": "Rachel Kaser",
//       "title": "Google, Amazon, Facebook and more beg FCC to respect net neutrality",
//       "description": "Rumor had it last week that the Federal Communications Commission was planning to roll back rules protecting net neutrality. Now several major companies who make up the backbone of the internet are fighting the change. The Internet Association, a lobby repping Amazon, Microsoft, Google, Facebook, Netflix and others, met with FCC Chairman Ajit Pai earlier this …",
//       "url": "https://thenextweb.com/politics/2017/04/12/google-amazon-facebook-beg-fcc-respect-net-neutrality/",
//       "urlToImage": "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/02/fcc-logo.jpg",
//       "publishedAt": "2017-04-12T17:30:06Z"
//     },
//     {
//       "author": "Napier Lopez",
//       "title": "Microsoft is announcing something big on May 2",
//       "description": "Microsoft is holding a major event on May 2, but we have almost no idea what’s coming. The company today sent out invites to the press in the usual cryptic fashion preceding a major hardware announcement, but the invite suggests there will be an education focus what with the ‘Learn what’s next’ caption and ‘#MicrosoftEDU’ subtitle. “We're …",
//       "url": "https://thenextweb.com/microsoft/2017/04/12/microsoft-announcing-something-big-may-2/",
//       "urlToImage": "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/Microsoft-May-2-Learn-Whats-Next.jpg",
//       "publishedAt": "2017-04-12T16:47:20Z"
//     },
//     {
//       "author": "Rachel Kaser",
//       "title": "Amazon's new dashboard gives parents eyes on their kids' browsers",
//       "description": "Amazon is adding a special dashboard for parents of tech-savvy kids to help them track their kids’ activity on Amazon devices. The dashboard and other features are an update to Amazon FreeTime, a parental control feature Amazon has had for years. With this, parents will get daily reports about their kids web activity. Parents, you’d …",
//       "url": "https://thenextweb.com/insider/2017/04/12/amazons-new-dashboard-gives-parents-eyes-kids-browsers/",
//       "urlToImage": "https://cdn1.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/parental-controls.jpg",
//       "publishedAt": "2017-04-12T15:57:46Z"
//     },
//     {
//       "author": "Mix",
//       "title": "Apple probably not leaving out millions of iPhones with next iOS update [Update]",
//       "description": "Apple is currently beta testing the next reiteration of iOS but it seems the upcoming version 10.3.2 will leave out millions of iPhone handsets.",
//       "url": "https://thenextweb.com/apple/2017/04/12/apple-ios-iphone-5-support/",
//       "urlToImage": "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/apple-iphone-ios.jpg",
//       "publishedAt": "2017-04-12T17:17:33Z"
//     },
//     {
//       "author": "Ayelet Noff",
//       "title": "PR is not the fucking worst, according to another actual PR person",
//       "description": "The following is a reply to the recently published piece: PR is the fucking worst, according to an actual PR person. If you’d like to fully savor this delicious beef, please be sure to read that first.  A few days ago, you – the man responsible for the so called “best PR Twitter” – graced us all …",
//       "url": "https://thenextweb.com/opinion/2017/04/12/pr-isnt-fucking-worst-im-calling-bullshit/",
//       "urlToImage": "https://cdn2.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/bs.jpg",
//       "publishedAt": "2017-04-12T15:35:04Z"
//     },
//     {
//       "author": "Mix",
//       "title": "This smart toilet paper monitor tells you when you need a new roll",
//       "description": "One resourceful inventor has built a real-time toilet paper monitor so you can track how much remaining toilet paper you have in real-time.",
//       "url": "https://thenextweb.com/gadgets/2017/04/12/toilet-paper-automatic-smart-monitor/",
//       "urlToImage": "https://cdn0.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/Screen-Shot-2017-04-12-at-15.25.13-2.png",
//       "publishedAt": "2017-04-12T14:31:21Z"
//     },
//     {
//       "author": "Matthew Hughes",
//       "title": "UK ISP Virgin Media accidentally blocks Facebook, Messenger, and Instagram",
//       "description": "Bad news for customers of Virgin Media, after a technical SNAFU saw the UK's third biggest ISP block Facebook, Instagram and Messenger.",
//       "url": "https://thenextweb.com/uk/2017/04/12/uk-isp-virgin-media-accidentally-blocks-facebook-messenger-and-instagram/",
//       "urlToImage": "https://cdn3.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/VirginMedia.jpg",
//       "publishedAt": "2017-04-12T13:55:32Z"
//     },
//     {
//       "author": "Matthew Hughes",
//       "title": "Ohio inmates used salvaged computers to commit credit card fraud from jail",
//       "description": "A forensic analysis of the computer's hard drive also uncovered a sizable amount of pornography.",
//       "url": "https://thenextweb.com/insider/2017/04/12/ohio-inmates-used-salvaged-computers-commit-credit-card-fraud-jail/",
//       "urlToImage": "https://cdn2.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/ComputersInCeiling.jpg",
//       "publishedAt": "2017-04-12T13:06:30Z"
//     },
//     {
//       "author": "Mix",
//       "title": "Samsung is reportedly prototyping a dual-screen smartphone",
//       "description": "Samsung might be gearing up to follow up its excellent Galaxy S8 flagship with a futuristic dual-screen smartphone concept.",
//       "url": "https://thenextweb.com/mobile/2017/04/12/samsung-dual-screen-smartphone-prototype/",
//       "urlToImage": "https://cdn2.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/Screen-Shot-2017-04-12-at-13.48.59.png",
//       "publishedAt": "2017-04-12T12:29:03Z"
//     },
//     {
//       "author": "Már Másson Maack",
//       "title": "Finnish Museum commits to playing a 1,000 year long GIF to the bitter end",
//       "description": "Kiasma, the Museum of Modern Art in Helsinki, has committed to displaying a 1,000 year long gif by Finnish artist Juha van Ingen.",
//       "url": "https://thenextweb.com/eu/2017/04/12/finnish-museum-commits-to-playing-a-1000-year-long-gif-to-the-bitter-end/",
//       "urlToImage": "https://cdn3.tnwcdn.com/wp-content/blogs.dir/1/files/2017/04/contemporary-art-kiasma-889852_1280.jpg",
//       "publishedAt": "2017-04-12T12:32:21Z"
//     }
//   ]
// }
