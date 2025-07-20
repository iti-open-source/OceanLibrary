import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { UserDocument } from "../types/entities/user.js";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_SERVICE_USERNAME,
    pass: process.env.EMAIL_SERVICE_PASSWORD,
  },
});

export function sendVerificationMail(user: UserDocument, URL: string) {
  const options = {
    from: process.env.EMAIL_SERVICE_SENDER,
    to: user.email,
    subject: "Account Verification",
    text: `Verify your account:\n${URL}`,
    html: `
      <h4>Verify Your Email Address</h4>
        <p>
          Hello ${user.username}! Please click the button below to verify your email.
        </p>

        <a
          href="${URL}"
          style="
            display: inline-block;
            padding: 10px 25px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;"
          >
          Verify Email
        </a>

        <p style="font-size: 14px; margin-top: 25px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>

        <p style="font-size: 14px; word-break: break-all;">
          <a href="${URL}">${URL}</a>
        </p>
      `,
  };

  transporter.sendMail(
    options,
    (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    }
  );
}

export function sendResetPasswordEmail(user: UserDocument, URL: string) {
  const options = {
    from: process.env.EMAIL_SERVICE_SENDER,
    to: user.email,
    subject: "Password Reset",
    text: `Reset your password:\n${URL}`,
    html: `
      <h4>Reset Password</h4>
        <p>
          Hello ${user.username}! Please click the button below to reset your password.
        </p>

        <a
          href="${URL}"
          style="
            display: inline-block;
            padding: 10px 25px;
            margin-top: 20px;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;"
        >
          Reset Password
        </a>

        <p style="font-size: 14px; margin-top: 25px;">
          If the button above doesn't work, copy and paste this link into your browser:
        </p>

        <p style="font-size: 14px; word-break: break-all;">
          <a href="${URL}">${URL}</a>
        </p>
        `,
  };

  transporter.sendMail(
    options,
    (err: Error | null, info: SMTPTransport.SentMessageInfo) => {
      if (err) {
        console.log(err);
      } else {
        console.log(info.response);
      }
    }
  );
}
