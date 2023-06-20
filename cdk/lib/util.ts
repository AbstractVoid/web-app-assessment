/**
 * Intercept viewer requests
 * Remove .html from the uri and redirect
 * Remove the / at the end and redirect
 * For the home page, always ensure we rewrite to /index.html
 * For the other pages, add .html to the end
 */
export const inlineHandleNextRoutes = `
function handler(event) {
  var request = event.request;
  var host = request.headers.host.value;
  var redirectUri = undefined;
  if (!request.uri) {
    return request;
  }
  if (request.uri.includes(".html")) {
    redirectUri = "https://" + host + request.uri.replace(".html", "");
  }
  if (request.uri.length > 1 && request.uri.endsWith("/")) {
    redirectUri = "https://" + host + request.uri.slice(0, -1);
  }
  // Redirect if we have a redirect uri set
  if (redirectUri) {
    var response = {
      statusCode: 302,
      statusDescription: "Found",
      headers: { location: { value: redirectUri } },
    };
    return response;
  }
  if (request.uri.length <= 1) {
    request.uri = request.uri.replace("/", "") + "/index.html";
  }
  if (
    request.uri.length > 1 &&
    request.uri.includes("/") &&
    !request.uri.includes(".")
  ) {
    request.uri += ".html";
  }
  return request;
}
`
