import { useRef } from "react";
import Button from "@material-ui/core/Button";
import { useTranslation } from "react-i18next";

import "./style.css";

export default function View(props: any) {
  const textAreaRef: any = useRef();
  const { t } = useTranslation();

  function copyToClipboard(event: any) {
    event.preventDefault();

    textAreaRef.current.select();
    document.execCommand("copy");
    event.target.focus();
  }

  return (
    <>
      <h1>
        {t("view_title")} {props.hash}
      </h1>
      <textarea ref={textAreaRef} defaultValue={props.hashList}></textarea>

      <Button
        variant="outlined"
        id="copyHashtagsButton"
        onClick={(event) => copyToClipboard(event)}
      >
        {t("view_button_copy")}
      </Button>
    </>
  );
}
