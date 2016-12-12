import React from 'react';
import { connect } from 'react-redux';
import { any, equals } from 'ramda';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';

import { getActionsFromModel } from '../util';
import * as model from '../model';
import Home from '../view/Home';
const { bool, func, array, string } = React.PropTypes;

const style = {
  topRight: { horizontal: 'right', vertical: 'top' }
};

const App = ({
  isAdmin, isLoggedIn, logout, searchMode, searchTextChanged, searchResults, canEdit, updateSearchMode
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
    <Home
      {...{ isAdmin, canEdit, searchResults, searchMode, updateSearchMode }}
      searchTextChanged={e => searchTextChanged(e.target.value)}
    />
  </div>
);
App.propTypes = {
  isAdmin: bool,
  isLoggedIn: bool,
  canEdit: func,
  searchMode: string,
  logout: func,
  searchTextChanged: func,
  updateSearchMode: func,
  searchResults: array
};

export default connect(({ user, searchResults, searchMode }) => ({
  isLoggedIn: !!user,
  canEdit: any(equals((user || {}).username)),
  isAdmin: user && user.group === 'Faculity',
  searchResults,
  searchMode
}), getActionsFromModel(model))(App);
