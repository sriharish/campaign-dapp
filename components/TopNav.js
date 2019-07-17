import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

const TopNav = (props) => {
    return (
    <Menu>
        <Link route="/">
            <a className="item">Standard Wei</a>
        </Link>

        <Menu.Menu position="right">
            <Link route="/">
                <a className="item">Campaigns</a>
            </Link>

            <Link route="/campaigns/new">
                <a className="item">+</a>
            </Link>
        </Menu.Menu>
      </Menu>
    );
};

export default TopNav;