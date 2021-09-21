"use strict";
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

module.exports = {
    user: 'waterspy21@gmail.com',
    transporter : nodemailer.createTransport(smtpTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        secure: false,
        port: 25,
        auth: {
          user: 'waterspy21@gmail.com',
          pass: 'Projeto2021'
        },
        tls: {
            rejectUnauthorized: false
          }
      }))
};
