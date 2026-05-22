import nodemailer from 'nodemailer';

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const isMock = !SMTP_USER || !SMTP_PASS || SMTP_USER === 'your_gmail@gmail.com';
const FROM_EMAIL = `"Aurea" <${SMTP_USER || 'onboarding@aurea.com'}>`;

export const sendVerificationEmail = async (email, otp, name) => {
  if (isMock) {
    console.log(`\n\n=== 📧 MOCK EMAIL TO ${email} ===`);
    console.log(`Subject: Your Aurea verification code`);
    console.log(`OTP Code: ${otp}`);
    console.log(`=======================================\n\n`);
    // Return domainRestricted so frontend knows it's a mock
    return { success: true, mock: true, domainRestricted: true };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Aurea verification code',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1a1a1a;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: normal; margin-bottom: 24px; text-align: center; letter-spacing: 0.1em;">AUREA</h1>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Hi ${name || 'there'},</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">Welcome to Aurea! Please use the verification code below to complete your registration.</p>
          
          <div style="background-color: #fafafa; border: 1px solid #eaeaea; border-radius: 8px; padding: 32px; text-align: center; margin-bottom: 32px;">
            <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 12px; margin-top: 0;">Your Verification Code</p>
            <p style="font-size: 40px; font-weight: bold; letter-spacing: 0.4em; margin: 0; color: #1a1a1a;">${otp}</p>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 40px;">This code will expire in <strong>10 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
          
          <div style="border-top: 1px solid #eaeaea; padding-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">&copy; ${new Date().getFullYear()} Aurea Cosmetics. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    console.log('Verification email sent:', info.messageId);
    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email: ' + error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (isMock) {
    console.log(`\n\n=== 📧 MOCK EMAIL TO ${email} ===`);
    console.log(`Subject: Welcome to Aurea!`);
    console.log(`=======================================\n\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Aurea!',
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff; color: #1a1a1a;">
          <h1 style="font-family: 'Playfair Display', serif; font-size: 28px; font-weight: normal; margin-bottom: 24px; text-align: center; letter-spacing: 0.1em;">AUREA</h1>
          <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 24px;">Welcome to the family, ${name}! ✨</h2>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">Your account has been successfully created. We are thrilled to have you here.</p>
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 32px;">At Aurea, we believe in premium, high-quality makeup that enhances your natural beauty. Enjoy exploring our latest collections!</p>
          
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; background-color: #1a1a1a; color: #ffffff; padding: 14px 32px; text-decoration: none; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; border-radius: 4px;">Start Shopping</a>
          </div>
          
          <div style="border-top: 1px solid #eaeaea; padding-top: 24px; text-align: center;">
            <p style="font-size: 12px; color: #999; margin: 0;">&copy; ${new Date().getFullYear()} Aurea Cosmetics. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return { success: true, data: info };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw for welcome emails so we don't break the registration flow if it fails
    return { success: false, error };
  }
};
