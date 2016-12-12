import React from 'react';
import styled from 'styled-components';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import SearchForm from './SearchForm';
const { bool, func, string, array } = React.PropTypes;

const Grid = styled.div`
  padding: 20px;
  height: 100%;
  display: flex;
`;

const PaddedPaper = styled(Paper)`
  padding: 20px;
  width: 50%;
  height: 100%;
  margin: 10px;
`;

const Home = ({ isAdmin, canEdit, searchTextChanged, searchResults, searchMode, updateSearchMode }) => (
  <Grid>
    <SearchForm {...{ canEdit, searchTextChanged, searchResults, searchMode, updateSearchMode }} />
    {isAdmin &&
      <PaddedPaper>
        <TextField fullWidth floatingLabelText="Paper Title" />
        <TextField fullWidth floatingLabelText="Abstract" />
        <TextField fullWidth floatingLabelText="Citation" />
        <RaisedButton label="Submit" />
      </PaddedPaper>
    }
  </Grid>
);
Home.propTypes = {
  isAdmin: bool,
  searchTextChanged: func,
  username: string,
  searchMode: string,
  updateSearchMode: func,
  searchResults: array
};

export default Home;
