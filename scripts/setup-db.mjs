import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try session mode pooler (port 5432)
const connectionString = 'postgresql://postgres.eqkrupcfymstsmrerbtm:PGXqXXcx97BgJwJB@aws-0-eu-west-2.pooler.supabase.com:5432/postgres';

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
    console.log('Connecting to Supabase...');
    console.log('Host: aws-0-eu-west-2.pooler.supabase.com:5432');
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

    console.log('\nAll done! Database setup complete.');
    await client.end();
}

main().catch(err => {
    console.error('Script failed.');
    client.end().catch(() => { });
    process.exit(1);
});
