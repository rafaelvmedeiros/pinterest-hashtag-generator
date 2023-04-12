import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import enUs from "./locales/en-us";
import ptBR from "./locales/pt-br";

const resources = {
  en: enUs,
  br: ptBR
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    lng: "en-us",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
