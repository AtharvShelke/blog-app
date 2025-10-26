'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Check } from 'lucide-react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    setIsSubscribed(true);
    setEmail('');
  };

  return (
    <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        
        <h3 className="font-semibold">Stay Updated</h3>
        <p className="text-sm text-muted-foreground">
          Get the latest articles and insights delivered to your inbox
        </p>

        {isSubscribed ? (
          <div className="flex items-center gap-2 text-sm text-green-600 justify-center">
            <Check className="w-4 h-4" />
            Subscribed! Check your email.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-background/50"
            />
            <Button type="submit" className="w-full">
              Subscribe
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}