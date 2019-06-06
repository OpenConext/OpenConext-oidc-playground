import React from "react";
import {observer} from "mobx-react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import store from "store";
import "./Flash.scss";

export const Flash = observer(() =>
  <div className={store.message ? "flash active" : "flash"}>
    <p>{store.message}</p>
    <button className="close" onClick={() => store.message = undefined}>
      <FontAwesomeIcon icon="times-circle"/>
    </button>
  </div>
);
