'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex-1">{children}</div>
    </div>
  );
}
