// Send visitors of the old production address to the custom domain, keeping the path and query.
// Preview deployments (<hash>.maciej-zielinski-portfolio.pages.dev) are left alone.
const OLD_HOST = "maciej-zielinski-portfolio.pages.dev";
const NEW_ORIGIN = "https://maciejzielinski.dev";

export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.hostname === OLD_HOST || url.hostname === "www.maciejzielinski.dev") {
    return Response.redirect(NEW_ORIGIN + url.pathname + url.search, 301);
  }
  return context.next();
}
