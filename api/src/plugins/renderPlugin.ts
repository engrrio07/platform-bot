export const renderPlugin = async (
  RENDER_SERVICE_ID: string,
  RENDER_API_KEY: string
) => {
  if (!(RENDER_SERVICE_ID && RENDER_API_KEY))
    return "Missing Render API key or service ID.";

  const apiKey = RENDER_API_KEY;
  const serviceId = RENDER_SERVICE_ID;

  try {
    // Make the API call to Render to fetch the last deployment
    const response = await fetch(
      `https://api.render.com/v1/services/${serviceId}/deploys`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      return c.text(
        `Error fetching data from Render: ${response.status} - ${response.statusText}`,
        500
      );
    }

    const data = await response.json();

    // Process the data and convert it to a human-readable format
    const lastDeployment = data[0].deploy;
    const message = `The last deployment of our app was on ${new Date(
      lastDeployment.finishedAt
    ).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZone: "Asia/Manila",
    })}.`;

    return message;
  } catch (error) {
    console.error("Error fetching data from Render:", error);
    return "An error occurred while fetching data from Render";
  }
};
