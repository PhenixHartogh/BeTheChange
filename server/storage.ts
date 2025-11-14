import { 
  users, 
  petitions, 
  signatures,
  announcements,
  comments,
  decisionMakers,
  type User, 
  type InsertUser,
  type Petition,
  type InsertPetition,
  type UpdatePetition,
  type UpdatePetitionStatus,
  type Signature,
  type InsertSignature,
  type Announcement,
  type InsertAnnouncement,
  type Comment,
  type InsertComment,
  type DecisionMaker,
  type InsertDecisionMaker,
  type PetitionWithCreator,
  type PetitionWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByAuth0Id(auth0Id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Petition methods
  getAllPetitions(): Promise<PetitionWithCreator[]>;
  getPetitionById(id: string): Promise<PetitionWithDetails | undefined>;
  getPetitionSignatures(petitionId: string): Promise<Signature[]>;
  createPetition(petition: InsertPetition, userId: string): Promise<Petition>;
  updatePetition(id: string, petition: UpdatePetition): Promise<Petition | undefined>;
  updatePetitionStatus(id: string, status: string): Promise<Petition | undefined>;
  deletePetition(id: string): Promise<boolean>;

  // Signature methods
  createSignature(signature: InsertSignature, verificationToken: string): Promise<Signature>;
  getSignaturesByUserId(userId: string): Promise<Signature[]>;
  checkUserSignature(petitionId: string, userId: string): Promise<boolean>;
  verifySignature(token: string): Promise<boolean>;
  getVerifiedSignatureEmails(petitionId: string): Promise<Array<{ email: string; firstName: string }>>;

  // Announcement methods
  createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getAnnouncementsByPetitionId(petitionId: string): Promise<Announcement[]>;

  // Comment methods
  createComment(comment: InsertComment, signatureId: string): Promise<Comment>;
  getCommentsByPetitionId(petitionId: string): Promise<Comment[]>;

  // Decision Maker methods
  createDecisionMakers(petitionId: string, decisionMakers: InsertDecisionMaker[]): Promise<DecisionMaker[]>;
  getDecisionMakersByPetitionId(petitionId: string): Promise<DecisionMaker[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByAuth0Id(auth0Id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.auth0Id, auth0Id));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllPetitions(): Promise<PetitionWithCreator[]> {
    const result = await db
      .select({
        id: petitions.id,
        title: petitions.title,
        description: petitions.description,
        category: petitions.category,
        imageUrl: petitions.imageUrl,
        signatureGoal: petitions.signatureGoal,
        createdById: petitions.createdById,
        createdAt: petitions.createdAt,
        status: petitions.status,
        creator: users,
        signatureCount: sql<number>`count(${signatures.id}) filter (where ${signatures.verified} = true)::int`,
      })
      .from(petitions)
      .leftJoin(users, eq(petitions.createdById, users.id))
      .leftJoin(signatures, eq(petitions.id, signatures.petitionId))
      .groupBy(petitions.id, users.id)
      .orderBy(desc(petitions.createdAt));

    return result.map(row => ({
      ...row,
      creator: row.creator!,
      _count: {
        signatures: row.signatureCount || 0,
      },
    }));
  }

  async getPetitionById(id: string): Promise<PetitionWithDetails | undefined> {
    const [petition] = await db
      .select()
      .from(petitions)
      .where(eq(petitions.id, id));

    if (!petition) return undefined;

    const [creator] = await db
      .select()
      .from(users)
      .where(eq(users.id, petition.createdById));

    // Only count verified signatures
    const signatureCount = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(signatures)
      .where(sql`${signatures.petitionId} = ${id} AND ${signatures.verified} = true`);

    // Get only verified signatures with limited public info (no PII)
    const recentSigs = await db
      .select({
        id: signatures.id,
        firstName: signatures.firstName,
        lastName: signatures.lastName,
        postcode: signatures.postcode,
        createdAt: signatures.createdAt,
      })
      .from(signatures)
      .where(sql`${signatures.petitionId} = ${id} AND ${signatures.verified} = true`)
      .orderBy(desc(signatures.createdAt))
      .limit(10);

    return {
      ...petition,
      creator: creator!,
      signatures: recentSigs.map(sig => ({
        id: sig.id,
        petitionId: id,
        userId: null,
        firstName: sig.firstName,
        lastName: sig.lastName.charAt(0) + '.', // Only show last initial for privacy
        email: '',
        phoneNumber: '',
        postcode: sig.postcode,
        createdAt: sig.createdAt,
      })) as any,
      signatureCount: signatureCount[0]?.count || 0,
    };
  }

  async getPetitionSignatures(petitionId: string): Promise<Signature[]> {
    return await db
      .select()
      .from(signatures)
      .where(eq(signatures.petitionId, petitionId))
      .orderBy(desc(signatures.createdAt));
  }

  async createPetition(insertPetition: InsertPetition, userId: string): Promise<Petition> {
    const [petition] = await db
      .insert(petitions)
      .values({
        ...insertPetition,
        createdById: userId,
      })
      .returning();
    return petition;
  }

  async updatePetition(id: string, updateData: UpdatePetition): Promise<Petition | undefined> {
    const [petition] = await db
      .update(petitions)
      .set(updateData)
      .where(eq(petitions.id, id))
      .returning();
    return petition;
  }

  async updatePetitionStatus(id: string, status: string): Promise<Petition | undefined> {
    const [petition] = await db
      .update(petitions)
      .set({ status })
      .where(eq(petitions.id, id))
      .returning();
    return petition;
  }

  async deletePetition(id: string): Promise<boolean> {
    const result = await db
      .delete(petitions)
      .where(eq(petitions.id, id));
    return true;
  }

  async createSignature(insertSignature: InsertSignature, verificationToken: string): Promise<Signature> {
    const [signature] = await db
      .insert(signatures)
      .values({
        ...insertSignature,
        verificationToken,
      })
      .returning();
    return signature;
  }

  async verifySignature(token: string): Promise<boolean> {
    const result = await db
      .update(signatures)
      .set({ verified: true, verificationToken: null })
      .where(eq(signatures.verificationToken, token))
      .returning({ id: signatures.id });
    
    return result.length > 0;
  }

  async getVerifiedSignatureEmails(petitionId: string): Promise<Array<{ email: string; firstName: string }>> {
    const result = await db
      .select({
        email: signatures.email,
        firstName: signatures.firstName,
      })
      .from(signatures)
      .where(
        sql`${signatures.petitionId} = ${petitionId} AND ${signatures.verified} = true`
      );
    
    return result;
  }

  async getSignaturesByUserId(userId: string): Promise<Signature[]> {
    // Only return verified signatures for user profile
    return await db
      .select()
      .from(signatures)
      .where(sql`${signatures.userId} = ${userId} AND ${signatures.verified} = true`)
      .orderBy(desc(signatures.createdAt));
  }

  async checkUserSignature(petitionId: string, userId: string): Promise<boolean> {
    const [result] = await db
      .select({ id: signatures.id })
      .from(signatures)
      .where(
        sql`${signatures.petitionId} = ${petitionId} AND ${signatures.userId} = ${userId}`
      )
      .limit(1);
    
    return !!result;
  }

  async createAnnouncement(announcement: InsertAnnouncement): Promise<Announcement> {
    const [newAnnouncement] = await db
      .insert(announcements)
      .values(announcement)
      .returning();
    return newAnnouncement;
  }

  async getAnnouncementsByPetitionId(petitionId: string): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .where(eq(announcements.petitionId, petitionId))
      .orderBy(desc(announcements.createdAt));
  }

  async createComment(comment: InsertComment, signatureId: string): Promise<Comment> {
    const [newComment] = await db
      .insert(comments)
      .values({
        ...comment,
        signatureId,
      })
      .returning();
    return newComment;
  }

  async getCommentsByPetitionId(petitionId: string): Promise<Comment[]> {
    return await db
      .select()
      .from(comments)
      .where(eq(comments.petitionId, petitionId))
      .orderBy(desc(comments.createdAt));
  }

  async createDecisionMakers(petitionId: string, decisionMakersList: InsertDecisionMaker[]): Promise<DecisionMaker[]> {
    if (decisionMakersList.length === 0) return [];
    
    const values = decisionMakersList.map(dm => ({
      ...dm,
      petitionId,
    }));
    
    return await db
      .insert(decisionMakers)
      .values(values)
      .returning();
  }

  async getDecisionMakersByPetitionId(petitionId: string): Promise<DecisionMaker[]> {
    return await db
      .select()
      .from(decisionMakers)
      .where(eq(decisionMakers.petitionId, petitionId))
      .orderBy(desc(decisionMakers.createdAt));
  }
}

export const storage = new DatabaseStorage();