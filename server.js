const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIRECTORY = path.join(__dirname, 'public');
const MAX_BODY_SIZE = 10_000;

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function validateLogin(email, password) {
  const errors = {};

  if (typeof email !== 'string' || email.trim() === '') {
    errors.email = 'Email is required.';
  } else if (!email.includes('@')) {
    errors.email = 'Email must contain @.';
  }

  if (typeof password !== 'string' || password === '') {
    errors.password = 'Password is required.';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  return errors;
}

function serveFile(response, fileName, contentType) {
  fs.readFile(path.join(PUBLIC_DIRECTORY, fileName), (error, file) => {
    if (error) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Unable to load page.');
      return;
    }

    response.writeHead(200, {
      'Content-Type': contentType,
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(file);
  });
}

const server = http.createServer((request, response) => {
  if (request.method === 'GET' && (request.url === '/' || request.url === '/index.html')) {
    serveFile(response, 'index.html', 'text/html; charset=utf-8');
    return;
  }

  if (request.method === 'GET' && request.url === '/app.js') {
    serveFile(response, 'app.js', 'application/javascript; charset=utf-8');
    return;
  }

  if (request.method === 'POST' && request.url === '/api/login') {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY_SIZE) {
        request.destroy();
      }
    });

    request.on('end', () => {
      let credentials;
      try {
        credentials = JSON.parse(body);
      } catch {
        sendJson(response, 400, { message: 'Request body must be valid JSON.' });
        return;
      }

      const errors = validateLogin(credentials.email, credentials.password);
      if (Object.keys(errors).length > 0) {
        sendJson(response, 400, { message: 'Please correct the form.', errors });
        return;
      }

      // This demo validates input only. It does not store users or authenticate accounts.
      sendJson(response, 200, { message: 'Login form submitted successfully.' });
    });
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Not found.');
});

server.listen(PORT, () => {
  console.log(`Login demo running at http://localhost:${PORT}`);
});
