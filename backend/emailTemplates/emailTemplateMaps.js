const emailTemplates = {
  signupVerification: {
    templateRelativePath: "../emailTemplates/signupVerification.html",
    mailSubject: "Verify Signing up for an account",
    templateWebpathProduction: "",
    templateWebpathDev: "http://localhost:5173/login",
    // http://localhost:3000/api/signupConfirmed
  },
  passwordUpdate: {
    templateRelativePath: "../emailTemplates/passwordUpdate.html",
    mailSubject: "Verify changing password",
    templateWebpathProduction: "",
    templateWebpathDev: "http://localhost:5173/changePassword",
    // Change this to the path where users can see the new password modal; This is the POST path
  },
  confirmSignupEmailservice: {
    templateRelativePath: "../emailTemplates/confirmSignupEmailservice.html",
    mailSubject: "Verify Signing up for emails sending services",
    templateWebpathProduction: "",
    templateWebpathDev: "http://localhost:5173/emailConfirmed",
    // "http://localhost:3000/api/authenticated/emailServiceSignupConfirmed",
  },
  userDataUpdate: {
    templateRelativePath: "../emailTemplates/userDataUpdate.html",
    mailSubject: "Verify Updating user data",
    templateWebpathProduction: "",
    templateWebpathDev: "http://localhost:5173/loggedIn",
    // http://localhost:3000/api/authenticated/updateAccountRequestConfirmed
  },
};

module.exports = emailTemplates;
