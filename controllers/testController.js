const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SMTP_PASS; // Your API key

const transEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

exports.sendEmail = async (req, res) => {
  try {
    const result = await transEmailApi.sendTransacEmail({
      sender: { email: "shanthinifeathers16@gmail.com", name: "Delivery App" },
      to: [{ email: req.body.email }],

      subject: "Your OTP Code",
      htmlContent: `<h1>Test Email worked successsfully</h1>`,
    });

    console.log("Email sent:", result);
    res.json({ success: true, message: "Email sent!" });
  } catch (error) {
    console.error("Brevo API Error:", error);
    res.status(500).json({ success: false, error });
  }
};
