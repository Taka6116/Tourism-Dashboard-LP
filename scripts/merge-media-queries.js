const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'css', 'footer.css');
let css = fs.readFileSync(filePath, 'utf8');

// Extract base content (before first @media) and all @media blocks
const mediaBlocks = [];
let baseEnd = 0;
let i = 0;

function findMatchingBrace(str, start) {
    let depth = 0;
    let inString = false;
    let stringChar = null;
    let i = start;
    while (i < str.length) {
        const c = str[i];
        if (!inString) {
            if (c === '{') {
                depth++;
                if (depth === 1) i++;
                else i++;
            } else if (c === '}') {
                depth--;
                if (depth === 0) return i;
                i++;
            } else if ((c === '"' || c === "'") && str[i - 1] !== '\\') {
                inString = true;
                stringChar = c;
                i++;
            } else {
                i++;
            }
        } else {
            if (c === stringChar && str[i - 1] !== '\\') inString = false;
            i++;
        }
    }
    return -1;
}

while (i < css.length) {
    const mediaMatch = css.slice(i).match(/^\s*@media\s*([^{]+)\s*\{/);
    if (mediaMatch) {
        const fullMatch = mediaMatch[0];
        const condition = mediaMatch[1].trim();
        const start = i;
        const bodyStart = i + fullMatch.length;
        const bodyEnd = findMatchingBrace(css, bodyStart - 1);
        if (bodyEnd === -1) break;
        const body = css.slice(bodyStart, bodyEnd).trim();
        mediaBlocks.push({ condition, body, order: mediaBlocks.length });
        i = bodyEnd + 1;
        if (baseEnd === 0) baseEnd = start;
    } else {
        i++;
    }
}

const baseContent = (baseEnd > 0 ? css.slice(0, baseEnd) : css).replace(/\s*\/\*\s*レスポンシブデザイン\s*\*\/\s*$/, '').trim();

// Group by condition (exact string), merge bodies in original order; preserve first-appearance order
const byCondition = new Map();
const conditionOrder = [];
for (const { condition, body } of mediaBlocks) {
    const key = condition.replace(/\s+/g, ' ').trim();
    if (!byCondition.has(key)) {
        byCondition.set(key, []);
        conditionOrder.push(key);
    }
    byCondition.get(key).push(body);
}

let out = baseContent + '\n\n';

out += '/* レスポンシブデザイン（メディアクエリ統合） */\n';
for (const cond of conditionOrder) {
    const bodies = byCondition.get(cond);
    const mergedBody = bodies.join('\n\n    ');
    out += `\n@media ${cond} {\n    ${mergedBody}\n}\n`;
}

fs.writeFileSync(filePath, out, 'utf8');
console.log('Merged', mediaBlocks.length, 'media blocks into', byCondition.size, 'unique queries.');
