import {
  observer
}
from "mobx-react";
import React from 'react';
import Dropzone from 'react-dropzone';
import RaisedButton from 'material-ui/RaisedButton';

const ImportExpenses = observer(({
  onFileAccepted,
  onFileDelete,
  onFileUpload,
  filesAccepted
}) => {
  return (
    <div>
      <Dropzone onDrop={((acceptedFiles,rejectedFiles)=>onFileAccepted(acceptedFiles))}>
        <div>Try dropping some files here, or click to select files to upload.</div>
      </Dropzone>
      <RaisedButton onClick={onFileUpload} label="Import Files" primary={true}/>
      <div>Files Accepted:
        <ul>
          {
            filesAccepted.map(file =>{
              return <li>{file.name}<RaisedButton label="Delete" secondary={true} onClick={()=>{onFileDelete(file)}} /></li>
            }
          )
        }
      </ul>
    </div>
  </div>
);
});

export default ImportExpenses;
