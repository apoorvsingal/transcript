import { Blob } from "web-blob";

import { Configuration, OpenAIApi } from "openai";
import { readFileSync } from "fs";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const blob = new Blob([readFileSync("public/testAudio.mp3")], { type: "audio/mpeg3" });

export const createTranscript = async (file: any) => {
  const res = await openai.createTranscription(blob, "whisper-1");

  console.log(res);
};
