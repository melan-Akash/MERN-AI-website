import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    free_usage: {
        type: Number,
        default: 0,
    },
    plan: {
        type: String,
        default: 'free',
        enum: ['free', 'premium', 'pro', 'enterprise'],
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
