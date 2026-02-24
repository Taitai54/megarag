import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use DATABASE_URL environment variable for connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('ERROR: DATABASE_URL environment variable is required.');
    console.error('Usage: DATABASE_URL=postgresql://... node scripts/setup-db.mjs');
    process.exit(1);
}

const client = new pg.Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function runSQL(filePath, label) {
    const sql = fs.readFileSync(filePath, 'utf-8');
    console.log(`\n--- Running: ${label} ---`);
    try {
        await client.query(sql);
        console.log(`OK: ${label}`);
    } catch (err) {
        console.error(`FAIL: ${label}`);
        console.error(`  Code: ${err.code}`);
        console.error(`  Message: ${err.message}`);
        if (err.detail) console.error(`  Detail: ${err.detail}`);
        if (err.hint) console.error(`  Hint: ${err.hint}`);
        throw err;
    }
}

async function main() {
    const dbUrl = new URL(connectionString);
    console.log('Connecting to database...');
    console.log(`Host: ${dbUrl.host}`);
    try {
        await client.connect();
        console.log('Connected OK');
    } catch (err) {
        console.error('Connection failed:', err.message);
        console.error('Full error:', JSON.stringify(err, null, 2));
        process.exit(1);
    }

    const supabaseDir = path.join(__dirname, '..', 'supabase');

    await runSQL(path.join(supabaseDir, 'core_schema.sql'), 'Core Schema');
    await runSQL(path.join(supabaseDir, 'add_chat_settings.sql'), 'Chat Settings');
    await runSQL(path.join(supabaseDir, 'white_label_schema.sql'), 'White Label Schema');
    await runSQL(path.join(supabaseDir, 'rls_policies.sql'), 'RLS Policies');

    console.log('\nAll done! Database setup complete.');
    await client.end();
}

main().catch(err => {
    console.error('Script failed.');
    client.end().catch(() => { });
    process.exit(1);
});
