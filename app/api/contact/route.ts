import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const name    = (formData.get('name')    as string | null)?.trim()
    const email   = (formData.get('email')   as string | null)?.trim()
    const subject = (formData.get('subject') as string | null)?.trim()
    const message = (formData.get('message') as string | null)?.trim()
    const file    =  formData.get('attachment') as File | null

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 })
    }

    const gmailUser = process.env.GMAIL_USER
    const gmailPass = process.env.GMAIL_APP_PASSWORD

    if (!gmailUser || !gmailPass) {
      console.error('[contact] GMAIL_USER or GMAIL_APP_PASSWORD not set')
      return NextResponse.json({ success: false, error: 'Server email not configured.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailPass },
    })

    // Build optional attachment
    const attachments: nodemailer.SendMailOptions['attachments'] = []
    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer())
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type || 'application/octet-stream',
      })
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${gmailUser}>`,
      to: gmailUser,           // sends to your own Gmail
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;">
          <div style="border-left:4px solid #FF5C39;padding-left:16px;margin-bottom:24px;">
            <h2 style="color:#FF5C39;margin:0 0 4px;">New Portfolio Message</h2>
            <p style="color:#777;margin:0;font-size:13px;">Received via portfolio contact form</p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;width:80px;">NAME</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;">EMAIL</td>
              <td style="padding:8px 0;color:#D4FF4F;font-size:14px;"><a href="mailto:${email}" style="color:#D4FF4F;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;">SUBJECT</td>
              <td style="padding:8px 0;color:#fff;font-size:14px;">${subject}</td>
            </tr>
            ${attachments.length > 0 ? `
            <tr>
              <td style="padding:8px 0;color:#777;font-size:12px;font-family:monospace;">FILE</td>
              <td style="padding:8px 0;color:#D4FF4F;font-size:14px;">📎 ${file!.name} (${(file!.size / 1024).toFixed(1)} KB)</td>
            </tr>` : ''}
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
      attachments,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[contact] send failed:', err)
    return NextResponse.json({ success: false, error: 'Failed to send. Try again.' }, { status: 500 })
  }
}
