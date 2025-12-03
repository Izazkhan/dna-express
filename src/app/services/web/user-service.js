// services/UserService.js
import { User } from '../../models/index.js';
import { ApiError } from '../../../utils/api-response.js';
import bcrypt from 'bcryptjs';

class UserService {
    // [Api] Get user by ID
    async getUserById(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return user;
    }

    // [Api] Get user by email
    async getUserByEmail(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return user;
    }

    // [Api] Update user (with optional password hash)
    async updateUser(id, updateData) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        // Handle password update securely
        if (updateData.password && updateData.password.length > 0) {
            const hashedPassword = await bcrypt.hash(updateData.password, 10);
            updateData = { ...updateData, password: hashedPassword };
        } else {
            delete updateData.password;
        }

        await user.update(updateData);
        return user.reload(); // Return fresh data
    }

    // [Api] Delete user
    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }

        await user.destroy();
        return true;
    }
}

// Export singleton instance
export default new UserService();