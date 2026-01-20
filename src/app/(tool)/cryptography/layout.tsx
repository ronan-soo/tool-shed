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

  return (
    <div className="flex h-full flex-col gap-4">
      <Tabs value={pathname} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="/cryptography/encrypt-decrypt" asChild>
            <Link href="/cryptography/encrypt-decrypt">Encrypt / Decrypt</Link>
          </TabsTrigger>
          <TabsTrigger value="/cryptography/hasher" asChild>
            <Link href="/cryptography/hasher">SHA-256 Hasher</Link>
          </TabsTrigger>
          <TabsTrigger value="/cryptography/key-generator" asChild>
            <Link href="/cryptography/key-generator">Key Generator</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="flex-1">{children}</div>
    </div>
  );
}
