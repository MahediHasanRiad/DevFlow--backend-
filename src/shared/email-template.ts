export function getOTPTemplate(otpCode: string): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Your OTP Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f6f9; font-family: Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f6f9; padding: 40px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 480px; background-color: #ffffff; border-radius: 12px; padding: 40px 30px;">
            <tr>
              <td align="center" style="padding-bottom: 12px;">
                <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #0f172a;">Verify Your Account</h1>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 24px; color: #64748b; font-size: 14px;">
                Use the verification code below to complete your login. Expires in <strong>5 minutes</strong>.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding-bottom: 24px;">
                <div style="background-color: #f1f5f9; border-radius: 8px; border: 1px dashed #cbd5e1; padding: 16px 24px; display: inline-block;">
                  <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2563eb; font-family: monospace;">${otpCode}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td align="center" style="color: #94a3b8; font-size: 13px;">
                If you didn't request this code, please ignore this email.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}