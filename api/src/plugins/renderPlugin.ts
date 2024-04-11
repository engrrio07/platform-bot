export const renderPlugin = async (
  RENDER_SERVICE_IDS: string[],
  RENDER_API_KEY: string,
  ENVIRONMENT: string
) => {
  if (!RENDER_API_KEY || !RENDER_SERVICE_IDS || !RENDER_SERVICE_IDS.length)
    return "Missing Render API key or service IDs.";

  const apiKey = RENDER_API_KEY;
  try {
    let message = "Here are the details of our recent deployments:\n";

    const serviceIds = RENDER_SERVICE_IDS?.split(",") || [];
    for (const serviceId of serviceIds) {
      // Fetch the service name
      const serviceNameResponse = await fetch(
        `https://api.render.com/v1/services/${serviceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!serviceNameResponse.ok) {
        return `Error fetching service name from Render: ${serviceNameResponse.status} - ${serviceNameResponse.statusText}`;
      }

      const serviceNameData = await serviceNameResponse.json();
      const serviceName = serviceNameData.name;

      if (ENVIRONMENT === "staging" && serviceName !== "frontend-staging") {
        continue;
      } else if (
        (ENVIRONMENT === "production" || ENVIRONMENT === "prod") &&
        serviceName !== "frontend-production"
      ) {
        continue;
      } else if (
        ENVIRONMENT === "sandbox" &&
        serviceName !== "frontend-sandbox"
      ) {
        continue;
      }

      // Fetch the last deployment for the service
      const deploymentResponse = await fetch(
        `https://api.render.com/v1/services/${serviceId}/deploys`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!deploymentResponse.ok) {
        return `Error fetching deployment data from Render: ${deploymentResponse.status} - ${deploymentResponse.statusText}`;
      }

      const deploymentData = await deploymentResponse.json();
      const lastDeployment = deploymentData[0].deploy;

      message += `• Service: *${serviceName}* was last deployed on *${new Date(
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
      })}*.\n`;
    }

    return message;
  } catch (error) {
    console.error("Error fetching data from Render:", error);
    return "An error occurred while fetching data from Render";
  }
};
