'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on full-viewport app layouts like playground or problem workspace
  const isPlayground = pathname === '/playground';
  const isProblemWorkspace = pathname?.includes('/problems/') && pathname !== '/problems';

  if (isPlayground || isProblemWorkspace) {
    return null;
  }

  return <Footer />;
}
