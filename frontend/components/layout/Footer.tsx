import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-transparent py-6 px-6 text-slate-400 mt-auto w-full relative z-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-7xl mx-auto text-xs font-semibold">
        <div>
          © {new Date().getFullYear()} <span className="text-white font-extrabold tracking-tight">LOGIC<span className="text-blue-500 font-black">2</span>CODE <span className="text-indigo-400 font-bold text-[9px] border border-indigo-900/30 px-1 rounded bg-indigo-950/40">AI</span></span>. All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/about" className="hover:text-white transition-colors link-underline-slide pb-0.5">About</Link>
          <Link href="/pricing" className="hover:text-white transition-colors link-underline-slide pb-0.5">Pricing</Link>
          <Link href="/contact" className="hover:text-white transition-colors link-underline-slide pb-0.5">Contact</Link>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="text-slate-400 social-icon-hover cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Twitter"
            className="text-slate-400 social-icon-hover cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </a>
          <a
            href="https://logic2code.ai"
            target="_blank"
            rel="noopener noreferrer"
            title="Website"
            className="text-slate-400 social-icon-hover cursor-pointer"
          >
            <Globe className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
