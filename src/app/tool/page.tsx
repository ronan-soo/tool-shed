import { redirect } from 'next/navigation';

export default function ToolRootPage() {
  // The main landing page is now at the root `/`.
  // Redirect any requests that land at the old tool root page.
  redirect('/');
}
