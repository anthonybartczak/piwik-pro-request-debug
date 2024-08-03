import { ParsedQueryString } from "./models";

type BrokenEvent = "Broken Event";
type PingType =
  | "HeartBeat"
  | "Deanonymization"
  | "Page performance metric"
  | "Custom"
  | BrokenEvent;
type EventType =
  | "Goal Conversion"
  | "Ping"
  | "Download"
  | "Outlink"
  | "Consent form impression"
  | "Consent form click"
  | "Consent decision"
  | "SharePoint"
  | "Custom event"
  | "Content interaction"
  | "Content impression"
  | "Cart update"
  | "Product detail view"
  | "Add to cart"
  | "Remove from cart"
  | "Order completed"
  | "Internal search"
  | "Page view"
  | PingType
  | BrokenEvent;
/**
 * https://help.piwik.pro/support/questions/what-are-events-and-how-are-they-detected/
 */
export function getEventType(eventParams: ParsedQueryString[]): EventType {
  if (isGoalConversion(eventParams)) return "Goal Conversion";

  if (isPing(eventParams)) return getPingType(eventParams);

  if (isDownload(eventParams)) return "Download";

  if (isOutlink(eventParams)) return "Outlink";

  if (isConsentFormImpression(eventParams)) return "Consent form impression";

  if (isConsentFormClick(eventParams)) return "Consent form click";

  if (isConsentDecision(eventParams)) return "Consent decision";

  if (isSharePoint(eventParams)) return "SharePoint";

  if (isCustomEvent(eventParams)) return "Custom event";

  if (isContentInteraction(eventParams)) return "Content interaction";

  if (isContentImpression(eventParams)) return "Content impression";

  if (isCartUpdate(eventParams)) return "Cart update";

  if (isProductDetailView(eventParams)) return "Product detail view";

  if (isAddToCart(eventParams)) return "Add to cart";

  if (isRemoveFromCart(eventParams)) return "Remove from cart";

  if (isOrderCompleted(eventParams)) return "Order completed";

  if (isInternalSearch(eventParams)) return "Internal search";

  return "Page view";
}

function isGoalConversion(eventParams: ParsedQueryString[]) {
  const idgoal = eventParams.find((p) => p.name === "idgoal");
  return idgoal?.value && idgoal.value !== "0";
}

function isPing(eventParams: ParsedQueryString[]) {
  return eventParams.some((p) => p.name === "ping");
}
function getPingType(eventParams: ParsedQueryString[]): PingType {
  const param = eventParams.find((p) => p.name === "ping");
  if (!param) return "Broken Event";

  const pingLevel = Number.parseInt(param.value);

  if (pingLevel === 1 || pingLevel === 2 || pingLevel === 3) return "HeartBeat";

  if (pingLevel === 4) return "Deanonymization";

  if (pingLevel === 5) return "Page performance metric";

  if (pingLevel === 6) return "Custom";

  return "Broken Event";
}

function isDownload(eventParams: ParsedQueryString[]) {
  return eventParams.some((p) => p.name === "download");
}

function isOutlink(eventParams: ParsedQueryString[]) {
  return eventParams.some((p) => p.name === "link");
}

function isConsentFormImpression(eventParams: ParsedQueryString[]) {
  const category = eventParams.find((p) => p.name === "e_c");
  return category?.value === "consent_form_impression";
}

function isConsentFormClick(eventParams: ParsedQueryString[]) {
  const category = eventParams.find((p) => p.name === "e_c");
  return category?.value === "consent_form_click";
}

function isConsentDecision(eventParams: ParsedQueryString[]) {
  const category = eventParams.find((p) => p.name === "e_c");
  return category?.value === "consent_decision";
}

function isSharePoint(eventParams: ParsedQueryString[]) {
  const eventCustomVariables = eventParams.find((p) => p.name === "cvar");
  const sessionCustomVariables = eventParams.find((p) => p.name === "_cvar");
  const category = eventParams.find((p) => p.name === "e_c");

  const parsedEventCustomVariables =
    eventCustomVariables &&
    JSON.parse(decodeURIComponent(eventCustomVariables.value));
  const parsedSessionCustomVariables =
    sessionCustomVariables &&
    JSON.parse(decodeURIComponent(sessionCustomVariables.value));

  return (
    (parsedEventCustomVariables?.["1"]?.[0] === "ppas.sharepoint.plugin" ||
      parsedSessionCustomVariables?.["1"]?.[0] === "ppas.sharepoint.plugin") &&
    (category?.value === "download" || category?.value === "search")
  );
}

function isCustomEvent(eventParams: ParsedQueryString[]) {
  const category = eventParams.some((p) => p.name === "e_c");
  const action = eventParams.some((p) => p.name === "e_a");
  return category && action;
}

function isContentInteraction(eventParams: ParsedQueryString[]) {
  const interaction = eventParams.some((p) => p.name === "c_i");
  const name = eventParams.some((p) => p.name === "c_n");
  return interaction && name;
}

function isContentImpression(eventParams: ParsedQueryString[]) {
  return eventParams.some((p) => p.name === "c_n");
}

function isCartUpdate(eventParams: ParsedQueryString[]) {
  const idGoal = eventParams.find((p) => p.name === "idgoal");
  const ecIdPresent = eventParams.some((p) => p.name === "ec_id");
  const eventType = eventParams.find((p) => p.name === "e_t");

  return (
    (idGoal?.value === "0" && !ecIdPresent) ||
    eventType?.value === "cart-update"
  );
}

function isProductDetailView(eventParams: ParsedQueryString[]) {
  return (
    eventParams.find((p) => p.name === "e_t")?.value === "product-detail-view"
  );
}

function isAddToCart(eventParams: ParsedQueryString[]) {
  return eventParams.find((p) => p.name === "e_t")?.value === "add-to-cart";
}

function isRemoveFromCart(eventParams: ParsedQueryString[]) {
  return (
    eventParams.find((p) => p.name === "e_t")?.value === "remove-from-cart"
  );
}

function isOrderCompleted(eventParams: ParsedQueryString[]) {
  const idGoal = eventParams.find((p) => p.name === "idgoal");
  const ecIdPresent = eventParams.some((p) => p.name === "ec_id");
  const eventType = eventParams.find((p) => p.name === "e_t");

  return (idGoal?.value === "0" && ecIdPresent) || eventType?.value === "order";
}

function isInternalSearch(eventParams: ParsedQueryString[]) {
  return eventParams.some((p) => p.name === "search");
}
