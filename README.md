# Simple Secure Login Form

A small HTML, JavaScript, and Node.js login-form demo styled after the Juice Shop login screen. It checks that email and password fields are not empty, the email contains `@`, and the password has at least eight characters. The browser validates first for quick feedback, while the Node.js server repeats the same validation so a user cannot bypass it by changing browser code or sending a request directly.

This project intentionally does not include a database, users, or real authentication. It demonstrates form validation only.

## Run locally

1. Install [Node.js](https://nodejs.org/).
2. From this folder, run:

   ```powershell
   node server.js
   ```

3. Visit [http://localhost:3000](http://localhost:3000) in a browser.

No package installation is required. To use the project in the assignment, create a public GitHub repository and push these files to it.
