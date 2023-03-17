import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function createCompletionChatGTP({ location }) {
    const message=`can you give an itinerary of only ${location} in 30 words?`
 try{
    const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `${message}`,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
      });
  return response;
 } catch(e){
    console.error(e.message);
 } 
       
}

export default createCompletionChatGTP
