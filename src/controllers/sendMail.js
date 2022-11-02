import nodemailer from 'nodemailer';

import { getUrlParameter } from './funciones.js';
import { varios } from './database.js';

const sendMail = (req, res) => {

    let adr = getUrlParameter('adr',req.url);

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
                res.send(error.toString());
            } else {
                res.send('');
            }
        });
    }
}

export default sendMail;