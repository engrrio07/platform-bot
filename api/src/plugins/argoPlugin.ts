export const argoPlugin = async (
  DEVTRON_APPS_STAGING: string[],
  DEVTRON_APPS_PRODUCTION: string[],
  DEVTRON_APPS_SANDBOX: string[],
  ARGO_API_KEY: string,
  ENVIRONMENT: string
) => {
  if (
    !ARGO_API_KEY ||
    !DEVTRON_APPS_STAGING ||
    !DEVTRON_APPS_PRODUCTION ||
    !DEVTRON_APPS_SANDBOX
  )
    return "Missing Argo API key or Devtron app names.";

  const apiKey = ARGO_API_KEY;
  try {
    let message = "Here are the details of our recent deployments:\n";

    let devtronApps: string[] = [];

    if (ENVIRONMENT === "production" || ENVIRONMENT === "prod") {
      devtronApps = DEVTRON_APPS_PRODUCTION
        ? DEVTRON_APPS_PRODUCTION.split(",")
        : [];
    } else if (ENVIRONMENT === "sandbox") {
      devtronApps = DEVTRON_APPS_SANDBOX ? DEVTRON_APPS_SANDBOX.split(",") : [];
    } else {
      devtronApps = DEVTRON_APPS_STAGING ? DEVTRON_APPS_STAGING.split(",") : [];
    }

    for (const devtronApp of devtronApps) {
      // Fetch the last deployment for the service
      const deploymentResponse = await fetch(
        `https://argo-internal.kapitol.io/api/v1/applications/${devtronApp}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      if (!deploymentResponse.ok) {
        return `Error fetching deployment data from Argo: ${deploymentResponse.status} - ${deploymentResponse.statusText}`;
      }

      const deploymentData = await deploymentResponse.json();
      const lastDeployment = deploymentData.status.operationState.finishedAt;
      console.log("lastDeployment", lastDeployment);

      message += `• Service: *${devtronApp}* was last deployed on *${new Date(
        lastDeployment
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
    console.error("Error fetching data from Argo:", error);
    return "An error occurred while fetching data from Argo";
  }
};
