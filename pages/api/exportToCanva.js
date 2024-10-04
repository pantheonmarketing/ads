import crypto from 'crypto';
import queryString from 'query-string';

export default async function handler(req, res) {
  const { design } = req.body;

  // Only send necessary data to reduce payload size
  const minimalDesign = {
    topText: design.topText,
    bottomText: design.bottomText,
    imageUrl: design.imageUrl,
    exportSize: design.exportSize,
  };

  const canvaClientId = 'OC-AZJRfmH72JNs';
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/canva-callback`;

  // Generate code_verifier and code_challenge
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  // Generate state
  const state = crypto.randomBytes(32).toString('base64url');

  // Store code_verifier, state, and minimal design data in session or database
  // For this example, we'll use cookies, but in a production environment,
  // you should use a more secure method
  res.setHeader('Set-Cookie', [
    `canva_code_verifier=${codeVerifier}; HttpOnly; Secure; SameSite=Strict; Path=/`,
    `canva_state=${state}; HttpOnly; Secure; SameSite=Strict; Path=/`,
    `canva_design=${Buffer.from(JSON.stringify(minimalDesign)).toString('base64')}; HttpOnly; Secure; SameSite=Strict; Path=/`
  ]);

  const authUrl = `https://www.canva.com/oauth/authorize?${queryString.stringify({
    client_id: canvaClientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'designs.write',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    state: state,
  })}`;

  res.status(200).json({ authUrl });
}