import fs from 'fs';
import path from 'path';

export interface ChangelogItem {
    id: string;
    version: string;
    title: string;
    content: string;
    date: string | null;
    author: string;
}

export async function getChangelog(): Promise<ChangelogItem[]> {
    const filePath = path.join(process.cwd(), 'CHANGELOG.md');

    if (!fs.existsSync(filePath)) {
        return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sections = fileContent.split(/^## /m).slice(1); // Split by h2, ignore preamble

    return sections.map((section, index) => {
        const lines = section.split('\n');
        const header = lines[0].trim(); // e.g. "v3.3 - Security & Roster Overhaul (2026-01-09)"
        const content = lines.slice(1).join('\n').trim();

        // Parse Header
        // Regex to capture Version, Title (optional), Date (optional)
        // Format: vX.Y - Title (YYYY-MM-DD)
        const versionMatch = header.match(/^(v[\d\.]+)/);
        const version = versionMatch ? versionMatch[1] : `v${index}`;

        // Extract date if present (YYYY-MM-DD)
        const dateMatch = header.match(/\((\d{4}-\d{2}-\d{2})\)/);
        const date = dateMatch ? dateMatch[1] : null;

        // Extract Title: Everything after " - " and before " (" or end
        let title = "Update";
        if (header.includes('-')) {
            const afterDash = header.split('-').slice(1).join('-').trim();
            title = afterDash.replace(/\(\d{4}-\d{2}-\d{2}\)/, '').trim();
        } else {
            // Fallback if no dash
            title = header.replace(version, '').trim();
        }

        return {
            id: `log-${index}`,
            version,
            title,
            content,
            date, // Use string for server component serialization
            author: 'System' // Default author for file-based logs
        };
    });
}
