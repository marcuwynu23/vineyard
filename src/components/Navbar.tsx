'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CreateIdeaDialog from '@/components/CreateIdeaDialog';

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) {
  return (
    <Link 
      href={href} 
      className={twMerge(
        "px-3 py-2 text-sm font-medium rounded-md transition-colors",
        active 
          ? "bg-white/10 text-white" 
          : "text-gray-300 hover:text-white hover:bg-white/5"
      )}
    >
      {children}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="bg-gitlab-dark border-b border-gitlab-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Simple logo mimicking GitLab's tanuki or similar shape */}
            <svg className="w-6 h-6 text-gitlab-purple group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
            </svg>
            <span className="text-white font-bold text-lg tracking-tight">Vineyard</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            <NavLink href="/" active={pathname === '/'}>
              Dashboard
            </NavLink>
            <CreateIdeaDialog />
            <NavLink href="/graph" active={pathname === '/graph'}>
              Graph
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/10 text-xs px-2 py-0.5 rounded text-gray-300 border border-white/5">
             Dev Mode
          </div>
          <div className="w-8 h-8 rounded-full bg-gitlab-purple flex items-center justify-center text-white font-bold text-sm ring-2 ring-gitlab-dark">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
