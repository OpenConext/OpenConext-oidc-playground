import store from "../store";

export function apiCall({apiUrl, accessToken}) {
  const fetchOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`
    }
  };

  const start = Date.now();

  return fetch(apiUrl, fetchOptions).then(res => {
    store.processingTime = Date.now() - start;

    return res.text().then(text => {
      let body;
      try {
        body = text ? JSON.parse(text) : text;
      } catch {
        body = text;
      }

      if (!res.ok) {
        return Promise.reject({status: res.status, error: res.statusText, message: body});
      }

      return {
        result: body,
        request_url: apiUrl,
        request_headers: {...fetchOptions.headers, Authorization: "XXX"}
      };
    });
  });
}
