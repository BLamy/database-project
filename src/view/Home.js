import React from 'react';
import { any, equals } from 'ramda';
import styled from 'styled-components';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import { papers } from '../model/types';

const { bool, func, arrayOf, string } = React.PropTypes;

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

const Home = ({ isAdmin, searchTextChanged, searchResults, username }) => (
  <Grid>
    <PaddedPaper>
      <TextField fullWidth floatingLabelText="Search Query" onChange={searchTextChanged} />
      <ul>
        {searchResults.map(({ title, authors }, i) =>
          <li key={i}>
            {title}&nbsp;by:&nbsp;{authors.join(', ')}
            {any(equals(username), authors) && <FlatButton>Edit</FlatButton>}
          </li>
        )}
      </ul>
    </PaddedPaper>
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
  searchResults: arrayOf(papers)
};

export default Home;
