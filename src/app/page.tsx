import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Cable, Shield } from 'lucide-react';
import { ClownIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <main className="flex-1 container mx-auto flex items-center justify-center p-4">
        <div>
          <div className="mb-12 text-center">
            <ClownIcon className="mx-auto h-16 w-16 text-primary mb-4" />
            <h1 className="text-4xl font-bold font-headline tracking-tight sm:text-5xl lg:text-6xl">
              Welcome to Tool Shed
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Your one-stop collection of handy developer utilities. Select a tool
              to get started.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link href="/tool/pipelines" className="flex">
              <Card className="hover:border-primary hover:shadow-lg transition-all w-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-md">
                      <Cable className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="font-headline text-xl">
                      String Pipelines
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Create visual pipelines to process strings. Chain together
                    transformations like JSON parsing, case changes, and more.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
            <Link href="/tool/cryptography" className="flex">
              <Card className="hover:border-primary hover:shadow-lg transition-all w-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent rounded-md">
                      <Shield className="h-8 w-8 text-accent-foreground" />
                    </div>
                    <CardTitle className="font-headline text-xl">
                      Cryptography Tools
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription>
                    Securely encrypt/decrypt text, generate keys, and create
                    hashes. All processing is done locally in your browser.
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t bg-background/80 px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Tool Shed. All Rights Reserved.</p>
          <Link href="/disclaimer" className="hover:text-primary transition-colors">
            Disclaimer & Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
