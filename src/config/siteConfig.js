/**
 * FileReady Global Site Configuration
 * SINGLE SOURCE OF TRUTH for maintenance mode and advertising slots.
 */
export const SITE_CONFIG = {
  // Maintenance mode configuration
  // Set maintenanceMode to true to take the site offline into maintenance mode.
  maintenanceMode: false,

  maintenance: {
    titleAr: "ميزات جديدة وحصرية قادمة قريباً",
    titleEn: "Exclusive new features are coming soon.",
    descriptionAr: "نعمل حالياً على تطوير تجربة FileReady لتكون أفضل.",
    descriptionEn: "We're working on something better for you.",
  },

  // Advertising configuration
  ads: {
    enabled: true,

    // Google AdSense settings
    // Replace placeholders with your real values from Google AdSense:
    // e.g., clientId: "ca-pub-1234567890123456", slotId: "1234567890"
    adsense: {
      enabled: false, // Set to true after adding your real AdSense Client ID & Slot ID
      clientId: "ADSENSE_CLIENT_ID", // e.g. "ca-pub-XXXXXXXXXXXXXXXX"
      slotId: "ADSENSE_SLOT_ID", // e.g. "1234567890"
      format: "auto",
      responsive: true,
    },

    // Content rotation interval for promotional banner slides (in milliseconds)
    rotationIntervalMs: 10000, // 10 seconds
  },
};
