'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import {
  encryptText,
  decryptText,
  CryptoError,
} from '@/lib/crypto-helpers';

type Tab = 'encrypt' | 'decrypt';

export function CryptoTool() {
  const [activeTab, setActiveTab] = useState<Tab>('encrypt');
  const [inputText, setInputText] = useState('');
  const [secret, setSecret] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleProcess = async () => {
    if (!inputText || !secret) {
      setError('Please provide both input text and a secret key.');
      return;
    }
    setError('');
    setIsLoading(true);
    setOutputText('');

    try {
      if (activeTab === 'encrypt') {
        const encrypted = await encryptText(inputText, secret);
        setOutputText(encrypted);
      } else {
        const decrypted = await decryptText(inputText, secret);
        setOutputText(decrypted);
      }
    } catch (e) {
      let errorMessage = 'An unknown error occurred.';
      if (e instanceof CryptoError) {
        errorMessage = e.message;
      } else if (e instanceof Error) {
        errorMessage =
          'Decryption failed. This could be due to an incorrect secret or corrupted data.';
      }
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Processing Error',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as Tab);
    // Clear fields on tab switch for better UX
    setInputText('');
    setOutputText('');
    setError('');
    setSecret('');
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="encrypt">Encrypt</TabsTrigger>
        <TabsTrigger value="decrypt">Decrypt</TabsTrigger>
      </TabsList>
      <TabContent
        title="Encrypt Text"
        description="Provide text and a secret to generate an encrypted string."
        value="encrypt"
        buttonText="Encrypt"
      />
      <TabContent
        title="Decrypt Text"
        description="Provide an encrypted string and the original secret to reveal the original text."
        value="decrypt"
        buttonText="Decrypt"
      />
    </Tabs>
  );

  function TabContent({
    value,
    title,
    description,
    buttonText,
  }: {
    value: Tab;
    title: string;
    description: string;
    buttonText: string;
  }) {
    return (
      <TabsContent value={value} className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>
              {description} This tool now uses AES-CBC encryption to be
              compatible with the .NET implementation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid w-full gap-2">
              <Label htmlFor={`input-${value}`}>
                {value === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}
              </Label>
              <Textarea
                id={`input-${value}`}
                placeholder="Enter text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={6}
                className="font-code"
              />
            </div>
            <div className="grid w-full gap-2">
              <Label htmlFor={`secret-${value}`}>Secret Key</Label>
              <Input
                id={`secret-${value}`}
                type="password"
                placeholder="Enter your Base64 encoded secret key..."
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Must be a 256-bit (32-byte) key, provided in Base64 format.
              </p>
            </div>
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid w-full gap-2">
              <Label htmlFor={`output-${value}`}>Result</Label>
              <Textarea
                id={`output-${value}`}
                placeholder="Result will appear here..."
                value={outputText}
                readOnly
                rows={6}
                className="font-code bg-muted/50"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleProcess} disabled={isLoading}>
              {isLoading ? 'Processing...' : buttonText}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    );
  }
}
