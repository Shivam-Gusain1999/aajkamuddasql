import 'dotenv/config';
import { User } from './src/models/index.js';
import { sequelize } from './src/config/db.js';

async function seedAdmin() {
    try {
        console.log('Connecting to MySQL database...');
        await sequelize.authenticate();
        
        // Sync only the User table
        await User.sync({ alter: true });
        
        const adminEmail = 'admin@news.com';
        const existingAdmin = await User.findOne({ where: { email: adminEmail } });

        if (existingAdmin) {
            console.log('Admin user already exists. Updating role to Ensure ADMIN access.');
            existingAdmin.role = 'ADMIN';
            existingAdmin.password = 'admin123';
            await existingAdmin.save();
            console.log('✅ Admin user updated successfully.');
        } else {
            console.log('Creating new Admin user...');
            const adminUser = await User.create({
                fullName: 'Super Admin',
                username: 'superadmin',
                email: adminEmail,
                password: 'admin123',
                role: 'ADMIN'
            });
            console.log('✅ Admin user created successfully:', adminUser.email);
        }

        console.log('\n--- Admin Login Credentials ---');
        console.log('Email: admin@news.com');
        console.log('Password: admin123');
        console.log('-------------------------------\n');
        
    } catch (e) {
        console.error('❌ Failed to seed admin:', e.message);
    } finally {
        await sequelize.close();
        console.log('Database disconnected.');
    }
}

seedAdmin();
