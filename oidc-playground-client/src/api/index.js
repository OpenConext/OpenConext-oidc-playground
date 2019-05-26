import spinner from "utils/Spin";

//Internal API
function validateResponse(showErrorDialog) {
  return res => {
    spinner.stop();

    if (!res.ok) {
      if (res.type === "opaqueredirect") {
        setTimeout(() => window.location.reload(), 100);
        return res;
      }
      const error = new Error(res.statusText);
      error.response = res;

      if (showErrorDialog) {
        setTimeout(() => {
          throw error;
        }, 250);
      }
      throw error;
    }

    return res;
  };
}

function validFetch(path, options, headers = {}, showErrorDialog = true) {
  const contentHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...headers
  };
  const fetchOptions = Object.assign({}, { headers: contentHeaders }, options, {
    credentials: "same-origin",
    redirect: "manual"
  });
  spinner.start();

  return fetch(path, fetchOptions)
    .then(validateResponse(showErrorDialog))
    .catch(err => {
      spinner.stop();
      throw err;
    });
}

function fetchJson(path, options = {}, headers = {}, showErrorDialog = true) {
  return validFetch(path, options, headers, showErrorDialog).then(res =>
    res.json()
  );
}

function postPutJson(path, body, method) {
  return fetchJson(path, { method: method, body: JSON.stringify(body) });
}

//Base
export function discovery() {
  return fetchJson("/oidc/api/discovery");
}

export function formPost() {
  const body = arguments[0];
  return postPutJson(`/oidc/api/${body.grant_type}`, body, "POST");
}

export function decodeJWT(jwt) {
  return fetchJson(`/oidc/api/decode_jwt?jwt=${jwt}`)
}

export function reportError(error) {
  return postPutJson("/oidc/api/error", error, "post");
}
