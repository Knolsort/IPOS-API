import { SendMailOptions } from "nodemailer";
import { transporter } from "./Email.config";

export const sendOTPCode = async (email: string, otp: string) => {
    try {
        const mailOptions: SendMailOptions = {
            from: '"Welcome to Barter 👻" <asayn.com@gmail.com>', // sender address
            to: email, // list of receivers
            subject: "OTP", // Subject line
            text: "Not send your OTP code for others", // plain text body
            html: otp, // html body
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("OTP sent success: %s", info.messageId);
    } catch (error) {
        console.error("Email send error:", error);
    }
}; 