import store from "../store";

export function getTokensFrontChannel(options) {

  const bodyOptions = {
    client_id: options.remote_client_id,
    redirect_uri: options.redirect_uri,
    code_verifier: options.code_verifier,
    scope: options.scope.join(" "),
    code: options.code,
    response_type: options.response_type,
    code_challenge_method: options.code_challenge_method,
    grant_type: options.grant_type
  };

  const body = new URLSearchParams(bodyOptions);

  const fetchOptions = {
    method: "POST",
    body: body,
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };

  const start = Date.now();
  const tokenEndpoint = options.token_endpoint;

  return fetch(tokenEndpoint, fetchOptions).then(res => res.json())
    .then(json => {
      store.processingTime = Date.now() - start;
      return Promise.resolve({
        result: json,
        request_body: bodyOptions,
        request_url: tokenEndpoint,
        request_headers: fetchOptions.headers
      });
    });
}
