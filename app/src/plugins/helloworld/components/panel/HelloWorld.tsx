import React from 'react';

interface IHelloWorldProps {
  name: string;
}

const HelloWorld: React.FunctionComponent<IHelloWorldProps> = ({ name }: IHelloWorldProps) => {
  return <div>Hello {name}</div>
};

export default HelloWorld;
