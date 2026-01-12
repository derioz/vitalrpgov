const fs = require('fs');
const path = require('path');

const changelogPath = path.join(__dirname, '../CHANGELOG.md');
const outputPath = path.join(__dirname, '../src/data/changelog.json');
const outputDir = path.join(__dirname, '../src/data');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

try {
    const fileContent = fs.readFileSync(changelogPath, 'utf-8');
    const sections = fileContent.split(/^## /m).slice(1);

    const logs = sections.map((section, index) => {
        const lines = section.split('\n');
        const header = lines[0].trim();
        const content = lines.slice(1).join('\n').trim();

        // Parse Header: vX.Y - Title (YYYY-MM-DD)
        const versionMatch = header.match(/^(v[\d\.]+)/);
        const version = versionMatch ? versionMatch[1] : `v${index}`;

        const dateMatch = header.match(/\((\d{4}-\d{2}-\d{2})\)/);
        const date = dateMatch ? dateMatch[1] : null;

        let title = "Update";
        if (header.includes('-')) {
            const afterDash = header.split('-').slice(1).join('-').trim();
            title = afterDash.replace(/\(\d{4}-\d{2}-\d{2}\)/, '').trim();
        } else {
            title = header.replace(version, '').trim();
        }

        return {
            id: `log-${index}`,
            version,
            title,
            content,
            date,
            author: 'System'
        };
    });

    fs.writeFileSync(outputPath, JSON.stringify(logs, null, 2));
    console.log(`[Success] Generated ${logs.length} changelog entries to ${outputPath}`);

} catch (error) {
    console.error('[Error] Failed to generate changelog:', error);
    process.exit(1);
}
