const fs = require('node:fs');
const path = require('path');
const https = require('node:https');
// Try to load dotenv if available
try {
    require('dotenv').config();
} catch (e) {
    // Manually load .env if dotenv fails or just simplistic fallback
    const envPath = path.join(__dirname, '../.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, val] = line.split('=');
            if (key && val) process.env[key.trim()] = val.trim();
        });
    }
}

const SCAN_DIRS = [
    path.join(__dirname, '../app'),
    path.join(__dirname, '../components'),
    path.join(__dirname, '../lib'),
    path.join(__dirname, '../hooks'),
    path.join(__dirname, '../config')
];
const OUTPUT_FILE = path.join(__dirname, '../docs/CODEBASE_MAP.md');
const IGNORE_DIRS = ['node_modules', '.git', 'dist', 'build', '.next'];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

function getFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                getFiles(filePath, fileList);
            }
        } else {
            if (/\.(js|jsx|ts|tsx)$/.test(file)) {
                fileList.push(filePath);
            }
        }
    });
    return fileList;
}

function extractFunctions(content) {
    const functions = [];
    const functionRegex = /function\s+(\w+)|const\s+(\w+)\s*=\s*(\(|async\s*\()/g;
    const classRegex = /class\s+(\w+)/g;

    let match;
    while ((match = functionRegex.exec(content)) !== null) {
        if (match[1]) functions.push(`Function: ${match[1]}`);
        if (match[2]) functions.push(`Function: ${match[2]}`);
    }
    while ((match = classRegex.exec(content)) !== null) {
        if (match[1]) functions.push(`Class: ${match[1]}`);
    }
    return functions;
}

function fetchSupabaseSchema() {
    return new Promise((resolve) => {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
            console.warn('Supabase credentials not found. Skipping schema generation.');
            resolve('');
            return;
        }

        const options = {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        };

        const apiUrl = `${SUPABASE_URL}/rest/v1/?apikey=${SUPABASE_KEY}`; // PostgREST root returns OpenAPI spec

        https.get(apiUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const schema = JSON.parse(data);
                    resolve(formatSchema(schema));
                } catch (e) {
                    console.error('Error parsing Supabase schema:', e.message);
                    resolve('');
                }
            });
        }).on('error', (e) => {
            console.error('Error fetching Supabase schema:', e.message);
            resolve('');
        });
    });
}

function formatSchema(schema) {
    if (!schema || !schema.definitions) return '';

    let output = '# Supabase Schema\n\n';

    // Sort tables alphabetically
    const tables = Object.keys(schema.definitions).sort();

    tables.forEach(tableName => {
        const def = schema.definitions[tableName];
        output += `## Table: \`${tableName}\`\n\n`;
        // Description if available in OpenAPI
        if (def.description) {
            output += `> ${def.description.split('\n')[0]}\n\n`;
        }

        output += `| Column | Type | Format | Required |\n`;
        output += `| :--- | :--- | :--- | :---: |\n`;

        const required = def.required || [];
        const properties = def.properties || {};

        Object.keys(properties).forEach(colName => {
            const col = properties[colName];
            const type = col.type || 'unknown';
            const format = col.format || '-';
            const isReq = required.includes(colName) ? 'Yes' : 'No';
            output += `| **${colName}** | ${type} | ${format} | ${isReq} |\n`;
        });
        output += '\n';
    });

    return output;
}

async function generateMap() {
    console.log('Scanning codebase...');
    let files = [];
    SCAN_DIRS.forEach(dir => {
        if (fs.existsSync(dir)) {
            console.log(`Scanning ${path.basename(dir)}...`);
            files = files.concat(getFiles(dir));
        }
    });
    let output = '# Codebase Map\n\n';

    files.sort();
    files.forEach(filePath => {
        const relativePath = path.relative(path.join(__dirname, '../'), filePath);
        const content = fs.readFileSync(filePath, 'utf8');
        const items = extractFunctions(content);

        output += `## ${relativePath}\n`;
        if (items.length > 0) {
            items.forEach(item => {
                output += `- ${item}\n`;
            });
        } else {
            output += `- (No top-level functions or classes detected)\n`;
        }
        output += '\n';
    });

    console.log('Fetching Database Schema...');
    const schemaOutput = await fetchSupabaseSchema();

    if (schemaOutput) {
        output = schemaOutput + '\n---\n\n' + output; // Prepend schema or append? User request: included. Usually schema first is nice context.
    }

    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    fs.writeFileSync(OUTPUT_FILE, output);
    console.log(`Codebase map generated at ${OUTPUT_FILE}`);
}

generateMap();
