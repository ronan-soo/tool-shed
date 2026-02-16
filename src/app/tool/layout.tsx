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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cable, Shield, ChevronRight } from 'lucide-react';
import React from 'react';
import { ClownIcon } from '@/components/icons';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tool/pipelines', label: 'String Pipelines', icon: Cable },
  {
    href: '/tool/cryptography',
    label: 'Cryptography',
    icon: Shield,
    subItems: [
      { href: '/tool/cryptography/encrypt-decrypt', label: 'Encrypt / Decrypt' },
      { href: '/tool/cryptography/hasher', label: 'SHA-256 Hasher' },
      { href: '/tool/cryptography/key-generator', label: 'Key Generator' },
    ],
  },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const getPageTitle = () => {
    const currentRootItem = navItems.find(
      (item) => item.href !== '/' && pathname.startsWith(item.href)
    );

    if (currentRootItem) {
      if (currentRootItem.subItems) {
        const subItem = currentRootItem.subItems.find(
          (sub) => pathname === sub.href
        );
        if (subItem) return subItem.label;
      }
      return currentRootItem.label;
    }

    return 'Tool Shed';
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
              <ClownIcon className="h-8 w-8 text-primary" />
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
                  {item.subItems ? (
                    <Collapsible defaultOpen={pathname.startsWith(item.href)}>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={pathname.startsWith(item.href)}
                          tooltip={item.label}
                          className="w-full justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <item.icon />
                            <span>{item.label}</span>
                          </span>
                          <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.subItems.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.href}
                              >
                                <Link href={subItem.href}>
                                  <span>{subItem.label}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <div className="flex flex-col min-h-svh">
            <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold md:text-xl font-headline">
                {getPageTitle()}
              </h1>
            </header>
            <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
            <footer className="mt-auto border-t bg-background/80 px-6 py-4">
              <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground sm:justify-between">
                <p>&copy; {new Date().getFullYear()} Tool Shed. All Rights Reserved.</p>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">
                  Disclaimer & Policy
                </Link>
              </div>
            </footer>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
