import React, { memo } from 'react';
import { IPluginPanelProps, PluginOptionsMissing, PluginCard } from '@kobsio/plugin-core';

import HelloWorld from './HelloWorld';
import { IPanelOptions } from '../../utils/interfaces';

interface IPanelProps extends IPluginPanelProps {
  options?: IPanelOptions;
}

// The Panel component implements the panel component for the teams plugin. The plugin doesn't require any options,
// because it can only be used to display all teams from all clusters and namespaces.
export const Panel: React.FunctionComponent<IPanelProps> = ({ title, description, options }: IPanelProps) => {
  if (!options || !options.name) {
    return (
      <PluginOptionsMissing
        title={title}
        message="Options for Hello World panel are missing or invalid"
        details="The panel doesn't contain the required options to get hello world or the provided options are invalid."
        documentation="https://kobs.io/"
      />
    );
  }

  return (
    <PluginCard title={title} description={description}>
      <HelloWorld name={options.name} />
    </PluginCard>
  );
};

export default memo(Panel, (prevProps, nextProps) => {
  if (prevProps.title === nextProps.title && prevProps.description === nextProps.description) {
    return true;
  }

  return false;
});
