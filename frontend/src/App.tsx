import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import ResultsPage from './pages/ResultsPage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const lobbyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LobbyPage,
});

const gameRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/game',
  component: GamePage,
  beforeLoad: ({ location }) => {
    const params = new URLSearchParams(location.search);
    const p1 = params.get('p1');
    const p2 = params.get('p2');
    if (!p1 || !p2) {
      throw redirect({ to: '/' });
    }
  },
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
  beforeLoad: ({ location }) => {
    const params = new URLSearchParams(location.search);
    const p1 = params.get('p1');
    const p2 = params.get('p2');
    if (!p1 || !p2) {
      throw redirect({ to: '/' });
    }
  },
});

const routeTree = rootRoute.addChildren([lobbyRoute, gameRoute, resultsRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
