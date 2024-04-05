import fetch from "node-fetch";

export const handler = async (event, context) => {
  // Parse the Lex event
  const { sessionState, inputTranscript } = event;
  const { intent } = sessionState;

  // Check if the intent is "GetLastDeployment"
  if (intent.name === "GetLastDeployment") {
    try {
      // Make a request to the Cloudflare Worker
      const response = await fetchLastDeployment();

      // Prepare the response for Lex
      const responseData = {
        sessionState: {
          ...sessionState,
          dialogAction: {
            type: "Close",
          },
          intent: {
            confirmationState: "Confirmed",
            name: intent.name,
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: response.message,
          },
        ],
        requestAttributes: {},
      };

      return responseData;
    } catch (error) {
      console.error("Error processing GetLastDeployment intent:", error);

      // Prepare an error response for Lex
      const responseData = {
        sessionState: {
          ...sessionState,
          dialogAction: {
            type: "Close",
          },
          intent: {
            confirmationState: "Confirmed",
            name: intent.name,
            state: "Failed",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content:
              "There was an error processing your request. Please try again later.",
          },
        ],
        requestAttributes: {},
      };

      return responseData;
    }
  } else {
    // Handle other intents or return a default response
    const responseData = {
      sessionState: {
        ...sessionState,
        dialogAction: {
          type: "Close",
        },
        intent: {
          confirmationState: "Denied",
          name: intent.name,
          state: "Failed",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "I'm afraid I don't understand that request.",
        },
      ],
      requestAttributes: {},
    };

    return responseData;
  }
};

async function fetchLastDeployment() {
  try {
    const response = await fetch(
      "https://infra-bot.nextfinancial.workers.dev/api/getLastDeployment"
    );
    const data = await response.json();
    return { message: data.response };
  } catch (error) {
    console.error("Error fetching deployment from Cloudflare Worker:", error);
    throw error;
  }
}
