import axios from 'axios';
import Creation from "../models/Creation.js";
import User from "../models/User.js";
import cloudinary from "../configs/cloudinary.js";
import fs from 'fs';

// Check limits and update wrapper
const checkLimits = async (req, res, cost = 1) => {
    const plan = req.plan;
    let free_usage = req.free_usage;
    
    // Bypass limits during development/testing
    let maxUsage = Infinity;

    if (free_usage + cost > maxUsage) {
        res.status(403).json({ success: false, message: `Limit reached. You have used ${maxUsage} generations.` });
        return false;
    }
    return true;
};

const checkPremiumFeature = (req, res) => {
    // Bypass plan locks during development to allow testing all features
    return true;
};

const updateLimits = async (req, cost = 1) => {
    if (req.plan !== 'premium') {
        let free_usage = req.free_usage + cost;
        await User.findByIdAndUpdate(req.user._id, { free_usage });
    }
};

export const generateArticle = async (req, res) => {
    try {
        if (!(await checkLimits(req, res))) return;

        const { prompt, length } = req.body;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/owl-alpha",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: length || 1000
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const content = response.data.choices[0].message.content;

        const newCreation = new Creation({
            userId: req.user._id,
            prompt,
            content,
            type: 'article'
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserCreations = async (req, res) => {
    try {
        const creations = await Creation.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, creations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublicCreations = async (req, res) => {
    try {
        const creations = await Creation.find({ isPublic: true }).sort({ createdAt: -1 }).populate('userId', 'name');
        res.json({ success: true, creations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const likeCreation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const creation = await Creation.findById(id);
        if (!creation) return res.status(404).json({ success: false, message: "Creation not found" });

        if (creation.likes.includes(userId)) {
            creation.likes = creation.likes.filter(uid => uid.toString() !== userId.toString());
        } else {
            creation.likes.push(userId);
        }
        await creation.save();
        res.json({ success: true, likes: creation.likes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateBlogTitles = async (req, res) => {
    try {
        if (!(await checkLimits(req, res))) return;

        const { keyword, category } = req.body;

        const prompt = `Generate 5 catchy and SEO-friendly blog titles for a blog about "${keyword}" in the "${category}" category. Format the output as a numbered list.`;

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "openrouter/owl-alpha",
                messages: [
                    { role: "user", content: prompt }
                ],
                temperature: 0.8
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const content = response.data.choices[0].message.content;

        const newCreation = new Creation({
            userId: req.user._id,
            prompt: `Blog titles: ${keyword}`,
            content,
            type: 'blog-title'
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const reviewCV = async (req, res) => {
    try {
        if (!checkPremiumFeature(req, res)) return;
        if (!(await checkLimits(req, res))) return;

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload a PDF file" });
        }

        const fileData = fs.readFileSync(req.file.path);

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.5-flash",
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Review this resume. Provide constructive feedback on formatting, content, and ATS optimization. Highlight strengths and suggest 3 areas for improvement."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:${req.file.mimetype};base64,${fileData.toString("base64")}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.6,
                max_tokens: 2000
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const content = response.data.choices[0].message.content;

        // Cleanup uploaded file
        fs.unlinkSync(req.file.path);

        const newCreation = new Creation({
            userId: req.user._id,
            prompt: `Resume Review`,
            content,
            type: 'resume-review'
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content });
    } catch (error) {
        console.error(error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const generateImage = async (req, res) => {
    try {
        if (!checkPremiumFeature(req, res)) return;
        if (!(await checkLimits(req, res))) return;

        const { prompt, style, isPublic } = req.body;
        const fullPrompt = `${prompt}, in ${style} style`;
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}`;

        const newCreation = new Creation({
            userId: req.user._id,
            prompt: fullPrompt,
            content: imageUrl,
            type: 'image',
            isPublic: isPublic || false
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content: imageUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeBackground = async (req, res) => {
    try {
        if (!checkPremiumFeature(req, res)) return;
        if (!(await checkLimits(req, res))) return;

        if (!req.file) return res.status(400).json({ success: false, message: "Please upload an image" });

        const result = await cloudinary.uploader.upload(req.file.path, {
            background_removal: "cloudinary_ai"
        });

        // Background removal in cloudinary takes time, usually we poll or use a specific URL transform.
        // We can just apply the effect via URL transform directly if the account has the add-on, 
        // OR we can just use the generated remove_background transform.
        const processedUrl = cloudinary.url(result.public_id, { effect: "background_removal", secure: true });

        fs.unlinkSync(req.file.path);

        const newCreation = new Creation({
            userId: req.user._id,
            prompt: "Background Removal",
            content: processedUrl,
            type: 'remove-bg'
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content: processedUrl });
    } catch (error) {
        console.error(error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const removeObject = async (req, res) => {
    try {
        if (!checkPremiumFeature(req, res)) return;
        if (!(await checkLimits(req, res))) return;

        const { object } = req.body;
        if (!req.file || !object) {
            return res.status(400).json({ success: false, message: "Please upload an image and specify the object to remove" });
        }

        const result = await cloudinary.uploader.upload(req.file.path);
        
        // Gen remove transform
        const processedUrl = cloudinary.url(result.public_id, { effect: `gen_remove:prompt_${object}`, secure: true });

        fs.unlinkSync(req.file.path);

        const newCreation = new Creation({
            userId: req.user._id,
            prompt: `Remove object: ${object}`,
            content: processedUrl,
            type: 'remove-object'
        });
        await newCreation.save();
        await updateLimits(req);

        res.json({ success: true, content: processedUrl });
    } catch (error) {
        console.error(error);
        if (req.file) fs.unlinkSync(req.file.path);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const downloadFile = async (req, res) => {
    try {
        let { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: "URL is required" });

        // Normalize URL if it is protocol-relative
        if (url.startsWith('//')) {
            url = 'https:' + url;
        }

        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        res.setHeader('Content-Type', response.headers['content-type'] || 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename="ai-creation.png"');
        response.data.pipe(res);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Download failed: ' + error.message);
    }
};