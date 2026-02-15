import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Disclaimer | Tool Shed',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Disclaimer of Responsibility</CardTitle>
          <CardDescription>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The information and tools provided by Tool Shed (the "Service") are for general informational and utility purposes only. All information and tools on the Service are provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information or tools on the Service.
          </p>
          <p>
            <strong>UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR RELIANCE ON ANY INFORMATION OR TOOLS PROVIDED ON THE SITE. YOUR USE OF THE SITE AND YOUR RELIANCE ON ANY INFORMATION OR TOOL IS SOLELY AT YOUR OWN RISK.</strong>
          </p>
          <p>
            The cryptographic functions provided within this tool are for educational and demonstrative purposes. While they utilize the Web Crypto API, which is a standard for in-browser cryptography, you should not rely on this tool for securing sensitive, production-level data. All cryptographic operations are performed locally in your browser, and no data is sent to our servers. However, the security of these operations is dependent on the security of your own computer and browser environment.
          </p>
          <p>
            The Service may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.
          </p>
          <h3 className="font-semibold text-foreground pt-4">Cookies & Local Storage Policy</h3>
          <p>
            This website uses local storage to save your preferences, such as the state of the sidebar and saved string pipelines. By using this Service, you consent to the use of local storage for these purposes. We do not use cookies for tracking or advertising. Local storage is a standard web technology that allows a website or application to store data in a user's browser. This data remains on your device and is not sent to our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
