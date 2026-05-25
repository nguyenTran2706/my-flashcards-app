// Export every MongoDB collection to a JSON file under /database-export.
// Usage: node scripts/exportDb.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, writeFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const outDir = join(__dirname, '..', '..', 'database-export');

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    mkdirSync(outDir, { recursive: true });

    const collections = await mongoose.connection.db.listCollections().toArray();

    for (const { name } of collections) {
        const docs = await mongoose.connection.db.collection(name).find().toArray();
        const file = join(outDir, `${name}.json`);
        writeFileSync(file, JSON.stringify(docs, null, 2));
        console.log(`✓ ${name}: ${docs.length} documents → database-export/${name}.json`);
    }

    await mongoose.disconnect();
    console.log('Done.');
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
