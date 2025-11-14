import { Link } from 'wouter';
import { PenLine } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" data-testid="link-footer-home">
              <div className="flex items-center gap-2 cursor-pointer">
                <PenLine className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Be the Change</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Create and sign petitions that drive real change in your community and beyond.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/browse">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-browse">
                    Browse Petitions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/create">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-create">
                    Start a Petition
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-guidelines">
                    Community Guidelines
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-contact">
                    Contact Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/accessibility">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-accessibility">
                    Accessibility Statement
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-terms">
                    Terms and Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-privacy">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-footer-cookies">
                    Cookie Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Be the Change. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
