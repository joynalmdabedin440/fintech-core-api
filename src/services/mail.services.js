
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Fintech Core" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

//Welcome email template
async function registrationEmail(userEmail, name) {
  const subject = 'Welcome to Fintech Core!';
  
  // Keep the text version simple for deliverability
  const text = `Hello ${name},\n\nWelcome to Fintech Core! We're excited to have you on board.\n\nGet Started: https://yourfintech.com\n\nBest regards,\nThe Fintech Core Team`;

  // The "fancy" HTML version
  const html = `
    <div style="background-color: #f4f7f9; padding: 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 0; text-align: center; background-color: #0052cc;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Fintech Core</h1>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 40px 30px; line-height: 1.6; color: #333333;">
            <h2 style="margin-top: 0; color: #0052cc;">Welcome, ${name}!</h2>
            <p>We're thrilled to have you join our community. Fintech Core is built to simplify your financial journey, and we can't wait to see what you achieve.</p>
            
            <!-- CTA Button -->
            <table border="0" cellpadding="0" cellspacing="0" style="margin: 30px auto;">
              <tr>
                <td align="center" bgcolor="#0052cc" style="border-radius: 5px;">
                  <a href="https://fintechcore.com" target="_blank" style="padding: 15px 25px; color: #ffffff; text-decoration: none; font-weight: bold; display: inline-block;">Get Started Now</a>
                </td>
              </tr>
            </table>
            
            <p style="font-size: 14px; color: #777777;">If you have any questions, our support team is always here to help.</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="padding: 20px; text-align: center; font-size: 12px; color: #999999; background-color: #fafafa; border-top: 1px solid #eeeeee;">
            &copy; 2024 Fintech Core Team | 123 Finance Way, Tech City<br>
            <a href="#" style="color: #0052cc; text-decoration: none;">Unsubscribe</a>
          </td>
        </tr>
      </table>
    </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}


module.exports = {registrationEmail}

