import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowDown, faQuestion, faChevronRight, faTimesCircle, faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

export function addIcons() {
  library.add(faArrowDown, faQuestion, faChevronRight, faTimesCircle, faCheck, faCopy);
}
