'use strict';
require('dotenv').config();
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'readcastly@outlook.com',
        pass: process.env.OUTLOOK_PASSWORD
    }
});

const bodyMaker = function(readcast) {
    let body = 'Here is your Readcast of "' + readcast.title + '"';
    if (readcast.author) {
        body += ', by ' + readcast.author;
    }
    body += ', from ' + readcast.source + ".  Thank you for using Readcast.ly.  We're never gonna give you up.";
    return body;
};

const messageMaker = function(email,readcast) {
    return {
        from: '"Readcast.ly" <readcastly@gmail.com>',
        to: email,
        subject: "Readcast: " + readcast.title,
        attachments: [{
                path: readcast.location
        }],
        text: bodyMaker(readcast)
    };
};

const sendMail = function(email,readcast,callback) {
    transporter.sendMail(messageMaker(email,readcast), (error, info) => {
        if (error) {
            return console.log('ERROR SENDING MAIL ', error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
        callback(info);
    });
};


module.exports = {sendMail : sendMail};