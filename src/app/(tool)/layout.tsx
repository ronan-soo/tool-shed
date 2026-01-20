
'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cable, Shield, Wrench } from 'lucide-react';
import React from 'react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/pipelines', label: 'String Pipelines', icon: Cable },
  { href: '/crypto', label: 'Cryptography', icon: Shield },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    if (pathname.startsWith('/pipelines')) {
      return 'String Pipelines';
    }
    if (pathname.startsWith('/crypto')) {
      return 'Cryptography';
    }
    if (pathname === '/') {
      return 'Home';
    }
    return 'Tool Shed';
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-svh bg-muted/40">
        <Sidebar>
          <SidebarHeader className="p-4">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Tool Shed Home"
            >
              <Wrench className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <h2 className="font-headline text-lg font-semibold">
                  Tool Shed
                </h2>
                <p className="text-xs text-muted-foreground">
                  Developer Utilities
                </p>
              </div>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold md:text-xl font-headline">
              {getPageTitle()}
            </h1>
          </header>
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
