'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function CryptoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname.startsWith('/crypto/hasher')) return '/crypto/hasher';
    if (pathname.startsWith('/crypto/key-generator'))
      return '/crypto/key-generator';
    return '/crypto';
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs value={getActiveTab()} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="/crypto" asChild>
            <Link href="/crypto">Encrypt / Decrypt</Link>
          </TabsTrigger>
          <TabsTrigger value="/crypto/hasher" asChild>
            <Link href="/crypto/hasher">SHA-256 Hasher</Link>
          </TabsTrigger>
          <TabsTrigger value="/crypto/key-generator" asChild>
            <Link href="/crypto/key-generator">Key Generator</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1">{children}</div>
    </div>
  );
}
