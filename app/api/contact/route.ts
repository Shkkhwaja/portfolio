import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ success: false, error: 'All fields required' }, { status: 400 })
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD

  if (!user || !pass) {
    return NextResponse.json({ success: false, error: 'Email not configured' }, { status: 500 })
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  })

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${user}>`,
      to: 'khwajashaikh703@gmail.com',
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
          <div style="border-left:4px solid #FF5C39;padding-left:16px;margin-bottom:24px;">
            <h2 style="color:#FF5C39;margin:0 0 4px;">New Portfolio Message</h2>
            <p style="color:#777;margin:0;font-size:13px;">From your portfolio contact form</p>
          </div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;width:80px;">NAME</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;">EMAIL</td>
              <td style="padding:8px 0;color:#D4FF4F;font-size:14px;">${email}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;">SUBJECT</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${subject}</td>
            </tr>
          </table>
          <div style="background:#111;border-radius:8px;padding:20px;">
            <p style="color:#777;font-size:12px;font-family:monospace;margin:0 0 8px;">MESSAGE</p>
            <p style="color:#fff;font-size:14px;line-height:1.7;margin:0;white-space:pre-wrap;">${message}</p>
          </div>
          <p style="color:#555;font-size:11px;margin-top:24px;text-align:center;">
            Reply directly to this email to reach ${name} at ${email}
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] email send failed:', err)
    return NextResponse.json({ success: false, error: 'Send failed' }, { status: 500 })
  }
}
