import React from "react";
import {InfoLabel} from "./InfoLabel";
import {observer} from "mobx-react";
import {apiT} from "./settings/Tooltips";
import store from "store";

export const API = observer(props => {
    const accessToken = store.normalFlowAccessToken || store.hybridFlowAccessToken || store.clientCredentialsAccessToken ||
        ((store.request || {}).result || {}).access_token;
    const disabled = !accessToken || !props.form.apiUrl;
    return (<form className="block" onSubmit={props.onApiSubmit}>
        <fieldset>
            <InfoLabel label="API endpoint" toolTip={apiT()}/>
            <input value={props.form.apiUrl || ""} onChange={e => props.onChange("apiUrl", e.target.value)}/>
        </fieldset>

        <fieldset>
            <button type="submit"
                    className={`button ${!disabled ? "blue" : ""}`}
                    disabled={disabled}>
                Submit
            </button>
        </fieldset>
    </form>);
});
