import 'dotenv/config';

async function testPollinations() {
    const prompt = "A cute puppy in a fantasy style";
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    console.log("Image URL:", url);
    const response = await fetch(url);
    if(response.ok) {
        console.log("Success! Content-Type:", response.headers.get("content-type"));
    } else {
        console.log("Failed:", response.status);
    }
}
testPollinations();
