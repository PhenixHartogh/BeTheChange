import { getUncachableResendClient } from './resend';

export async function sendVerificationEmail(
  to: string,
  firstName: string,
  petitionTitle: string,
  verificationToken: string,
  baseUrl: string
) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const verificationUrl = `${baseUrl}/verify?token=${verificationToken}`;
    
    await client.emails.send({
      from: fromEmail,
      to,
      subject: `Please verify your signature on "${petitionTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6D28D9;">Verify Your Signature</h2>
          <p>Hi ${firstName},</p>
          <p>Thank you for signing <strong>"${petitionTitle}"</strong>!</p>
          <p>Please verify your signature by clicking the link below:</p>
          <p style="margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #6D28D9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify My Signature
            </a>
          </p>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            If you didn't sign this petition, you can safely ignore this email.
          </p>
        </div>
      `,
    });
    
    console.log(`Verification email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }
}

export async function sendAnnouncementEmail(
  to: string,
  firstName: string,
  petitionTitle: string,
  announcementTitle: string,
  petitionId: string,
  baseUrl: string
) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const petitionUrl = `${baseUrl}/petition/${petitionId}`;
    
    await client.emails.send({
      from: fromEmail,
      to,
      subject: `New update on "${petitionTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6D28D9;">New Announcement</h2>
          <p>Hi ${firstName},</p>
          <p>There's a new announcement on the petition <strong>"${petitionTitle}"</strong> that you signed:</p>
          <h3 style="color: #333; margin: 20px 0;">${announcementTitle}</h3>
          <p style="margin: 30px 0;">
            <a href="${petitionUrl}" 
               style="background-color: #6D28D9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Announcement
            </a>
          </p>
          <p style="color: #666; font-size: 14px;">
            Visit the petition page to read the full announcement and see the latest updates.
          </p>
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            You're receiving this because you signed this petition. 
          </p>
        </div>
      `,
    });
    
    console.log(`Announcement email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send announcement email:', error);
    // Don't throw - we don't want to block announcement creation if email fails
  }
}

export async function sendContactOrganizerEmail(
  organizerEmail: string,
  organizerName: string,
  petitionTitle: string,
  senderFirstName: string,
  senderLastName: string,
  senderEmail: string,
  senderPhone: string | null,
  message: string,
  petitionId: string,
  baseUrl: string
) {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const petitionUrl = `${baseUrl}/petition/${petitionId}`;
    
    await client.emails.send({
      from: fromEmail,
      to: organizerEmail,
      replyTo: senderEmail,
      subject: `Message about your petition: "${petitionTitle}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6D28D9;">Message from a Supporter</h2>
          <p>Hi ${organizerName},</p>
          <p>You've received a message about your petition <strong>"${petitionTitle}"</strong>:</p>
          
          <div style="background-color: #f5f5f5; border-left: 4px solid #6D28D9; padding: 20px; margin: 30px 0;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 6px;">
            <h3 style="margin: 0 0 10px; font-size: 16px; color: #333;">Contact Information:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${senderFirstName} ${senderLastName}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${senderEmail}</p>
            ${senderPhone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${senderPhone}</p>` : ''}
          </div>
          
          <p style="margin: 30px 0;">
            <a href="${petitionUrl}" 
               style="background-color: #6D28D9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Petition
            </a>
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 40px;">
            You can reply directly to this email to respond to ${senderFirstName}.
          </p>
        </div>
      `,
    });
    
    console.log(`Contact organizer email sent to ${organizerEmail}`);
  } catch (error) {
    console.error('Failed to send contact organizer email:', error);
    throw error;
  }
}
