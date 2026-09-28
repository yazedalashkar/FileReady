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
    enabled: false,
    provider: 'adsterra', // Adsterra Native Banner
    adsterra: {
      containerId: 'container-9a9605932a8b9e173e2bc610da3bbe44',
      scriptUrl: 'https://pl31477883.profitableratecpmnetwork.com/9a9605932a8b9e173e2bc610da3bbe44/invoke.js',
    },
  },
  // Mobile Android App Configuration
  androidApp: {
    enabled: true,
    version: '1.0.0',
    // Paste your public Google Drive APK link here:
    googleDriveUrl: 'https://drive.google.com/file/d/1mhEu_sO50VkvzxbfWf7N6-F5BlWC5axg/view?usp=drivesdk',
    // Paste your Uptodown store link here once approved:
    uptodownUrl: '',
    size: '12 MB',
  },
};
