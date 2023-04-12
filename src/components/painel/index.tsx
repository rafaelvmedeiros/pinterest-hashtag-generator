import React from "react";
import { useTranslation } from "react-i18next";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import View from "../view";
import countries from "../../config/country";
import "./style.css";

import Autocomplete from "@material-ui/lab/Autocomplete";

export default function Painel() {
  const { t } = useTranslation();
  const [terms, setTerms] = React.useState({
    hashtag: t("default_hashtag"),
    country: ""
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
      [event.target.name]: event.target.value.toLowerCase()
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

    const selectedCountry = event.target.value;

    if (!selectedCountry) {
      return;
    }

    if (selectedCountry.toLowerCase() === selectedCountry) {
      return;
    }

    const abreviation = countryList.find(
      (c) => c.country.toLowerCase() === selectedCountry.toLowerCase()
    ) as any;

    if (Object.keys(abreviation).length) {
      setSelectedCountry(selectedCountry);

      setTerms({
        ...terms,
        country: abreviation.code
      });
    }
  }

  async function searchFormTerms(event: any) {
    event.preventDefault();

    setIsLoading(true);

    fetch("https://api.vackao.com/v1/api/hashtags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        country: terms.country,
        hash: terms.hashtag
      })
    })
      .then((response) => response.json())
      .then((response) => {
        if (response?.data && response.data.includes("Delete")) {
          const dataReplaced = response.data.replace(/<[^>]+>/g, "");
          const [, data] = dataReplaced.split("Delete");
          setHashList(data.trim());
        }

        setIsLoading(false);
      })
      .catch(() => {
        alert("");
        setIsLoading(false);
      });
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

          <TextField
            id="country"
            name="country"
            label={t("country_input")}
            onChange={onChangeCountry}
            variant="outlined"
            style={{ width: 300, paddingBottom: 20 }}
          />

          {Array.isArray(countryFiltered) && countryFiltered.length ? (
            <Autocomplete
              options={countryFiltered}
              style={{ width: 300, paddingBottom: 20 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("country_list_input")}
                  value={selectedCountry}
                  id="countryList"
                  name="countryList"
                  onSelect={onSelecteCountry}
                  variant="outlined"
                />
              )}
            />
          ) : null}

          <Button
            variant="outlined"
            id="findHashtagsButton"
            onClick={(event) => searchFormTerms(event)}
          >
            {t("button_search_title")}
          </Button>

          {hashList && <View hashList={hashList} hash={terms.hashtag}></View>}
        </div>
      )}
    </>
  );
}
