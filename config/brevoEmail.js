const SibApiV3Sdk = require("sib-api-v3-sdk");

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.SMTP_PASS;
const brevo = new SibApiV3Sdk.TransactionalEmailsApi();

module.exports = brevo;
