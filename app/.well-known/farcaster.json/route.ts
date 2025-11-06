import { minikitConfig } from "../../../minikit.config";

function withValidProperties(properties: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "boolean") {
        return true; // Include boolean values
      }
      return !!value;
    })
  );
}

export async function GET() {
  // Only include accountAssociation if all fields are present
  const hasAccountAssociation = 
    minikitConfig.accountAssociation.header &&
    minikitConfig.accountAssociation.payload &&
    minikitConfig.accountAssociation.signature;

  const accountAssociation = hasAccountAssociation
    ? {
        header: minikitConfig.accountAssociation.header,
        payload: minikitConfig.accountAssociation.payload,
        signature: minikitConfig.accountAssociation.signature,
      }
    : undefined;

  const miniappData = withValidProperties({
    version: minikitConfig.miniapp.version,
    name: minikitConfig.miniapp.name,
    subtitle: minikitConfig.miniapp.subtitle,
    description: minikitConfig.miniapp.description,
    screenshotUrls: [...minikitConfig.miniapp.screenshotUrls],
    iconUrl: minikitConfig.miniapp.iconUrl,
    splashImageUrl: minikitConfig.miniapp.splashImageUrl,
    splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
    homeUrl: minikitConfig.miniapp.homeUrl,
    webhookUrl: minikitConfig.miniapp.webhookUrl,
    primaryCategory: minikitConfig.miniapp.primaryCategory,
    tags: [...minikitConfig.miniapp.tags],
    heroImageUrl: minikitConfig.miniapp.heroImageUrl,
    tagline: minikitConfig.miniapp.tagline,
    ogTitle: minikitConfig.miniapp.ogTitle,
    ogDescription: minikitConfig.miniapp.ogDescription,
    ogImageUrl: minikitConfig.miniapp.ogImageUrl,
    // Set to false when ready for production
    noindex: true,
  });

  // Build response object
  // Include both 'frame' and 'miniapp' for backward compatibility
  const response: Record<string, unknown> = {
    miniapp: miniappData,
    frame: miniappData, // Some tools expect 'frame' instead of 'miniapp'
  };

  // Only add accountAssociation if it exists
  if (accountAssociation) {
    response.accountAssociation = accountAssociation;
  }

  return Response.json(response);
}
