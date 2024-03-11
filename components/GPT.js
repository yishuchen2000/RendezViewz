// const express = require("express");
// const OpenAI = require("openai");
// const app = express();
// app.use(express.json());

// const openai = new OpenAI({
//   apiKey: "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",
//   organization: "org-WLr8SbLneb2GU2RocRwhX1qg",
// });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "Can you provide me 10 recommendations of the trending movies or TV shows based on my following preferences? Animation, Commedy, Action, Adventure. Return recommendations as a json file of an array. For example, [Mean Girls, The Shining, Chainsaw Man]",
//       },
//     ],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);
// }

// main();

// import { API_KEY } from "react-native-dotenv";

const getRecommendations = async (genres) => {
  console.log("RUNNING REC FUNCTION");
  // const express = require("express");
  const OpenAI = require("openai");
  // const app = express();
  // app.use(express.json());

  const openai = new OpenAI({
    apiKey: API_KEY,
    // organization: "org-WLr8SbLneb2GU2RocRwhX1qg",
  });

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Can you provide me 10 recommendations of the trending movies or TV shows based on my following genre preferences? ${genres}. Return recommendations as an array of names. Respond in this format: ["Inception","The Godfather","Friends","Stranger Things","The Crown"]`,
      },
    ],
    model: "gpt-3.5-turbo",
  });
  let output = completion.choices[0].message.content;
  console.log("THIS IS RESPONSE", output);
  console.log("THIS IS RESPONSE TYPE", typeof output);

  // const movieNamesArray = JSON.parse(movieNamesString);
  // console.log("NAMEs", movieNamesArray);

  // const jsonString = output.replace(/'/g, '"');
  // const responseArray = JSON.parse(jsonString);

  // console.log("THIS IS FINAL OUTPUT", responseArray);
  // console.log("THIS IS OUTPUT TYPE", typeof responseArray);

  return output;
};

export default getRecommendations;
