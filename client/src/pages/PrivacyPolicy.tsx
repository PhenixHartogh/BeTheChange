export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Name and email address (when you create an account or sign a petition)</li>
              <li>Phone number and postal code (when signing petitions)</li>
              <li>Profile information from authentication providers (Auth0)</li>
              <li>Petition content, comments, and announcements you create</li>
              <li>Usage data and analytics through Google Analytics and cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and validate petition signatures</li>
              <li>Send verification emails and announcements</li>
              <li>Enable petition creators to contact their supporters</li>
              <li>Analyze usage patterns and improve user experience</li>
              <li>Communicate with you about service updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Data Sharing and Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Your signature data is shared as follows:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Petition creators receive full contact details (name, email, phone, postcode) for signatures on their petitions</li>
              <li>Public displays show only first name and last initial for privacy protection</li>
              <li>We do not sell your personal information to third parties</li>
              <li>We may share data with service providers who assist in operating our platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              Your data will not be automatically deleted and will be stored indefinitely to maintain petition integrity and enable ongoing campaign management. You may request deletion of your data by contacting us at team@petitions.net.au
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Cookies and Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to collect usage information and improve our services. You can control cookie settings through our cookie consent banner and your browser settings. See our Cookie Policy for more details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use third-party services that may collect information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Auth0 for authentication</li>
              <li>Resend for email delivery</li>
              <li>Google Analytics for usage analytics</li>
              <li>hCaptcha for spam protection</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about this Privacy Policy or to exercise your rights, contact us at:<br />
              Email: team@petitions.net.au<br />
              Address: PO Box 550, Mooroolbark, VIC 3138, Australia
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
