import os
import smtplib
import logging
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
SMTP_USER = os.getenv('SMTP_USER')
SMTP_PASS = os.getenv('SMTP_PASS')
NOTIFY_EMAIL = os.getenv('NOTIFY_EMAIL')


def send_registration_email(registration) -> None:
    """Send a notification email when a new registration is created."""
    if not all([SMTP_USER, SMTP_PASS, NOTIFY_EMAIL]):
        logger.warning(
            "Email notification skipped: SMTP_USER, SMTP_PASS, or NOTIFY_EMAIL "
            "not set in .env"
        )
        return

    try:
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🎉 New Registration: {registration.full_name} ({registration.pass_type.upper()})"
        msg['From'] = f"Ad Makerrrs <{SMTP_USER}>"
        msg['To'] = NOTIFY_EMAIL

        # Plain-text fallback
        text_body = f"""\
New Registration on Ad Makerrrs Landing Page
---------------------------------------------
Name:       {registration.full_name}
Email:      {registration.email}
Pass Type:  {registration.pass_type.upper()}
A/B Variant:{registration.variant}
Registered: {registration.created_at.strftime('%d %b %Y, %I:%M %p')}
"""

        # HTML version
        pass_colors = {
            'silver': '#9e9e9e',
            'gold': '#f9a825',
            'vip': '#7c4dff',
        }
        badge_color = pass_colors.get(registration.pass_type, '#444')

        html_body = f"""\
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0"
               style="background:#1a1a2e;border-radius:16px;overflow:hidden;
                      border:1px solid #2a2a4a;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#667eea,#764ba2);
                       padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;
                         letter-spacing:1px;">Ad Makerrrs</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">
                New Registration Alert
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;color:#a0a0c0;font-size:15px;">
                Someone just registered! Here are their details:
              </p>
              <!-- Info rows -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#7070a0;font-size:13px;width:120px;">Name</td>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#e0e0f0;font-size:15px;font-weight:600;">
                    {registration.full_name}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#7070a0;font-size:13px;">Email</td>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;">
                    <a href="mailto:{registration.email}"
                       style="color:#667eea;font-size:15px;text-decoration:none;">
                      {registration.email}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#7070a0;font-size:13px;">Pass Type</td>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;">
                    <span style="background:{badge_color};color:#fff;padding:3px 12px;
                                 border-radius:20px;font-size:13px;font-weight:700;
                                 text-transform:uppercase;letter-spacing:1px;">
                      {registration.pass_type}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#7070a0;font-size:13px;">A/B Variant</td>
                  <td style="padding:10px 0;border-bottom:1px solid #2a2a4a;
                             color:#e0e0f0;font-size:15px;">
                    Variant {registration.variant}
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;color:#7070a0;font-size:13px;">Registered</td>
                  <td style="padding:10px 0;color:#e0e0f0;font-size:15px;">
                    {registration.created_at.strftime('%d %b %Y, %I:%M %p')}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#111128;padding:20px 40px;text-align:center;
                       color:#4a4a6a;font-size:12px;">
              Ad Makerrrs &mdash; Registration Notification
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(SMTP_USER, NOTIFY_EMAIL, msg.as_string())

        logger.info(f"Notification email sent for registration id={registration.id}")

    except Exception as exc:
        logger.error(f"Failed to send notification email: {exc}")
