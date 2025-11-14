export default function CookiePolicy() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly, including authentication and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website through Google Analytics</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences for future visits</li>
              <li><strong>Security Cookies:</strong> Protect against spam and abuse through hCaptcha</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Session Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These are temporary cookies that are deleted when you close your browser. We use them to maintain your login session.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  These cookies remain on your device for a set period or until you delete them. We use them to remember your preferences and analyze site usage.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Third-Party Cookies</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We use third-party services that may set cookies:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4 mt-2">
                  <li>Google Analytics - for usage analytics</li>
                  <li>Auth0 - for authentication</li>
                  <li>hCaptcha - for spam protection</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Use our cookie consent banner to accept or reject non-essential cookies</li>
              <li>Configure your browser settings to block or delete cookies</li>
              <li>Use browser extensions to manage cookies</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Please note that blocking essential cookies may impact the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookie Consent</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you first visit our website, you will see a cookie consent banner. You must accept cookies to use our website. Your consent is stored and you can change your preferences at any time by accessing the cookie settings in the footer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Updates to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about our use of cookies, please contact us at team@petitions.net.au
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
