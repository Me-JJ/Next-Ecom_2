import nodemailer from "nodemailer";

type profile = { name: string; email: string };

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "5b80522c7dafe0",
      pass: "1f214d2315665f",
    },
  });

  return transport;
};

const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>Please verify your email by clicking on <a href="${linkUrl}">this link</a></hi>`,
  });
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>Click on <a href="${linkUrl}">this link</a> to reset your password</h1>`,
  });
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  const transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>Your Password is updated successfully!</h1>.<a href="${process.env.SIGN_IN_URL}"> Login to your account.</a>`,
  });
};
export const sendEmail = (options: EmailOptions) => {
  const { profile, subject, linkUrl } = options;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
