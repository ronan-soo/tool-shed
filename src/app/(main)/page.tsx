import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { Cable, Shield, Wrench } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-headline tracking-tight">
          Welcome to Tool Shed
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Your one-stop collection of handy developer utilities. Select a tool
          to get started.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/pipelines" className="flex">
          <Card className="hover:border-primary hover:shadow-lg transition-all w-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-md">
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
        <Link href="/crypto" className="flex">
          <Card className="hover:border-primary hover:shadow-lg transition-all w-full flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/20 rounded-md">
                  <Shield className="h-8 w-8 text-accent-foreground" />
                </div>
                <CardTitle className="font-headline text-xl">
                  Encryption/Decryption
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>
                Securely encrypt and decrypt text using the AES algorithm. All
                processing is done locally in your browser for privacy.
              </CardDescription>
            </CardContent>
          </Card>
        </Link>
        <Card className="bg-card/50 border-dashed h-full flex flex-col">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-muted rounded-md">
                <Wrench className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle className="font-headline text-xl text-muted-foreground">
                More Tools Coming
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardDescription>
              We're always working on adding new and useful tools to the shed.
              Stay tuned for more!
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
