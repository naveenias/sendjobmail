const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const router = express.Router();

router.post('/sendemail', async (req, res) => {
  const { email, subject, message, attachments } = req.body; // Accepting cover letter from frontend

  console.log(attachments);
  console.log(attachments[0]?.filename);
  console.log(attachments[0]?.content);

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.error(`❌ Invalid email: ${email}`);
    return res.status(400).json({ status: 'failed', message: `Invalid email format: ${email}` });
  }

  // Validate attachments
  if (!attachments || !attachments[0]?.filename || !attachments[0]?.content) {
    console.error(`❌ Missing cover letter attachment`);
    return res.status(400).json({ status: 'failed', message: 'Cover letter attachment is required' });
  }

  const resumePath = path.join(__dirname, '../assets/Naveen_Resume.pdf'); // Correct file path

  const mailOptions = {
    from: `"Naveen M" <naveenacp24@gmail.com>`,
    to: email,
    subject: subject,
    text: message,
    attachments: [
      {
        filename: 'Naveen_Resume.pdf',
        path: resumePath, // Use absolute path from assets
      },
      {
        filename: attachments[0].filename, // Dynamic filename
        content: Buffer.from(attachments[0].content, 'base64'), // Convert base64 to buffer
      },
    ],
  };

  try {
    console.log(`📤 Sending email to ${email}...`);

    const info = await transporter.sendMail(mailOptions);
    console.log(info);

    if (info.response.includes('250')) {
      console.log(`✅ Email sent to ${email} - Response: ${info.response}`);
      return res.status(200).json({ status: 'success', message: `Email sent to ${email}` });
    } else {
      console.error(`❌ Email not accepted by server: ${info.response}`);
      return res.status(500).json({ status: 'failed', message: `Email not accepted by server` });
    }
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error.message);
    return res.status(500).json({ status: 'failed', message: error.message });
  }
});

module.exports = router;
