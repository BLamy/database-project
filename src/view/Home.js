import React from 'react';
import styled from 'styled-components';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SearchForm from './SearchForm';
import AddPaperForm from './AddPaperForm';
import Login from './Login';
const { bool, func, string, array } = React.PropTypes;

const Grid = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
`;
const PaddedPaper = styled(Paper)`
  padding: 20px;
  height: 100%;
  margin: 10px;
`;

const Left = styled(PaddedPaper)`
  flex: 2;
`;
const Right = styled(PaddedPaper)`
  flex: 1;
`;

const Home = ({
  isAdmin, username, isGuest, canEdit, searchTextChanged, searchResults,
  searchMode, updateSearchMode, attemptLogin, addPaper
}) => (
  <Grid>
    <Left>
      <SearchForm {...{ canEdit, searchTextChanged, searchResults, searchMode, updateSearchMode }} />
    </Left>
    <Right>
      {username ?
        <h1>Hello {username}</h1> :
        <Login handleSubmit={({ username, password }) => attemptLogin(username, password)} />
      }
      {isAdmin && <AddPaperForm handleSubmit={({ title, citation, abstract }) => addPaper(title, citation, abstract)}/> }
    </Right>
  </Grid>
);
Home.propTypes = {
  isGuest: bool,
  isAdmin: bool,
  username: string,
  searchTextChanged: func,
  username: string,
  attemptLogin: func,
  searchMode: string,
  updateSearchMode: func,
  addPaper: func,
  searchResults: array
};

export default Home;
