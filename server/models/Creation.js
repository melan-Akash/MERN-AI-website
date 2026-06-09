import mongoose from 'mongoose';

const creationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    prompt: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default mongoose.models.Creation || mongoose.model('Creation', creationSchema);
