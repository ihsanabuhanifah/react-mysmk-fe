import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';

const ButtonLink = ({ title, logo, to }) => {
  return (
    <Link to={to} className="w-full">
      <Button
        content={title}
        icon={logo}
        fluid
        size="small"
        className="mb-2"
      />
    </Link>
  );
};

export default ButtonLink;
