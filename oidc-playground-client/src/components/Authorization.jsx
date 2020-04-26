import React from "react";
import {InfoLabel} from "./InfoLabel";
import {clientIdT, clientSecretT} from "./settings/Tooltips";

export const Authorization = props => (
    <form className="block" onSubmit={props.onSubmit}>
        <fieldset>
            <InfoLabel label="Client ID" toolTip={clientIdT()}/>
            <input value={props.form.client_id} onChange={e => props.onChange("client_id", e.target.value)}/>
        </fieldset>

        <fieldset>
            <InfoLabel label="Client secret" toolTip={clientSecretT()}/>
            <input value={props.form.client_secret} onChange={e => props.onChange("client_secret", e.target.value)}/>
        </fieldset>

        <fieldset>
            <button type="submit" className={`button blue`}>
                Submit
            </button>
        </fieldset>
    </form>
);
