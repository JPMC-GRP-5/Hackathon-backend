import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
	apiKey: "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",
});
const openai = new OpenAIApi(configuration);

const createCompletionChatGTP = async (location) => {
	try {
		const prompt = `Short travel description of location: ${location} around 30 words`;
		const completion = await openai.createCompletion({
			model: "text-davinci-003",
			prompt: prompt,
			max_tokens: 100,
		});
		return completion.data.choices[0].text;
	} catch (error) {
		if (error.response) {
			console.log(error.response.status);
			console.log(error.response.data);
		} else {
			console.log(error.message);
		}
	}
};

export default createCompletionChatGTP;
