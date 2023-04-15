import React from "react";
import { useTranslation } from "react-i18next";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import View from "../view";
import countries from "../../config/country";
import "./style.css";

import Autocomplete from "@mui/material/Autocomplete";

export default function Painel() {
  const { t } = useTranslation();
  const [terms, setTerms] = React.useState({
    hashtag: t("default_hashtag"),
    country: "",
  });

  const [countryList] = React.useState(countries);
  const [countryFiltered, setCountryFiltered] = React.useState([] as string[]);
  const [selectedCountry, setSelectedCountry] = React.useState("");
  const [hashList, setHashList] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  function onChangeTerms(event: any) {
    event.preventDefault();

    setTerms({
      ...terms,
      [event.target.name]: event.target.value.toLowerCase(),
    });
  }

  function onChangeCountry(event: any) {
    event.preventDefault();

    const inputCountry = event.target.value;

    if (!inputCountry) {
      return;
    }

    if (inputCountry.length <= 2) {
      return;
    }

    const filteredCountries = countryList
      .filter((c) => {
        return c.country.toLowerCase().includes(inputCountry.toLowerCase());
      })
      .reduce((newItem, currentItem) => {
        return newItem.concat(currentItem.country);
      }, [] as string[]);

    setCountryFiltered(filteredCountries);
  }

  function onSelecteCountry(event: any) {
    event.preventDefault();

    const selectedCountryTarget = event.target.value;

    if (!selectedCountryTarget) {
      return;
    }

    if (selectedCountryTarget.length <= 2) {
      return;
    }

    if (selectedCountry.toLowerCase() === selectedCountryTarget.toLowerCase()) {
      return;
    }

    const abreviation = countryList.find((c) =>
      c.country.toLowerCase().includes(selectedCountryTarget.toLowerCase())
    ) as any;

    if (Object.keys(abreviation).length) {
      setSelectedCountry(selectedCountryTarget);

      setTerms({
        ...terms,
        country: abreviation.code,
      });
    }
  }

  async function searchFormTerms(event: any) {
    event.preventDefault();

    setIsLoading(true);

    const result = await fetch("https://api.vackao.com/v1/api/hashtags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        country: terms.country,
        hash: terms.hashtag,
      }),
    })
      .then((response) => response.json())
      .catch(() => {
        alert(t("error_api"));
        setIsLoading(false);
      });

    if (result?.data && result.data.includes("Delete")) {
      const dataReplaced = result.data.replace(/<[^>]+>/g, "");
      const [, data] = dataReplaced.split("Delete");
      setHashList(data.trim());
    }

    setIsLoading(false);
  }

  return (
    <>
      {isLoading ? (
        <div>{t("loading_message")}</div>
      ) : (
        <div className="container">
          <TextField
            id="hashtag"
            name="hashtag"
            label={t("hashtag_input")}
            value={terms.hashtag}
            onChange={onChangeTerms}
            variant="outlined"
            style={{ width: 300, paddingBottom: 20 }}
          />

          <Autocomplete
            options={countryFiltered}
            style={{ width: 300, paddingBottom: 20 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("country_list_input")}
                value={selectedCountry}
                onChange={onChangeCountry}
                id="country"
                name="country"
                onSelect={onSelecteCountry}
                variant="outlined"
              />
            )}
          />

          <Button
            variant="outlined"
            id="findHashtagsButton"
            onClick={(event: any) => searchFormTerms(event)}
          >
            {t("button_search_title")}
          </Button>

          {hashList && <View hashList={hashList} hash={terms.hashtag}></View>}
        </div>
      )}
    </>
  );
}
