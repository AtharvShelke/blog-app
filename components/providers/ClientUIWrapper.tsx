'use client';

import { ReactNode } from 'react';
import { Toaster } from '../ui/sonner';


export function ClientUIWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
