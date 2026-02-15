import { redirect } from 'next/navigation';

export default function ToolRootPage() {
  // Redirect requests for the tool root to the main landing page.
  redirect('/');
}
