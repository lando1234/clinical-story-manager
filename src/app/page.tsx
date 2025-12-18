import { redirect } from 'next/navigation';

/**
 * Root page - redirects automatically to patient list
 * Per spec: docs/25_root_behavior_spec.md
 */
export default async function Home() {
  redirect('/patients');
}
