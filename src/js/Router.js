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
        .then((page) => {
          // We save the visited page
          Router.pushPage({
            page: matchingRoute.page,
            url: window.location.href
          });

          // eslint-disable-next-line new-cap, no-new
          new page.default(matchingRoute, { baseUrl }, Router);
        });
    }
  }

  /**
   * Return the page history
   * NOTE: the array is in reverse order i.e. the most recent item
   * it the first one
   * @returns {{ page: string, url: string }[]}
   */
  static getPageHistory() {
    return JSON.parse(sessionStorage.getItem('history')) || [];
  }

  /**
   * Save a page in sessionStorage to maintain the history
   * @param {{ page: string, url: string }} page
   * @returns {{ page: string, url: string }[]}
   */
  static pushPage(page) {
    const history = Router.getPageHistory();
    history.unshift(page);
    sessionStorage.setItem('history', JSON.stringify(history));
    return history;
  }

  constructor() {
    Router.executeRoute();
  }
}
