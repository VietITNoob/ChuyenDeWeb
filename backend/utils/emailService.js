const nodemailer = require('nodemailer');

/**
 * Tạo transporter Nodemailer.
 * Cấu hình qua biến môi trường EMAIL_USER và EMAIL_PASS (Gmail App Password).
 * Thêm vào .env:
 *   EMAIL_USER=your_gmail@gmail.com
 *   EMAIL_PASS=your_gmail_app_password
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

/**
 * Gửi email đặt lại mật khẩu.
 * @param {string} toEmail - Địa chỉ email người nhận
 * @param {string} resetUrl - URL reset password dạng http://localhost:5173/reset-password/:token
 */
const sendResetPasswordEmail = async (toEmail, resetUrl) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"CodeStore" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: 'Đặt lại mật khẩu CodeStore',
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
                <div style="background: linear-gradient(135deg, #0071e3 0%, #2997ff 100%); padding: 40px 40px 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">CodeStore</h1>
                </div>
                <div style="padding: 40px;">
                    <h2 style="color: #1d1d1f; font-size: 22px; font-weight: 600; margin: 0 0 16px;">Đặt lại mật khẩu</h2>
                    <p style="color: #6e6e73; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
                        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                        Nhấn vào nút bên dưới để tiến hành. Link sẽ hết hạn sau <strong>10 phút</strong>.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="display: inline-block; background: #0071e3; color: #ffffff; text-decoration: none; padding: 14px 36px; border-radius: 100px; font-size: 16px; font-weight: 600;">Đặt lại mật khẩu</a>
                    </div>
                    <p style="color: #6e6e73; font-size: 14px; line-height: 1.5; margin: 0;">
                        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.
                    </p>
                    <hr style="border: none; border-top: 1px solid #e5e5ea; margin: 32px 0;" />
                    <p style="color: #aeaeb2; font-size: 12px; text-align: center; margin: 0;">
                        © ${new Date().getFullYear()} CodeStore. All rights reserved.
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetPasswordEmail };
