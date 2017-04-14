'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');
const polly = require('./pollyController');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'readcastly@gmail.com',
        pass: process.env.GMAIL_PASSWORD
    }
});

const bodyMaker = function(article) {
    let body = 'Here is your Readcast of "' + article.title + '"';
    if (article.author) {
        body += ', by ' + article.author;
    }
    body += ', from ' + article.source_name + ".  Thank you for using Readcast.ly.  We're never gonna give you up.";
    return body;
};

const messageMaker = function(email,article,url) {
    return {
        from: '"Readcast.ly" <readcastly@gmail.com>',
        to: email,
        subject: "Readcast: " + article.title,
        attachments: [{
                path: url
        }],
        text: bodyMaker(article)
    };
};

const mailIt = function(email,article,url,callback) {
    transporter.sendMail(messageMaker(email,article,url), (error, info) => {
        if (error) {
            return console.log('ERROR SENDING MAIL ', error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        callback(info.accepted[0]);
    });
};

const sendMail = function(req,res,callback) {
    polly.textToSpeech(req,res,function(url) {
        mailIt(req.body.payload.destination,req.body.payload.article,url,callback);
    });
};


module.exports = { sendMail: sendMail };