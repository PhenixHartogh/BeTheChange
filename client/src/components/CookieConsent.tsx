import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie } from 'lucide-react';
import { Link } from 'wouter';
import { initGA } from '@/lib/analytics';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Initialize Google Analytics after consent
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6" data-testid="cookie-consent-banner">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Cookie className="h-5 w-5 text-primary" />
            <CardTitle>Cookie Consent Required</CardTitle>
          </div>
          <CardDescription>
            We use cookies to enhance your experience and analyze site usage.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-muted-foreground">
            By clicking "Accept Cookies", you agree to the storing of cookies on your device to enhance site navigation, 
            analyze site usage, and assist in our marketing efforts. View our{' '}
            <Link href="/privacy">
              <span className="text-primary hover:underline cursor-pointer" data-testid="link-privacy">Privacy Policy</span>
            </Link>
            {' '}and{' '}
            <Link href="/cookies">
              <span className="text-primary hover:underline cursor-pointer" data-testid="link-cookies">Cookie Policy</span>
            </Link>
            {' '}for more information.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleAccept}
            className="w-full sm:w-auto"
            data-testid="button-accept-cookies"
          >
            Accept Cookies
          </Button>
          <Button
            onClick={handleDecline}
            variant="outline"
            className="w-full sm:w-auto"
            data-testid="button-decline-cookies"
          >
            Decline
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
