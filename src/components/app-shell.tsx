import type {ReactNode} from 'react';
import Link from 'next/link';
import {navigationItems} from '../config/navigation';

type AppShellProps = {
    children: ReactNode;    
};


export function AppShell({children}: AppShellProps) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex min-h-screen">
                <aside className="hidden w-64 border-r border-border bg-surface md:flex md:flex-col">
                    <div className="border-b border-border px-6 py-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-white">TYC</div>
                        <h1 className="mt-2 text-lg text-foreground font-bold">Cartas Fianza</h1>
                    </div>  

                    <nav className="flex-1 space-y-1 p-4">
                        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted">
                            Gestión
                        </p>

                        {navigationItems.map((item) => (
                            <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm font-medium text-muted hover:bg-primary-soft hover:text-primary">
                            {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-border px-6 py-4">
                        <p className="text-xs text-muted">Prototipo Local</p>
                    </div>

                </aside>


                <div className="flex min-w-0 flex-1 flex-col">
                    <header className="flex items-center h-16 justify-between border-b border-border bg-surface px-6">

                        <div>
                            <p className="text-sm text-muted">
                                Gestion / <span className="font-medium text-foreground">Cartas Fianza</span>
                            </p>
                        </div>

                    </header>
                        
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

