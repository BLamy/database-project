import React from 'react';
import { connect } from 'react-redux';
import { any, equals } from 'ramda';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';
import IconMenu from 'material-ui/IconMenu';

import { getActionsFromModel } from '../util';
import * as searchModel from '../model/search';
import * as papersModel from '../model/papers';
import * as userModel from '../model/user';
import Home from '../view/Home';
const { bool, func, array, string } = React.PropTypes;

const style = {
  topRight: { horizontal: 'right', vertical: 'top' }
};

const App = ({
  isAdmin, isLoggedIn, isGuest, logout, searchMode, searchTextChanged, searchResults,
  canEdit, updateSearchMode, attemptLogin, username, addPaper, setActivePaper, activePaper, clearActivePaper
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
      {...{
        isAdmin, isGuest, canEdit, searchResults, searchMode, updateSearchMode,
        attemptLogin, username, addPaper, setActivePaper, activePaper, clearActivePaper
      }}
      searchTextChanged={e => searchTextChanged(e.target.value)}
    />
  </div>
);
App.propTypes = {
  username: string,
  isAdmin: bool,
  searchMode: string,
  searchResults: array,
  canEdit: func,
  attemptLogin: func,
  logout: func,
  addPaper: func,
  searchTextChanged: func,
  updateSearchMode: func,
};

export default connect(({ search, user, paper }) => ({
  activePaper: paper,
  username: user.name,
  isAdmin: user.isAdmin,
  canEdit: any(equals((user || {}).name)),
  searchResults: search.results,
  searchMode: search.mode
}), {
  ...getActionsFromModel(searchModel),
  ...getActionsFromModel(userModel),
  ...getActionsFromModel(papersModel)
})(App);
