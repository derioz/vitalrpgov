export const metadata = {
    title: 'SAFD - San Andreas Fire Department',
    description: 'Courage, Integrity, Sacrifice.',
};

export default function SAFDLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100" data-theme="safd">
            <div className="flex-1 w-full mx-auto max-w-[1920px]">
                {children}
            </div>
        </div>
    );
}
