import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations
import enTranslation from '../locales/en.json';

// Initialize i18n
i18n
  .use(initReactI18next) // Passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation, // Translation file for English
      },
      // You can add more languages like this:
      // fr: { translation: frTranslation },
    },
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation not found

    interpolation: {
      escapeValue: false, // React already handles XSS protection
    },

    // Optional: Additional config
    // debug: true, // Enable for development
    // keySeparator: false, // Uncomment if keys are not nested
  });

export default i18n;
