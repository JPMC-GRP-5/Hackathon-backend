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
