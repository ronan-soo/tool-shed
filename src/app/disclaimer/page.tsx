import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ClownIcon } from '@/components/icons';

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 px-6 py-4 backdrop-blur-sm">
        <div className="container mx-auto">
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
        </div>
      </header>
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">
              Disclaimer & Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Disclaimer of Responsibility
              </h2>
              <p>
                This web application ("Tool Shed") is provided "as is" and "as
                available" without any warranties of any kind, either express or
                implied. The entire risk as to the quality and performance of
                the application is with you. Should the application prove
                defective, you assume the cost of all necessary servicing,
                repair, or correction.
              </p>
              <p>
                The creators and contributors of Tool Shed will not be liable
                for any direct, indirect, incidental, special, exemplary, or
                consequential damages (including, but not limited to,
                procurement of substitute goods or services; loss of use, data,
                or profits; or business interruption) however caused and on any
                theory of liability, whether in contract, strict liability, or
                tort (including negligence or otherwise) arising in any way out
                of the use of this software, even if advised of the possibility
                of such damage.
              </p>
              <p>
                All cryptographic operations are performed client-side in your
                browser. No data you enter into the cryptography tools is ever
                sent to our servers. However, we make no guarantees about the
                security or reliability of the cryptographic functions
                provided. Do not use these tools for sensitive,
                mission-critical, or high-security applications.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Use of Local Storage (Cookies)
              </h2>
              <p>
                To enhance your experience, this website uses your browser's
                local storage feature. This is similar to cookies but allows
                for slightly more data to be stored directly in your browser.
              </p>
              <p>Specifically, we use local storage to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Remember your cookie consent:</strong> When you accept
                  our cookie policy, we store that preference so we don't have
                  to ask you again on your next visit.
                </li>
                <li>
                  <strong>Save your string pipelines:</strong> The "String
                  Pipelines" tool allows you to save your created pipelines.
                  This information is stored exclusively in your browser's local
                  storage. It is not transmitted to our servers.
                </li>
              </ul>
              <p>
                By using this website, you consent to the use of local storage
                as described. If you do not wish to use local storage, you can
                disable it in your browser settings, but please be aware that
                this will prevent features like saving pipelines from working
                and you may be prompted about cookie consent on every page load.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <footer className="mt-auto border-t bg-background/80 px-6 py-4">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} Tool Shed. All Rights Reserved.
          </p>
          <Link href="/" className="hover:text-primary transition-colors">
            Return Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
