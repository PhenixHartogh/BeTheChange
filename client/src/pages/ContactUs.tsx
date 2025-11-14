export default function ContactUs() {
  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Get in touch with the Be the Change team
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Email</h2>
            <a 
              href="mailto:team@petitions.net.au" 
              className="text-primary hover:underline"
              data-testid="link-contact-email"
            >
              team@petitions.net.au
            </a>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Postal Address</h2>
            <p className="text-muted-foreground">
              PO Box 550<br />
              Mooroolbark, VIC 3138<br />
              Australia
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-2xl font-semibold mb-4">Send us a message</h2>
          <iframe
            src="https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAa__fSsle1URTZUN0RUQzlMRk1OVERMWU44U0pIU1JGUy4u"
            width="100%"
            height="800"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Contact Form"
            className="rounded-md"
            data-testid="iframe-contact-form"
          >
            Loading…
          </iframe>
        </div>
      </div>
    </div>
  );
}
