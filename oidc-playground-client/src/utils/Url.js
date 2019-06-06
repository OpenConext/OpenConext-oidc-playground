import { isEmpty } from "utils/Utils";

export function getRedirectParams() {
  const url = new URL(window.location);

  if (url.pathname === "/redirect") {
    const searchParams = !isEmpty(url.hash) ? new URLSearchParams(url.hash.replace("#", "?")) : url.searchParams;

    return {
      access_token: searchParams.get("access_token"),
      id_token: searchParams.get("id_token"),
      code: searchParams.get("code"),
      error: searchParams.get("error"),
      error_description: searchParams.get("error_description")
    };
  }

  return false;
}
