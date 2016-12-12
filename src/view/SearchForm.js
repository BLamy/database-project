import React from 'react';
import styled from 'styled-components';

import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import Input from 'antd/lib/input';
import Select, { Option } from 'antd/lib/select';
import { paper, user } from '../model/types';

const { func, arrayOf } = React.PropTypes;

const SimpleSelect = styled(Select)`
  width: 80px;
`;

const PaddedPaper = styled(Paper)`
  padding: 20px;
  width: 50%;
  height: 100%;
  margin: 10px;
`;

/**
 * List Results for a faculty search
 */
const FacultyResults = ({ searchResults }) => (
  <ul>
    {searchResults.map(({ id, fName, lName, email }) =>
      <li key={id}>{fName} {lName} ({email})</li>
    )}
  </ul>
);
FacultyResults.propTypes = {
  searchResults: arrayOf(user)
};

/**
 * List Results for a papers search
 */
const PapersResults = ({ searchResults, canEdit }) => (
  <ul>
    {searchResults.map(({ title, authors }, i) =>
      <li key={i}>
        {title}&nbsp;by:&nbsp;{authors.join(', ')}
        {canEdit(authors) && <FlatButton>Edit</FlatButton>}
      </li>
    )}
  </ul>
);
PapersResults.propTypes = {
  searchResults: arrayOf(paper),
  canEdit: func // takes an array of author names and checks if they can edit.
};

/**
 * Search Component
 */
const Search = ({ searchTextChanged, canEdit, searchResults, searchMode, updateSearchMode }) => (
  <PaddedPaper>
    <Input
      placeholder="Search Query"
      onChange={searchTextChanged}
      addonBefore={
        <SimpleSelect defaultValue={searchMode} onChange={updateSearchMode}>
          <Option value="papers">Papers</Option>
          <Option value="faculty">Faculty</Option>
        </SimpleSelect>
      }
    />
    {
      searchMode === 'faculty' ?
        <FacultyResults searchResults={searchResults} /> :
        <PapersResults canEdit={canEdit} searchResults={searchResults} />
    }
  </PaddedPaper>
);

export default Search;
