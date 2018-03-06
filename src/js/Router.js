const baseUrl = window.BASE_URL;

const routes = [
  {
    match: /^\/?$/,
    page: 'HomePage'
  },
  {
    match: /^\/search-result\/?$/,
    page: 'ExplorePage'
  },
  {
    match: /^\/category\/[A-z0-9-]+\/?$/,
    page: 'IssuePage'
  },
  // Should be last
  {
    match: /^\/[A-z0-9-]+\/?$/,
    page: 'PostPage'
  }
];

export default class Router {
  /**
   * Return the route matching the current URL
   * @returns {{ match: RegExp, class: typeof HomePage }}
   */
  static getMatchingRoute() {
    return routes.find(r => r.match.test(location.pathname.slice(baseUrl.length)));
  }

  /**
   * Instantiate the page component corresponding
   * to the current URL
   */
  static executeRoute() {
    const matchingRoute = Router.getMatchingRoute();
    if (matchingRoute) {
      import(/* webpackChunkName: "pages" */ `pages/${matchingRoute.page}.js`)
        // eslint-disable-next-line new-cap
        .then(page => new page.default(matchingRoute, { baseUrl }));
    }
  }

  constructor() {
    Router.executeRoute();
  }
}
