import React from 'react';
import { connect } from 'react-redux';

import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';

import { preventDefaultThen, getActionsFromModel } from '../util';
import * as model from '../model';
import Login from '../view/Login';
import Home from '../view/Home';
const { bool, func, array, string } = React.PropTypes;

const style = {
  topRight: { horizontal: 'right', vertical: 'top' }
};

const App = ({
  store, isAdmin, isLoggedIn, logout, searchTextChanged, searchResults, username
}) => (
  <div>
    <AppBar
      title="RIT Research Catalog"
      iconElementLeft={<IconButton />}
      iconElementRight={
        <IconMenu
          iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
          targetOrigin={style.topRight}
          anchorOrigin={style.topRight}
        >
          <MenuItem primaryText="Sign out" onTouchTap={logout} />
        </IconMenu>
      }
    />
    {isLoggedIn ?
      <Home
        isAdmin={isAdmin}
        username={username}
        searchTextChanged={e => searchTextChanged(e.target.value)}
        searchResults={searchResults}
      />
      :
      <Login
        store={store}
        handleSubmit={preventDefaultThen(console.log.bind(console))}
      />
    }
  </div>
);
App.propTypes = {
  isAdmin: bool,
  isLoggedIn: bool,
  username: string,
  logout: func,
  searchTextChanged: func,
  searchResults: array
};

export default connect(({ user, searchResults }) => ({
  isLoggedIn: !!user,
  username: (user || {}).username,
  isAdmin: user && user.group === 'Faculity',
  searchResults
}), getActionsFromModel(model))(App);
