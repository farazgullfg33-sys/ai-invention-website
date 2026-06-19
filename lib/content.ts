const defaultSettings = [
  {
    key: "contact",
    value: {
      email: "hello@aiinvention.tech",
      address: "Malaysia",
      linkedin: "https://www.linkedin.com/in/muhammad-faraz-433a73146/",
    },
  },
  {
    key: "brand",
    value: {
      name: "AI Invention",
      domain: "aiinvention.tech",
      primaryCta: "Get Started",
    },
  },
];

export async function getSettingsMap() {
  return Object.fromEntries(defaultSettings.map((setting) => [setting.key, setting.value]));
}
