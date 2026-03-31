/**
 * Email utility using Brevo (formerly Sendinblue) Transactional Email API.
 * Uses fetch (built-in Node 18+) — no extra SDK needed.
 * Render doesn't block HTTPS calls to the Brevo API.
 *
 * Required env vars:
 *   BREVO_API_KEY   — your Brevo API key (v3)
 *   BREVO_SENDER_EMAIL — verified sender email in Brevo
 *   BREVO_SENDER_NAME  — display name (optional, defaults to "AuthFlow")
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends a password reset email via the Brevo API
 * @param {string} toEmail   - Recipient's email address
 * @param {string} resetToken - The random reset token
 */
export const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const senderName  = process.env.BREVO_SENDER_NAME  || 'AuthFlow';
  const senderEmail = process.env.BREVO_SENDER_EMAIL;

  const payload = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: toEmail }],
    subject: 'Reset your AuthFlow password',
    htmlContent: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
      <body style="margin:0;padding:0;background:#0d0018;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:48px 16px;">
          <tr>
            <td align="center">
              <table width="560" cellpadding="0" cellspacing="0" style="background:#140024;border-radius:20px;overflow:hidden;border:1px solid rgba(181,0,178,0.25);">

                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#7B00FF,#B500B2);padding:36px 40px;text-align:center;">
                    <h1 style="margin:0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.02em;">
                      🔐 AuthFlow
                    </h1>
                    <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">
                      Password Reset Request
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="margin:0 0 16px;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.6;">
                      Hi there,
                    </p>
                    <p style="margin:0 0 28px;font-size:15px;color:rgba(255,255,255,0.75);line-height:1.6;">
                      Someone requested a password reset for your account. Click the button below —
                      this link is valid for <strong style="color:#e040fb;">1 hour</strong>.
                    </p>

                    <!-- CTA -->
                    <div style="text-align:center;margin:32px 0;">
                      <a href="${resetLink}"
                         style="display:inline-block;background:linear-gradient(135deg,#7B00FF,#B500B2);
                                color:#fff;text-decoration:none;padding:15px 36px;border-radius:10px;
                                font-size:15px;font-weight:700;letter-spacing:0.01em;
                                box-shadow:0 4px 24px rgba(123,0,255,0.45);">
                        Reset My Password
                      </a>
                    </div>

                    <p style="margin:28px 0 0;font-size:13px;color:rgba(255,255,255,0.4);line-height:1.6;">
                      If you didn't request this, you can safely ignore this email.
                      Your password won't change.
                    </p>

                    <!-- Fallback link -->
                    <p style="margin:16px 0 0;font-size:12px;color:rgba(255,255,255,0.3);word-break:break-all;">
                      Or copy this link: ${resetLink}
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);">
                      © ${new Date().getFullYear()} AuthFlow · This link expires in 1 hour
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  };

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'accept':       'application/json',
      'content-type': 'application/json',
      'api-key':      process.env.BREVO_API_KEY,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Brevo API error ${response.status}: ${JSON.stringify(error)}`);
  }

  return response.json();
};
