import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

export default function VerifySignature() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('No verification token provided');
        return;
      }

      try {
        const response = await fetch(`/api/verify-signature?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Your signature has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Failed to verify signature. Please try again later.');
      }
    };

    verifyToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full" data-testid="card-verify-result">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" data-testid="icon-loading" />
            )}
            {status === 'success' && (
              <CheckCircle2 className="h-16 w-16 text-green-600" data-testid="icon-success" />
            )}
            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive" data-testid="icon-error" />
            )}
          </div>
          <CardTitle data-testid="text-title">
            {status === 'loading' && 'Verifying...'}
            {status === 'success' && 'Signature Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription data-testid="text-message">
            {message || 'Please wait while we verify your signature...'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thank you for verifying your signature. Your support has been confirmed and will be counted toward the petition goal.
              </p>
              <Link href="/">
                <Button className="w-full" data-testid="button-browse-petitions">
                  Browse Petitions
                </Button>
              </Link>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This verification link may have expired or already been used.
              </p>
              <Link href="/">
                <Button variant="outline" className="w-full" data-testid="button-home">
                  Go Home
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
