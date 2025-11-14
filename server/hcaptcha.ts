import { verify } from 'hcaptcha';

const HCAPTCHA_SECRET = process.env.HCAPTCHA_SECRET_KEY;

if (!HCAPTCHA_SECRET) {
  console.warn('HCAPTCHA_SECRET_KEY not set - hCaptcha verification will fail');
}

export async function verifyHCaptcha(token: string, ip?: string): Promise<boolean> {
  if (!HCAPTCHA_SECRET) {
    throw new Error('HCAPTCHA_SECRET_KEY not configured');
  }

  if (!token) {
    return false;
  }

  try {
    const data = await verify(HCAPTCHA_SECRET, token, ip);
    return data.success === true;
  } catch (error) {
    console.error('hCaptcha verification error:', error);
    return false;
  }
}
