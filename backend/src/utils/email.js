const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendVerificationCode = async (email, code, name) => {
  await transporter.sendMail({
    from: `"Zona Basket CR 🏀" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Tu código de verificación — Zona Basket CR',
    html: `
      <div style="font-family: Arial, sans-serif; background: #060608; color: #fff; padding: 40px; border-radius: 12px; max-width: 500px; margin: 0 auto;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f97316; font-size: 28px; margin: 0;">🏀 Zona Basket CR</h1>
        </div>
        <h2 style="font-size: 20px;">Hola, ${name} 👋</h2>
        <p style="color: #9ca3af;">Usá este código para verificar tu identidad. Expira en <strong style="color: #fff;">10 minutos</strong>.</p>
        <div style="background: #1a1a2e; border: 2px solid #f97316; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
          <p style="font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #f97316; margin: 0;">${code}</p>
        </div>
        <p style="color: #6b7280; font-size: 12px;">Si no intentaste iniciar sesión, ignorá este mensaje.</p>
      </div>
    `
  })
}

module.exports = { sendVerificationCode }