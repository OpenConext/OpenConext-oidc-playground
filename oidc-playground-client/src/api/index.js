import { isEmpty } from "../utils/Utils";
import store from "../store";
//Internal API
function validateResponse(res) {

  if (!res.ok) {
    if (res.type === "opaqueredirect") {
      setTimeout(() => window.location.reload(), 100);
      return res;
    }
    throw res;
  }

  return res.json();
}

function validFetch(path, options) {
  const fetchOptions = {
    ...options,
    credentials: "same-origin",
    redirect: "manual",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  const start = Date.now();
  return fetch(path, fetchOptions).then(res => {
    //store.processingTime = start - Date.now();
    validateResponse(res);
  });
}

function fetchJson(path, options = {}) {
  return validFetch(path, options);
}

function postPutJson(path, body, method) {
  return fetchJson(path, { method, body: JSON.stringify(body) });
}

//Base
export function discovery() {
  return fetchJson("/oidc/api/discovery");
}

export function formPost(body) {
  return postPutJson(`/oidc/api/${body.grant_type}`, body, "POST");
}

export function postIntrospect(body) {
  return postPutJson(`/oidc/api/introspect`, body, "POST");
}

export function postUserinfo(body) {
  return postPutJson(`/oidc/api/userinfo`, body, "POST");
}

export function postRefreshToken(body) {
  return postPutJson(`/oidc/api/refresh_token`, body, "POST");
}

export function decodeJWT(jwt) {
  return fetchJson(`/oidc/api/decode_jwt?jwt=${jwt}`);
}

export function getTokens(body) {
  return postPutJson(`/oidc/api/token`, body, "POST");
}

export function generateCodeChallenge(codeChallengeMethod) {
  return postPutJson(
    "/oidc/api/code_challenge",
    { codeChallengeMethod: isEmpty(codeChallengeMethod) ? undefined : codeChallengeMethod },
    "POST"
  );
}

export function reportError(error) {
  return postPutJson("/oidc/api/error", error, "POST");
}
