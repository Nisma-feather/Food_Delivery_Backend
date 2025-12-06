const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SMTP_PASS; // Your API key

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendEmail = async (req, res) => {
  try {
    const result = await brevo.sendTransacEmail({
      sender: {
        email: "noreply@shanthinifeathers16.com",
        name: "Delivery App",
      },
      to: [{ email }],
      subject: "Your OTP Code",
      textContent: `
Hello,

This is your verification email for the Food Delivery App.

Your OTP code is: ${otp}

Please do not share this OTP with anyone. It is valid for 2 minutes only.

Thank you,
Food Delivery App Team
  `,
    });

    console.log("Email sent:", result);
    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Brevo API Error:", error);
    res.status(500).json({ success: false, error });
  }
};
