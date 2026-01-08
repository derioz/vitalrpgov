export const metadata = {
    title: 'LSEMS - Lost Santos Emergency Medical Services',
    description: 'Saving Lives, anytime, anywhere.',
};

export default function LSEMSLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen font-sans text-slate-900 dark:text-slate-100" data-theme="lsems">
            {/* LSEMS Theme Wrapper */}
            <div className="flex-1 w-full mx-auto max-w-[1920px]">
                {children}
            </div>
        </div>
    );
}
