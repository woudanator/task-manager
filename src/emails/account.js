const sgMail = require('@sendgrid/mail');

const sendgridApiKey = "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";

sgMail.setApiKey(sendgridApiKey);

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
