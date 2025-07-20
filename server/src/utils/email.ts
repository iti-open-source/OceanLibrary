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
    subject: "Ocean Library - Reset Your Password",
    text: `Reset your password:\n${URL}`,
    html: `
      <div style="font-family: 'Roboto', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f6ea;">
        <div style="background-color: #ffffff; border-radius: 12px; padding: 40px; border: 1px solid #d2c8b4;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-family: 'DM Serif Display', serif; color: #5a471d; font-size: 28px; margin-bottom: 10px;">Ocean Library</h1>
            <h2 style="color: #5a471d; font-size: 24px; margin-bottom: 10px;">Reset Your Password</h2>
          </div>
          
          <p style="color: #5a471d; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Hello <strong>${user.username}</strong>!
          </p>
          
          <p style="color: #5a471d; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. Click the button below to create a new password for your Ocean Library account.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a
              href="${URL}"
              style="
                display: inline-block;
                padding: 15px 30px;
                background-color: #5a471d;
                color: #ffffff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
              "
            >
              Reset Password
            </a>
          </div>

          <p style="color: #827350; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If the button above doesn't work, copy and paste this link into your browser:
          </p>

          <p style="color: #827350; font-size: 14px; word-break: break-all; background-color: #f9f6ea; padding: 10px; border-radius: 4px;">
            <a href="${URL}" style="color: #5a471d;">${URL}</a>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #d2c8b4;">
            <p style="color: #827350; font-size: 12px; line-height: 1.6; margin-bottom: 5px;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
            </p>
            <p style="color: #827350; font-size: 12px; line-height: 1.6;">
              This link will expire in 10 minutes for security reasons.
            </p>
          </div>
        </div>
      </div>
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
