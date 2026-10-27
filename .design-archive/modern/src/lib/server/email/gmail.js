function gmailConfigured() {
  return ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN', 'GMAIL_SENDER'].every(
    (key) => Boolean(process.env[key])
  );
}

function encodeMessage({ to, subject, text, html }) {
  const message = [
    `From: The Monoblogue <${process.env.GMAIL_SENDER}>`,
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="monoblogue-boundary"',
    '',
    '--monoblogue-boundary',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    text,
    '--monoblogue-boundary',
    'Content-Type: text/html; charset="UTF-8"',
    '',
    html,
    '--monoblogue-boundary--'
  ].join('\r\n');

  return Buffer.from(message).toString('base64url');
}

async function getAccessToken() {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  if (!response.ok) throw new Error(`Gmail token request failed (${response.status})`);
  return (await response.json()).access_token;
}

export async function sendConfirmationEmail({ to, confirmUrl }) {
  if (!gmailConfigured()) return { delivered: false, reason: 'not-configured' };

  const accessToken = await getAccessToken();
  const raw = encodeMessage({
    to,
    subject: 'Confirm your place in The Monoblogue',
    text: `Confirm your subscription: ${confirmUrl}\n\nIf you did not request this, ignore this message.`,
    html: `<p>One last small ritual:</p><p><a href="${confirmUrl}">Confirm your subscription</a></p><p>If you did not request this, ignore this message.</p>`
  });
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${accessToken}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });
  if (!response.ok) throw new Error(`Gmail send failed (${response.status})`);
  return { delivered: true };
}
