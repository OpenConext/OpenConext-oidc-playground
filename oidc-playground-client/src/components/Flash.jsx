import React from "react";
import { observer } from "mobx-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import store from "store";
import "./Flash.scss";

const reset = () => (store.message = undefined);

export const Flash = observer(() => {
  setTimeout(reset, 8000);

  return (
    <div className={store.message ? "flash active" : "flash"}>
      <p>{store.message}</p>
      <button className="close" onClick={reset}>
        <FontAwesomeIcon icon="times-circle" />
      </button>
    </div>
  );
});
