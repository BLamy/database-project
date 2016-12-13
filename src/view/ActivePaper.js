import React from 'react';
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import styled from 'styled-components';
import Modal from 'antd/lib/modal';

const Wrapper = styled(Paper)`
  width: 80%;
  max-width: 500px;
  position: absolute;
  top: 33%;
  z-index: 9001;
  left: 50%;
  transform: translate(-50%, -50%);
`;

// const Model = styled.div`
//   background-color: rgba(0, 0, 0, .3);
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   z-index: 9000;
//   top: 0;
// `;
const PaddedDiv = styled.div`
  padding: 20px;
`;
const AppBar = styled.div`
  width: 100%;
  height: 64px;
  background-color: rgb(243, 110, 33);
  color: white;
  font-size: 24px;
  line-height: 64px;
  padding-left: 20px;
`;

const ActivePaper = ({ handleSubmit, visible, id, title, abstract, citation, authors, clearActivePaper }) => (
  <Modal title={title} visible={visible} onOk={clearActivePaper} onCancel={clearActivePaper} okText="Done" cancelText="Cancel">
      <PaddedDiv>
        <p>By: {authors.join(',')}</p>
        <p>{abstract}</p>
        <p>{citation}</p>
      </PaddedDiv>
  </Modal>
);
ActivePaper.propTypes = {
  handleSubmit: React.PropTypes.func
};

export default ActivePaper;
