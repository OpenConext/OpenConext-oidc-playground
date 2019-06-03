import { isEmpty } from "utils/Utils";

export function getParams() {
  const url = new URL(window.location);

  if (url.pathname === "/redirect") {
    return !isEmpty(url.hash)
      ? new URLSearchParams(url.hash.replace("#", "?"))
      : url.searchParams;
  }
}
