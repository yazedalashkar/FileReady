/**
 * FileReady Global Site Configuration
 * SINGLE SOURCE OF TRUTH for maintenance mode.
 * 
 * To activate maintenance mode, set maintenanceMode to true.
 * To resume normal service, set maintenanceMode to false.
 */
export const SITE_CONFIG = {
  maintenanceMode: false,

  maintenance: {
    titleAr: "ميزات جديدة وحصرية قادمة قريباً",
    titleEn: "Exclusive new features are coming soon.",
    descriptionAr: "نعمل حالياً على تطوير تجربة FileReady لتكون أفضل.",
    descriptionEn: "We're working on something better for you.",
  },
};
