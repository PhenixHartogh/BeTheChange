import { auth, requiresAuth } from 'express-openid-connect';
import type { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';

export function setupAuth(app: Express) {
  if (!process.env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable must be set');
  }

  const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SESSION_SECRET,
    baseURL: process.env.AUTH0_CALLBACK_URL?.replace('/api/auth/callback', '') || 'http://localhost:5000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    authorizationParams: {
      response_type: 'code',
      scope: 'openid profile email',
    },
    routes: {
      login: '/api/auth/login',
      logout: '/api/auth/logout',
      callback: '/api/auth/callback',
    },
  };

  app.use(auth(config));

  // Get current user endpoint
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    if (!req.oidc.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
      const auth0User = req.oidc.user;
      let user = await storage.getUserByAuth0Id(auth0User!.sub!);

      // Create user if doesn't exist
      if (!user) {
        user = await storage.createUser({
          auth0Id: auth0User!.sub!,
          email: auth0User!.email!,
          name: auth0User!.name!,
          picture: auth0User!.picture,
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Error getting user:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  });
}

// Middleware to require authentication and attach user
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const auth0User = req.oidc.user;
    let user = await storage.getUserByAuth0Id(auth0User!.sub!);

    if (!user) {
      user = await storage.createUser({
        auth0Id: auth0User!.sub!,
        email: auth0User!.email!,
        name: auth0User!.name!,
        picture: auth0User!.picture,
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}