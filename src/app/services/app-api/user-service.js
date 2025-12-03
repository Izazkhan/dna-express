import { User } from "../../models/index.js";

class UserService {
    async create({ email, password, name, role }) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) throw new ApiError(400, 'User already exists');

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name, role });

        await user.update();

        // TODO: send welcome email to influencer

        return {
            user: user,
            accessToken,
            refreshToken,
        };
    }
}

export default new UserService;