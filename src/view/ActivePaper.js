import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import styled from 'styled-components';
import Modal from 'antd/lib/modal';
import AddPaperForm from './AddPaperForm';

const Wrapper = styled(Paper)`
  width: 80%;
  max-width: 500px;
  position: absolute;
  top: 33%;
  z-index: 9001;
  left: 50%;
  transform: translate(-50%, -50%);
`;
const PaddedDiv = styled.div`
  padding: 20px;
`;

const ActivePaper = ({ handleSubmit, visible, id, title, abstract, citation, authors, clearActivePaper, isEditing }) => (
  <Modal title={title} visible={visible} onOk={clearActivePaper} onCancel={clearActivePaper} okText="Done" cancelText="Cancel">
      {isEditing ?
        <AddPaperForm />:
        <PaddedDiv>
          <p>By: {authors.join(',')}</p>
          <p>{abstract}</p>
          <p>{citation}</p>
        </PaddedDiv>
      }
  </Modal>
);
ActivePaper.propTypes = {
  handleSubmit: React.PropTypes.func
};

export default ActivePaper;
