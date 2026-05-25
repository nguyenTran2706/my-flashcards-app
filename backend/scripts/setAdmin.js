// Promote an existing user to admin role.
// Usage: node scripts/setAdmin.js <email>
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/user.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '..', '.env') });

const run = async () => {
    const email = process.argv[2];
    if (!email) {
        console.error('Usage: node scripts/setAdmin.js <email>');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    const user = await User.findOneAndUpdate(
        { email },
        { role: 'admin' },
        { new: true },
    ).select('-password');

    if (!user) {
        console.error(`No user found with email "${email}".`);
        await mongoose.disconnect();
        process.exit(1);
    }

    console.log(`✓ ${user.email} is now an admin (role: ${user.role})`);
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
