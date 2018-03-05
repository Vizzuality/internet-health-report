// Pages
import HomePage from 'pages/HomePage';
import ExplorePage from 'pages/ExplorePage';
import IssuePage from 'pages/IssuePage';
import PostPage from 'pages/PostPage';

const baseUrl = window.BASE_URL;

const routes = [
  {
    match: /^\/?$/,
    class: HomePage
  },
  {
    match: /^\/search-result\/?$/,
    class: ExplorePage
  },
  {
    match: /^\/category\/[A-z0-9-]+\/?$/,
    class: IssuePage
  },
  // Should be last
  {
    match: /^\/[A-z0-9-]+\/?$/,
    class: PostPage
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
      // eslint-disable-next-line no-new, new-cap
      new matchingRoute.class(matchingRoute, { baseUrl });
    }
  }

  constructor() {
    Router.executeRoute();
  }
}
