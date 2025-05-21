'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncUserPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sync = async () => {
      if (!isLoaded) return;
      if (!user) {
        router.push('/sign-in');
        return;
      }

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        if (!email) {
          throw new Error('No email address found');
        }

        const response = await fetch('/api/sync-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clerkId: user.id,
            email: email,
            eventsParticipated: [],
            eventsCreated: [],
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to sync user');
        }

        router.push('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to set up your account');
        console.error('Error syncing user:', err);
      }
    };

    sync();
  }, [user, isLoaded, router]);

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return <div className="text-center mt-4">Setting up your account...</div>;
}
