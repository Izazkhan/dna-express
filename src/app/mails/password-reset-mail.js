export default function PasswordResetMail(name, resetLink) {
    return `
  <div class="container">
    <h1>Hi ${name},</h1>
    <p>We received a request to reset your password.</p>
    <p>Click the button below to set a new password:</p>
    <p style="text-align: center;">
      <a href="${resetLink}" class="button">Reset Password</a>
    </p>
    <p><small>This link expires in <strong>15 minutes</strong>.</small></p>
    <p>If you didn't request this, please ignore this email.</p>
    <div class="footer">
      <p>© 2025 YourApp. All rights reserved.</p>
    </div>
  </div>
`
}