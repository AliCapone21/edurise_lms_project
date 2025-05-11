import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const extractTagsFromPrompt = async (req, res) => {
    const { input } = req.body;

    try {
        const prompt = `Extract relevant keywords or tags from this search input for course filtering (return as JSON array only):\n"${input}"`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const tags = JSON.parse(response.choices[0].message.content);
        res.json({ success: true, tags });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

export const getCourseFact = async (req, res) => {
    const { topic } = req.body;

    try {
        const prompt = `Give a brief interesting fact or insight (max 40 words) about "${topic}".`;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
        });

        const fact = response.choices[0].message.content.trim();
        res.json({ success: true, fact });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};
