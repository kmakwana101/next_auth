import * as nodemailer from 'nodemailer'

export async function sendMail(to: any, subject: any, text: any, html?: any) {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: "khushalmakwana786@gmail.com",
                pass: 'mdkokejuebbwskqt',
            },
        });

        let info = await transporter.sendMail({
            from: 'khushalmakwana786@gmail.com',
            to,
            subject,
            text: text,
            html: html
        });

        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error occurred while sending email:', error);
        return false; // Failed to send email
    }
}