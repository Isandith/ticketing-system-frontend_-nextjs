import { redirect } from 'next/navigation';

/**
 * Default landing route that redirects users to the login page.
 */
export default function HomePage() {
  redirect('/login');
}
