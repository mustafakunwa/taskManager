const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SEND_GID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'm.kunwa52@gmail.com',
        subject: 'Welcome to task manager App',
        text: `Welcome to App ${name}.`
    })
}

const sendDeactivateEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'm.kunwa52@gmail.com',
        subject: 'Sorry to see you go!',
        text: `What would have been done to keep you our App?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDeactivateEmail
}
