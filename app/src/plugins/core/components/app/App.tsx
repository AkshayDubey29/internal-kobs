import { Brand, Page, PageHeader } from '@patternfly/react-core';
import { Link, Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import React from 'react';

import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';

import { IPluginComponents, PluginsContextProvider } from '../../context/PluginsContext';
import { AuthContextProvider } from '../../context/AuthContext';
import { ClustersContextProvider } from '../../context/ClustersContext';
import Home from './Home';
import { PluginPage } from '../plugin/PluginPage';
import { TerminalsContextProvider } from '../../context/TerminalsContext';

import logo from '../../assets/logo.png';

import '../../assets/app.css';

// Create a global queryClient, which is used for react-query.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity,
    },
  },
});

export interface IAppProps {
  plugins: IPluginComponents;
}

// App is used to set all routes for the react-router and the header for all pages. The header only contains the kobs
// logo. We only need two routes: One for the home components, which renders a list of all registered plugin instances
// and a second one for the plugin pages, which renders the page component for the corresponding plugin type.
export const App: React.FunctionComponent<IAppProps> = ({ plugins }: IAppProps) => {
  const Header = <PageHeader logoComponent={Link} logoProps={{ to: '/' }} logo={<Brand src="https://cdn.corporate.walmart.com/dims4/WMT/c2bbbe9/2147483647/strip/true/crop/2389x930+0+0/resize/1446x563!/quality/90/?url=https%3A%2F%2Fcdn.corporate.walmart.com%2Fd6%2Fe7%2F48e91bac4a8ca8f22985b3682370%2Fwalmart-logos-lockupwtag-horiz-blu-rgb.png" alt="kobs" />} />;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ClustersContextProvider>
          <PluginsContextProvider components={plugins}>
            <TerminalsContextProvider>
              <Router>
                <Page header={Header}>
                  <Switch>
                    <Route exact={true} path="/" component={Home} />
                    <Route exact={false} path="/:name" component={PluginPage} />
                  </Switch>
                </Page>
              </Router>
            </TerminalsContextProvider>
          </PluginsContextProvider>
        </ClustersContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};
