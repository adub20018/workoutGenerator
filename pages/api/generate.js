import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }
  // initialise workout with request body or empty string if property does not exist
  const workout = req.body.workout || "";
  // trim is called to remove whitespace
  if (workout.length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid workout specification",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(workout),
      temperature: 0.2,
      max_tokens: 200, // makes the answer more lengthy
    });
    // res.status(200).json({ result: completion.data.choices[0].text });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(workout) {
  const capitalizedWorkout =
    workout[0].toUpperCase() + workout.slice(1).toLowerCase();
  return `Create a workout exercise routine

workout: ${capitalizedWorkout}
workout: ${capitalizedWorkout}`;
}
