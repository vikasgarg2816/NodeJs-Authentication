const nodeMailer = require('../config/nodemailer');

// generate send OTP (password recovery) mail
exports.verifypassword = (arr) => {
    let htmlString = nodeMailer.renderTemplate({otp:arr[1]},'/otp/otp_verify.ejs');
    nodeMailer.transporter.sendMail({
        from:'noreply201202@gmail.com',
        to: arr[0],
        subject: "Reset Password",
        html : htmlString
    },(err,info) => {
        if(err){
            console.log('Error in sending mail for reset password',err);
            return;
        }
        return;
    });
}