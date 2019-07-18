const sgMail = require('@sendgrid/mail');


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const welcomeMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: "reynw@packetsky.com",
        subject: "Welcome to Taskman",
        text: `Hi welcome to taskman ${name}, hope you enjoy the app`
    });
}

const cancellationMail = (email,name)=>{
    sgMail.send({
        to: email,
        from: "reynw@packetsky.com",
        subject: "Sad to see you go",
        text: `Your account has been cancelled ${name}, please let us know what we can do to improve service`
    });
}

module.exports = {
    welcomeMail,
    cancellationMail
}
