const nodemailer = require('nodemailer');

module.exports = {
  sendMail: function(emailText) {
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });
      
      var mailOptions = {
          from: process.env.EMAIL_USER,
          to: 'benhunt29@gmail.com',
          subject: 'Yikes',
          html: `<h1>Shit's on fire, yo</h1><p>${emailText}</p>`
      };
      
      transporter.sendMail(mailOptions, function(err, info){
         if (err) {
             return err;
         } else if (info) {
             return info;
         }
         
      });
  }  
};