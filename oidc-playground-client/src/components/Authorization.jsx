import React from "react";

export const Authorization = props => (
  <form className="block" onSubmit={props.onSubmit}>
    <fieldset>
      <label>Client ID</label>
      <input value={props.form.client_id} onChange={e => props.onChange("client_id", e.target.value)} />
    </fieldset>

    <fieldset>
      <label>Client secret</label>
      <input value={props.form.client_secret} onChange={e => props.onChange("client_secret", e.target.value)} />
    </fieldset>

    <fieldset>
      <button type="submit" className="button blue">
        Submit
      </button>
    </fieldset>
  </form>
);
