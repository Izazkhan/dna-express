// services/UserService.js
import models from '../../models/index.js';
import { ApiError } from '../../../utils/api-response.js';
import bcrypt from 'bcryptjs';

const { User } = models;

/**
 * Service handling user data management, profile updates, and secure account deletion.
 */
class UserService {
    /**
     * @method getUserById
     * @description Retrieves a user profile by its ID using the 'advertiser' scope.
     * @param {number|string} id - The primary key of the user.
     * @returns {Promise<User>} The user instance.
     * @throws {ApiError} If the user is not found.
     */
    async getUserById(id) {
        const user = await User.scope('advertiser').findByPk(id);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return user;
    }

    /**
     * @method getUserByEmail
     * @description Finds a single user record based on their email address.
     * @param {string} email - The email to search for.
     * @returns {Promise<User>} The user instance.
     * @throws {ApiError} If the user is not found.
     */
    async getUserByEmail(email) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        return user;
    }

    /**
     * @method updateUser
     * @description Updates user information, including secure password hashing if a new password is provided.
     * @param {number|string} id - The ID of the user to update.
     * @param {Object} updateData - The data object containing fields to update.
     * @returns {Promise<User>} The updated and reloaded user instance.
     * @throws {ApiError} If the user is not found.
     */
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

    /**
     * @method deleteUser
     * @description Removes a user record from the database.
     * @param {number|string} id - The ID of the user to delete.
     * @returns {Promise<boolean>} Returns true on successful deletion.
     * @throws {ApiError} If the user is not found.
     */
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