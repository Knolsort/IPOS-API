import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

export const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "asayn.com@gmail.com",
        pass: "ngds tkse vwzq qwjx",
    },
});

const sendEmail = async (): Promise<void> => {
    try {
        const mailOptions: SendMailOptions = {
            from: '"Welcome to Barter 👻" <asayn.com@gmail.com>', // sender address
            to: "rabeehinfineur@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error("Email send error:", error);
    }
};

// sendEmail();
