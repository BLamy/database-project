import React from 'react';
import styled from 'styled-components';
import { values } from 'ramda';
import Button from 'antd/lib/button';
import Paper from 'material-ui/Paper';
import Input from 'antd/lib/input';
import Select, { Option } from 'antd/lib/select';
import { paper, user } from '../model/types';

const { func, arrayOf } = React.PropTypes;

const SimpleSelect = styled(Select)`
  width: 80px;
`;
const EditButton = styled(Button)`
  float: right;
  margin-left: 10px;
  position: relative;
  bottom: 25px;
`;
const ListItem = styled.li`
  border-bottom: 1px solid #c1c1c1;
`

/**
 * List Results for a faculty search
 */
const FacultyResults = ({ searchResults }) => (
  <ul>
    {searchResults.map(({ id, fName, lName, email }) =>
      <ListItem key={id}>{fName} {lName} ({email})</ListItem>
    )}
  </ul>
);
FacultyResults.propTypes = {
  searchResults: arrayOf(user)
};

/**
 * List Results for a papers search
 */
const PapersResults = ({ searchResults, canEdit, setActivePaper }) => (
  <ul>
    {searchResults.map(({ id, title, citation, abstract, authors=[] }) =>
      <ListItem key={id}>
        <h1>{title}</h1>by:&nbsp;{authors.join(', ')}
        <EditButton onClick={() => setActivePaper(id, title, citation, abstract, authors)}>View</EditButton>
        {canEdit(authors) &&
          <EditButton onClick={() => setActivePaper(id, title, citation, abstract, authors, true)}>Edit</EditButton>
        }
      </ListItem>
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
const SearchForm = ({ searchTextChanged, canEdit, searchResults, searchMode, updateSearchMode, setActivePaper }) => (
  <div>
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
        <PapersResults canEdit={canEdit} setActivePaper={setActivePaper} searchResults={searchResults} />
    }
  </div>
);

export default SearchForm;
