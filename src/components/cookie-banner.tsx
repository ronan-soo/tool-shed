'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie_consent_accepted';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // This code runs only on the client
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (consent !== 'true') {
        setIsVisible(true);
      }
    } catch (e) {
        console.error("Could not access local storage:", e)
        // If localStorage is not available, just don't show the banner.
        setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    } catch (e) {
        console.error("Could not access local storage:", e)
    }
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-secondary text-secondary-foreground shadow-lg transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
        <div className="flex items-start gap-3">
          <Cookie className="h-6 w-6 flex-shrink-0 mt-1" />
          <p className="text-sm">
            We use local storage to enhance your experience, remember your preferences, and for the functionality of saved pipelines. By continuing to use this site, you agree to our use of local storage. See our{' '}
            <Link href="/disclaimer" className="font-bold underline hover:text-primary">
              Disclaimer & Policy
            </Link>
            .
          </p>
        </div>
        <Button onClick={handleAccept} size="sm" className="w-full sm:w-auto">
          Accept
        </Button>
      </div>
    </div>
  );
}
