export { sendEmail } from "./sendEmail";
export { emailConfig } from "./email.config";
export { resend } from "./transporter";
export { WelcomeEmail, type WelcomeEmailProps } from "./templates/welcome";
export { renderWelcomeEmail, welcomeEmailTemplate } from "./renderWelcome";
export {
  ContactEnquiryEmail,
  type ContactEnquiryEmailProps,
} from "./templates/contactEnquiry";
export { renderContactEnquiryEmail } from "./renderContactEnquiry";
export {
  ContactThankYouEmail,
  type ContactThankYouEmailProps,
} from "./templates/contactThankYou";
export { renderContactThankYouEmail } from "./renderContactThankYou";
export {
  BaseLayout,
  EmailHeader,
  EmailFooter,
  EmailButton,
  InfoCard,
  EmailDivider,
} from "./layouts";
