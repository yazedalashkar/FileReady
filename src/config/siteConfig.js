/**
 * FileReady Global Site Configuration
 * SINGLE SOURCE OF TRUTH for maintenance mode and advertising slots.
 */
export const SITE_CONFIG = {
  // Maintenance mode configuration
  // Set maintenanceMode to true to take the site offline into maintenance mode.
  maintenanceMode: true,

  maintenance: {
    titleAr: "ميزات جديدة وحصرية قادمة قريباً",
    titleEn: "Exclusive new features are coming soon.",
    descriptionAr: "نعمل حالياً على تطوير تجربة FileReady لتكون أفضل.",
    descriptionEn: "We're working on something better for you.",
  },

  // Advertising configuration
  ads: {
    enabled: false,
    provider: 'adsterra', // Adsterra Native Banner
    adsterra: {
      containerId: 'container-9a9605932a8b9e173e2bc610da3bbe44',
      scriptUrl: 'https://pl31477883.profitableratecpmnetwork.com/9a9605932a8b9e173e2bc610da3bbe44/invoke.js',
    },
  },
};
