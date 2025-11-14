import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, requireAuth } from "./auth";
import { body, validationResult } from "express-validator";
import { insertPetitionSchema, updatePetitionSchema, updatePetitionStatusSchema, insertSignatureSchema, insertAnnouncementSchema, insertCommentSchema, insertDecisionMakerSchema } from "@shared/schema";
import { verifyHCaptcha } from "./hcaptcha";
import { sendVerificationEmail, sendAnnouncementEmail, sendContactOrganizerEmail } from "./emails";
import { randomBytes } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup Auth0 authentication
  setupAuth(app);

  // Get all petitions
  app.get('/api/petitions', async (req: Request, res: Response) => {
    try {
      const petitions = await storage.getAllPetitions();
      res.json(petitions);
    } catch (error) {
      console.error('Error fetching petitions:', error);
      res.status(500).json({ error: 'Failed to fetch petitions' });
    }
  });

  // Get petition by ID (public - limited signature data)
  app.get('/api/petitions/:id', async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }
      
      // Check if authenticated user has signed this petition
      let hasUserSigned = false;
      if (req.oidc.isAuthenticated()) {
        const auth0User = req.oidc.user;
        const user = await storage.getUserByAuth0Id(auth0User!.sub!);
        if (user) {
          hasUserSigned = await storage.checkUserSignature(petition.id, user.id);
        }
      }
      
      res.json({ ...petition, hasUserSigned });
    } catch (error) {
      console.error('Error fetching petition:', error);
      res.status(500).json({ error: 'Failed to fetch petition' });
    }
  });

  // Get full petition signatures (organizer-only)
  app.get('/api/petitions/:id/signatures', requireAuth, async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const user = (req as any).user;
      if (petition.createdById !== user.id) {
        return res.status(403).json({ error: 'Only the petition creator can view signatures' });
      }

      const signatures = await storage.getPetitionSignatures(req.params.id);
      res.json({ petition, signatures });
    } catch (error) {
      console.error('Error fetching signatures:', error);
      res.status(500).json({ error: 'Failed to fetch signatures' });
    }
  });

  // Create petition (requires auth)
  app.post('/api/petitions', requireAuth, async (req: Request, res: Response) => {
    try {
      // Verify hCaptcha
      const captchaToken = req.body.captchaToken;
      if (!captchaToken) {
        return res.status(400).json({ error: 'Captcha verification required' });
      }

      const captchaValid = await verifyHCaptcha(captchaToken, req.ip);
      if (!captchaValid) {
        return res.status(400).json({ error: 'Captcha verification failed' });
      }

      const result = insertPetitionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const user = (req as any).user;
      const petition = await storage.createPetition(result.data, user.id);

      // Create decision makers if provided
      if (req.body.decisionMakers && Array.isArray(req.body.decisionMakers) && req.body.decisionMakers.length > 0) {
        try {
          await storage.createDecisionMakers(petition.id, req.body.decisionMakers);
        } catch (dmError) {
          console.error('Error creating decision makers:', dmError);
          // Continue - petition is created
        }
      }

      res.json(petition);
    } catch (error) {
      console.error('Error creating petition:', error);
      res.status(500).json({ error: 'Failed to create petition' });
    }
  });

  // Update petition (requires auth and ownership)
  app.put('/api/petitions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const user = (req as any).user;
      if (petition.createdById !== user.id) {
        return res.status(403).json({ error: 'Only the petition creator can edit this petition' });
      }

      const result = updatePetitionSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const updatedPetition = await storage.updatePetition(req.params.id, result.data);
      res.json(updatedPetition);
    } catch (error) {
      console.error('Error updating petition:', error);
      res.status(500).json({ error: 'Failed to update petition' });
    }
  });

  // Update petition status (requires auth and ownership)
  app.patch('/api/petitions/:id/status', requireAuth, async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const user = (req as any).user;
      if (petition.createdById !== user.id) {
        return res.status(403).json({ error: 'Only the petition creator can update the status' });
      }

      const result = updatePetitionStatusSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      // Prevent redundant status updates
      if (petition.status === result.data.status) {
        return res.status(400).json({ error: `Petition is already marked as ${result.data.status}` });
      }

      // Prevent reverting from closed/successful back to active (schema already prevents 'active' in request)
      // This is defensive in case schema changes
      if ((petition.status === 'closed' || petition.status === 'successful') && result.data.status === 'active') {
        return res.status(400).json({ error: 'Cannot revert petition status to active' });
      }

      const updatedPetition = await storage.updatePetitionStatus(req.params.id, result.data.status);
      res.json(updatedPetition);
    } catch (error) {
      console.error('Error updating petition status:', error);
      res.status(500).json({ error: 'Failed to update petition status' });
    }
  });

  // Delete petition (requires auth and ownership)
  app.delete('/api/petitions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const user = (req as any).user;
      if (petition.createdById !== user.id) {
        return res.status(403).json({ error: 'Only the petition creator can delete this petition' });
      }

      await storage.deletePetition(req.params.id);
      res.json({ success: true, message: 'Petition deleted successfully' });
    } catch (error) {
      console.error('Error deleting petition:', error);
      res.status(500).json({ error: 'Failed to delete petition' });
    }
  });

  // Create signature
  app.post('/api/signatures', async (req: Request, res: Response) => {
    try {
      // Verify hCaptcha
      const captchaToken = req.body.captchaToken;
      if (!captchaToken) {
        return res.status(400).json({ error: 'Captcha verification required' });
      }

      const captchaValid = await verifyHCaptcha(captchaToken, req.ip);
      if (!captchaValid) {
        return res.status(400).json({ error: 'Captcha verification failed' });
      }

      const result = insertSignatureSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      // If user is authenticated, check for duplicates and add userId
      if (req.oidc.isAuthenticated()) {
        const auth0User = req.oidc.user;
        let user = await storage.getUserByAuth0Id(auth0User!.sub!);
        
        if (user) {
          // Check if user already signed this petition
          const alreadySigned = await storage.checkUserSignature(
            result.data.petitionId,
            user.id
          );
          
          if (alreadySigned) {
            return res.status(400).json({ error: 'You have already signed this petition' });
          }
        }
      }

      // Generate verification token
      const verificationToken = randomBytes(32).toString('hex');
      
      const signature = await storage.createSignature(result.data, verificationToken);

      // Get petition details for email
      const petition = await storage.getPetitionById(result.data.petitionId);
      if (petition) {
        // Send verification email
        const baseUrl = process.env.AUTH0_CALLBACK_URL?.replace('/api/auth/callback', '') || 'http://localhost:5000';
        try {
          await sendVerificationEmail(
            signature.email,
            signature.firstName,
            petition.title,
            verificationToken,
            baseUrl
          );
        } catch (emailError) {
          console.error('Failed to send verification email:', emailError);
          // Continue anyway - signature is created
        }
      }

      res.json(signature);
    } catch (error) {
      console.error('Error creating signature:', error);
      res.status(500).json({ error: 'Failed to create signature' });
    }
  });

  // Get my signatures (requires auth)
  app.get('/api/signatures/my', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const signatures = await storage.getSignaturesByUserId(user.id);
      res.json(signatures);
    } catch (error) {
      console.error('Error fetching signatures:', error);
      res.status(500).json({ error: 'Failed to fetch signatures' });
    }
  });

  // Verify signature
  app.get('/api/verify-signature', async (req: Request, res: Response) => {
    try {
      const token = req.query.token as string;
      if (!token) {
        return res.status(400).json({ error: 'Verification token required' });
      }

      const verified = await storage.verifySignature(token);
      if (!verified) {
        return res.status(400).json({ error: 'Invalid or expired verification token' });
      }

      res.json({ success: true, message: 'Signature verified successfully' });
    } catch (error) {
      console.error('Error verifying signature:', error);
      res.status(500).json({ error: 'Failed to verify signature' });
    }
  });

  // Create announcement (requires auth and ownership)
  app.post('/api/petitions/:id/announcements', requireAuth, async (req: Request, res: Response) => {
    try {
      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const user = (req as any).user;
      if (petition.createdById !== user.id) {
        return res.status(403).json({ error: 'Only the petition creator can post announcements' });
      }

      const result = insertAnnouncementSchema.safeParse({
        ...req.body,
        petitionId: req.params.id,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const announcement = await storage.createAnnouncement(result.data);

      // Send emails to all verified signers
      const signers = await storage.getVerifiedSignatureEmails(req.params.id);
      const baseUrl = process.env.AUTH0_CALLBACK_URL?.replace('/api/auth/callback', '') || 'http://localhost:5000';
      
      // Send emails asynchronously (don't wait)
      Promise.all(
        signers.map(signer =>
          sendAnnouncementEmail(
            signer.email,
            signer.firstName,
            petition.title,
            announcement.title,
            req.params.id,
            baseUrl
          ).catch(err => console.error('Failed to send announcement email:', err))
        )
      ).catch(err => console.error('Error sending announcement emails:', err));

      res.json(announcement);
    } catch (error) {
      console.error('Error creating announcement:', error);
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  });

  // Get announcements for a petition
  app.get('/api/petitions/:id/announcements', async (req: Request, res: Response) => {
    try {
      const announcements = await storage.getAnnouncementsByPetitionId(req.params.id);
      res.json(announcements);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  // Create comment (requires verified signature)
  app.post('/api/petitions/:id/comments', async (req: Request, res: Response) => {
    try {
      const result = insertCommentSchema.safeParse({
        ...req.body,
        petitionId: req.params.id,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      // Resolve user's signature ID from server-side context
      if (!req.oidc.isAuthenticated()) {
        return res.status(401).json({ error: 'Authentication required to comment' });
      }

      const auth0User = req.oidc.user;
      const user = await storage.getUserByAuth0Id(auth0User!.sub!);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      // Get user's verified signature for this petition
      const signatures = await storage.getPetitionSignatures(req.params.id);
      const verifiedSignature = signatures.find(
        sig => sig.userId === user.id && sig.verified
      );

      if (!verifiedSignature) {
        return res.status(403).json({ error: 'You must have a verified signature on this petition to comment' });
      }

      const comment = await storage.createComment(result.data, verifiedSignature.id);
      res.json(comment);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
    }
  });

  // Get comments for a petition
  app.get('/api/petitions/:id/comments', async (req: Request, res: Response) => {
    try {
      const comments = await storage.getCommentsByPetitionId(req.params.id);
      res.json(comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    }
  });

  // Get decision makers for a petition
  app.get('/api/petitions/:id/decision-makers', async (req: Request, res: Response) => {
    try {
      const decisionMakers = await storage.getDecisionMakersByPetitionId(req.params.id);
      res.json(decisionMakers);
    } catch (error) {
      console.error('Error fetching decision makers:', error);
      res.status(500).json({ error: 'Failed to fetch decision makers' });
    }
  });

  // Contact petition organizer
  app.post('/api/petitions/:id/contact-organizer', async (req: Request, res: Response) => {
    try {
      // Verify hCaptcha for spam protection
      const captchaToken = req.body.captchaToken;
      if (!captchaToken) {
        return res.status(400).json({ error: 'Captcha verification required' });
      }

      const captchaValid = await verifyHCaptcha(captchaToken, req.ip);
      if (!captchaValid) {
        return res.status(400).json({ error: 'Captcha verification failed' });
      }

      // Validate email format and message length
      const { firstName, lastName, email, phone, message } = req.body;

      if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'First name, last name, email, and message are required' });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      // Validate message length (min 10, max 5000 characters)
      if (message.length < 10 || message.length > 5000) {
        return res.status(400).json({ error: 'Message must be between 10 and 5000 characters' });
      }

      // Validate name lengths
      if (firstName.length > 100 || lastName.length > 100) {
        return res.status(400).json({ error: 'Names must be less than 100 characters' });
      }

      // Validate phone if provided
      if (phone && phone.length > 20) {
        return res.status(400).json({ error: 'Phone number must be less than 20 characters' });
      }

      const petition = await storage.getPetitionById(req.params.id);
      if (!petition) {
        return res.status(404).json({ error: 'Petition not found' });
      }

      const baseUrl = process.env.AUTH0_CALLBACK_URL?.replace('/api/auth/callback', '') || 'http://localhost:5000';
      
      try {
        await sendContactOrganizerEmail(
          petition.creator.email,
          petition.creator.name,
          petition.title,
          firstName,
          lastName,
          email,
          phone || null,
          message,
          req.params.id,
          baseUrl
        );

        res.json({ success: true, message: 'Message sent successfully' });
      } catch (emailError) {
        console.error('Failed to send contact organizer email:', emailError);
        return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
      }
    } catch (error) {
      console.error('Error contacting organizer:', error);
      res.status(500).json({ error: 'Failed to contact organizer' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}