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
import { Terminal, Copy } from 'lucide-react';
import {
  encryptText,
  decryptText,
  CryptoError,
  arrayBufferToBase64,
} from '@/lib/crypto-helpers';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Tab = 'encrypt' | 'decrypt';

function RandomKeyGenerator() {
  const [bits, setBits] = useState('256');
  const [generatedKey, setGeneratedKey] = useState('');
  const { toast } = useToast();

  const generateRandomKey = () => {
    if (typeof window === 'undefined') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Web Crypto API is not available.',
      });
      return;
    }
    const byteLength = parseInt(bits, 10) / 8;
    const randomBytes = window.crypto.getRandomValues(new Uint8Array(byteLength));
    const base64Key = arrayBufferToBase64(randomBytes.buffer);
    setGeneratedKey(base64Key);
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast({
        title: 'Copied!',
        description: 'The key has been copied to your clipboard.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Random Key Generator</CardTitle>
        <CardDescription>
          Generate a cryptographically secure random key in Base64 format.
          Useful for creating new secrets.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Key Size</Label>
          <RadioGroup
            value={bits}
            onValueChange={setBits}
            className="flex items-center space-x-4 pt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="128" id="r1" />
              <Label htmlFor="r1">128-bit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="192" id="r2" />
              <Label htmlFor="r2">192-bit</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="256" id="r3" />
              <Label htmlFor="r3">256-bit</Label>
            </div>
          </RadioGroup>
        </div>

        {generatedKey && (
          <div className="grid w-full gap-2">
            <Label htmlFor="generated-key">Generated Key (Base64)</Label>
            <div className="relative">
              <Input
                id="generated-key"
                readOnly
                value={generatedKey}
                className="font-code pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                onClick={copyToClipboard}
                aria-label="Copy key"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={generateRandomKey}>Generate Key</Button>
      </CardFooter>
    </Card>
  );
}

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
    <div className="flex h-full flex-col gap-8">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-1 flex-col"
      >
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
      <RandomKeyGenerator />
    </div>
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
      <TabsContent value={value} className="mt-6 flex-1">
        <Card className="flex h-full w-full flex-col">
          <CardHeader>
            <CardTitle className="font-headline">{title}</CardTitle>
            <CardDescription>
              {description} This tool now uses AES-CBC encryption to be
              compatible with the .NET implementation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-6">
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor={`input-${value}`}>
                {value === 'encrypt' ? 'Plain Text' : 'Encrypted Text'}
              </Label>
              <Textarea
                id={`input-${value}`}
                placeholder="Enter text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="font-code flex-1"
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
            <div className="flex flex-1 flex-col gap-2">
              <Label htmlFor={`output-${value}`}>Result</Label>
              <Textarea
                id={`output-${value}`}
                placeholder="Result will appear here..."
                value={outputText}
                readOnly
                className="font-code flex-1 bg-muted/50"
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
