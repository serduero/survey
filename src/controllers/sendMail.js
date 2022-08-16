import nodemailer from 'nodemailer';

import { getUrlParameter } from './funciones.js';
import { varios } from './database.js';

const sendMail = (req, res) => {
    // console.log('en sendmail');

    // console.log(req.url);
    let adr = getUrlParameter('adr',req.url);

    // console.log(req.body['subject']);
    // console.log(req.body['html']);
    // console.log(varios.dir);
    // console.log(adr);

    if (adr !== false && adr !== null) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: varios.dir,
            pass: varios.psw
            },
            tls: {
                rejectUnauthorized: false
            }
        });
        
        let mailOptions = {
            from: varios.dir,
            to: adr,
            subject: req.body['subject'],
            html: req.body['html']
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                // console.log(error);
                res.send(error.toString());
            } else {
                // console.log('Email sent: ' + info.response);
                res.send('');
            }
        });
    }
}

export default sendMail;