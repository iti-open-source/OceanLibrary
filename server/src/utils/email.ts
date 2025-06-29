import nodemailer from "nodemailer";

export async function userServiceMail(info: object) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVICE_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_SERVICE_USERNAME,
      pass: process.env.EMAIL_SERVICE_PASSWORD,
    },
  });
  await transporter.sendMail(info);
}
