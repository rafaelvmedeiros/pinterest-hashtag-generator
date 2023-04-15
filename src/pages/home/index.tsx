import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import Painel from "../../components/painel";
import languages from "../../config/languages";

import "./styles.css";

export default function Home() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    function setLanguage() {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const language = params.get("language");

      if (language) {
        const founded = languages.find((p) => p.language === language);
        if (founded) i18n.changeLanguage(founded.value);
      } else {
        i18n.changeLanguage("en");
      }
    }

    setLanguage();
  }, [i18n]);

  return (
    <div className="Container">
      <h1>{t("app_title")}</h1>
      <h5>{t("app_subtitle")}</h5>
      <Painel></Painel>
    </div>
  );
}
