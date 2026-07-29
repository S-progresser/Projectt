import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email, otp, name } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP code are required.' }, { status: 400 });
    }

    const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE !== 'false';

    let transporter;
    let isTestAccount = false;

    if (smtpUser && smtpPass) {
      transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });
    } else {
      // Auto-generate Ethereal test email account so sending email ALWAYS works out-of-the-box!
      try {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        isTestAccount = true;
      } catch (testAccErr) {
        console.error('Failed to create test email account:', testAccErr);
        return NextResponse.json({
          error: 'Email dispatch failed. Please configure SMTP_USER and SMTP_PASS in .env.local.'
        }, { status: 500 });
      }
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || (smtpUser ? `"Academic Portal" <${smtpUser}>` : `"Academic Portal" <no-reply@eduportal.com>`),
      to: email,
      subject: `[OTP Code: ${otp}] Academic Portal Email Verification`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #d97706; margin-top: 0;">Student Registration OTP Code</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">Hello <strong>${name || 'Student'}</strong>,</p>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">Your 6-digit Email Verification OTP code is:</p>
          <div style="text-align: center; margin: 24px 0; padding: 20px; background-color: #eef2ff; border: 2px dashed #6366f1; border-radius: 12px;">
            <span style="font-size: 34px; font-weight: bold; letter-spacing: 8px; color: #3730a3;">${otp}</span>
          </div>
          <p style="color: #64748b; font-size: 13px;">Please enter this code on the registration page to verify your email address before setting up your password.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #94a3b8; font-size: 11px;">If you did not request this verification code, please ignore this message.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    let previewUrl = null;

    if (isTestAccount) {
      previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`[OTP Sent to ${email}] Ethereal Preview URL: ${previewUrl}`);
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent successfully to ${email}`,
      previewUrl: previewUrl || undefined,
      isTestAccount
    });
  } catch (error) {
    console.error('Error sending OTP email via SMTP:', error);
    return NextResponse.json({
      error: `Failed to deliver email: ${error.message || 'Check SMTP credentials in .env.local'}`
    }, { status: 500 });
  }
}
