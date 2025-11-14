import { useEffect, useRef } from 'react';

interface HCaptchaWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    hcaptcha: any;
  }
}

export function HCaptchaWidget({ onVerify, onExpire, onError }: HCaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);

  // Keep refs up to date
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
    
    console.log('hCaptcha: checking site key...', siteKey ? 'Key found' : 'Key missing');
    
    if (!siteKey) {
      console.error('VITE_HCAPTCHA_SITE_KEY not configured');
      onErrorRef.current?.('hCaptcha not configured');
      return;
    }

    const loadHCaptcha = () => {
      if (window.hcaptcha && containerRef.current) {
        widgetId.current = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token: string) => onVerifyRef.current(token),
          'expired-callback': () => onExpireRef.current?.(),
          'error-callback': (err: string) => onErrorRef.current?.(err),
        });
      }
    };

    if (window.hcaptcha) {
      loadHCaptcha();
    } else {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      script.defer = true;
      script.onload = loadHCaptcha;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetId.current !== null && window.hcaptcha) {
        try {
          window.hcaptcha.remove(widgetId.current);
        } catch (e) {
          console.error('Error removing hCaptcha:', e);
        }
      }
    };
  }, []);

  return <div ref={containerRef} data-testid="hcaptcha-widget" />;
}
