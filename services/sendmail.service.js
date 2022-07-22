import nodemailer from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

// const {
//   GOOGLE_MAILER_CLIENT_ID,
//   GOOGLE_MAILER_CLIENT_SECRET,
//   GOOGLE_MAILER_REFRESH_TOKEN,
//   ADMIN_EMAIL_ADDRESS,
// } = process.env;

const GOOGLE_MAILER_CLIENT_ID =
  "531087179658-fbr72863mlchdlc5udri8opkcgncsr8n.apps.googleusercontent.com";
const GOOGLE_MAILER_CLIENT_SECRET = "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";
const GOOGLE_MAILER_REFRESH_TOKEN =
  "1//04Aywkn4lsMZ_CgYIARAAGAQSNwF-L9Iri96AlF5G9EcMPIQqQe56t-TAXP8Dfx9h8BCGM_zv8MQgOFJIvBeuzfdhbrnQ1KiNHkI";
const ADMIN_EMAIL_ADDRESS = "khait.dev@gmail.com";

const getTransporter = async () => {
  // Khởi tạo OAuth2Client với Client ID và Client Secret
  const myOAuth2Client = new OAuth2Client(
    GOOGLE_MAILER_CLIENT_ID,
    GOOGLE_MAILER_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );
  // Set Refresh Token vào OAuth2Client Credentials
  myOAuth2Client.setCredentials({
    refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
  });

  const myAccessToken = await new Promise((resolve, reject) => {
    myOAuth2Client.getAccessToken((err, token) => {
      if (err) {
        reject();
      }
      console.log(token);
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: ADMIN_EMAIL_ADDRESS,
      clientId: GOOGLE_MAILER_CLIENT_ID,
      clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
      refresh_token: GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessToken,
    },
  });

  return transporter;
};

export const SEND_MAIL = async (to, url) => {
  try {
    const transporter = await getTransporter();
    const mailOptions = {
      from: "Testing service <khait.dev@gmail.com>",
      to: to,
      subject: "Forgot password",
      html: ` 
        <div>
            <p>This is reset password email</p>
            <p>Reset password in there: <a href=${url}> Click here </a> </p>
        </div>`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          resolve(false);
        } else {
          resolve(true);
          console.log("Email was sent >>>>>: " + info.response);
        }
      });
    });
  } catch (error) {
    console.log("error in send mail >>>>>>", error);
    throw error;
  }
};
