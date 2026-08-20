const fs = require('fs');

let pageBuilder = fs.readFileSync('src/app/admin/builder/page.tsx', 'utf8');
pageBuilder = pageBuilder.replace(/\\\`/g, '\`');
pageBuilder = pageBuilder.replace(/\\\$/g, '$');
fs.writeFileSync('src/app/admin/builder/page.tsx', pageBuilder);

let pageTsx = fs.readFileSync('src/app/page.tsx', 'utf8');
pageTsx = pageTsx.replace(/\\\`/g, '\`');
pageTsx = pageTsx.replace(/\\\$/g, '$');

// Also, let's fix the missing closing parenthesis in page.tsx if it's there
// If it's literally missing ')' at the end:
if (!pageTsx.includes('</main>\\n  );\\n}')) {
  // Try to fix main return
}

fs.writeFileSync('src/app/page.tsx', pageTsx);
