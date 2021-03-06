import {
  Alert,
  AlertActionLink,
  AlertVariant,
  PageSection,
  PageSectionVariants,
  Spinner,
  Title,
} from '@patternfly/react-core';
import { QueryObserverResult, useQuery } from 'react-query';
import { IPluginPageProps } from '@kobsio/plugin-core';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { IHelloWorld } from '../../utils/interfaces';
import HelloWorld from '../panel/HelloWorld';

const Page: React.FunctionComponent<IPluginPageProps> = ({ name, displayName, description }: IPluginPageProps) => {
  const history = useHistory();

  const { isError, isLoading, error, data, refetch } = useQuery<IHelloWorld, Error>(['helloworld/helloworld', name], async () => {
    try {
      const response = await fetch(`/api/plugins/${name}/name`, { method: 'get' });
      const json = await response.json();

      if (response.status >= 200 && response.status < 300) {
        return json;
      } else {
        if (json.error) {
          throw new Error(json.error);
        } else {
          throw new Error('An unknown error occured');
        }
      }
    } catch (err) {
      throw err;
    }
  });

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h6" size="xl">
          {displayName}
        </Title>
        <p>{description}</p>
      </PageSection>

      <PageSection style={{ height: '100%', minHeight: '100%' }} variant={PageSectionVariants.default}>
        {isLoading ? (
          <div className="pf-u-text-align-center">
            <Spinner />
          </div>
        ) : isError ? (
          <Alert
            variant={AlertVariant.danger}
            title="Could not get teams"
            actionLinks={
              <React.Fragment>
                <AlertActionLink onClick={(): void => history.push('/')}>Home</AlertActionLink>
                <AlertActionLink onClick={(): Promise<QueryObserverResult<IHelloWorld, Error>> => refetch()}>
                  Retry
                </AlertActionLink>
              </React.Fragment>
            }
          >
            <p>{error?.message}</p>
          </Alert>
        ) : data ?
            <HelloWorld name={data.name} /> : null}
      </PageSection>
    </React.Fragment>
  );
};

export default Page;
