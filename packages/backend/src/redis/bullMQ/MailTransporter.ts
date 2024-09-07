import nodemailer from "nodemailer";

require('dotenv').config();

const mailTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    auth: {
        user: process.env["EMAIL_USERNAME"],
        pass: process.env["EMAIL_PASSWORD"]
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
});

export {mailTransporter};