export default function AccessibilityStatement() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Accessibility Statement</h1>
          <p className="text-sm text-muted-foreground">Last updated: November 2024</p>
        </div>

        <div className="prose prose-slate max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Be the Change team tries their hardest to make sure the website is fully accessible as possible. We are committed to ensuring digital accessibility for people with disabilities and continuously work to improve the user experience for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Conformance Status</h2>
            <p className="text-muted-foreground leading-relaxed">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA and the European standard EN 301 549. These guidelines explain how to make web content more accessible for people with disabilities and user-friendly for everyone.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Our website includes the following accessibility features:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Semantic HTML structure for screen reader compatibility</li>
              <li>ARIA labels and attributes for enhanced navigation</li>
              <li>Keyboard navigation support throughout the site</li>
              <li>Sufficient color contrast ratios for text and interactive elements</li>
              <li>Responsive design that works on various devices and screen sizes</li>
              <li>Alternative text for images and icons</li>
              <li>Clear and consistent navigation</li>
              <li>Focus indicators for interactive elements</li>
              <li>Form labels and error messages</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Assistive Technologies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Be the Change is designed to be compatible with common assistive technologies including:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
              <li>Screen readers (NVDA, JAWS, VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Known Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              Despite our best efforts, some areas of our website may not yet be fully accessible. We are actively working to address these limitations and improve accessibility across the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
            <p className="text-muted-foreground leading-relaxed">
              We welcome your feedback on the accessibility of Be the Change. If you encounter any accessibility barriers or have suggestions for improvement, please contact us:
            </p>
            <ul className="list-none space-y-1 text-muted-foreground mt-3">
              <li>Email: team@petitions.net.au</li>
              <li>Postal: PO Box 550, Mooroolbark, VIC 3138, Australia</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We aim to respond to accessibility feedback within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Continuous Improvement</h2>
            <p className="text-muted-foreground leading-relaxed">
              Accessibility is an ongoing effort. We regularly review our website, conduct accessibility audits, and make improvements based on user feedback and evolving standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Technical Specifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              Be the Change relies on the following technologies:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4 mt-3">
              <li>HTML5</li>
              <li>WAI-ARIA</li>
              <li>CSS3</li>
              <li>JavaScript</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              Some content on our website may be provided by third-party services. We work with our partners to ensure their content meets accessibility standards, but we cannot guarantee full accessibility of third-party content.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
