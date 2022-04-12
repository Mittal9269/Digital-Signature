import React, { useState } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'

export default function Main(props){

  const [des , setDes] = useState('');
  const [pages , Setpages] = useState('');

  const changeValue = (e) => {  setDes(e.target.value) }
  const changeValueForpages = (e) => {  Setpages(e.target.value) }

  return (
    <>
      <div className="container-fluid mt-5 text-center">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
            <div className="content">
              <p>&nbsp;</p>

              <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
                <h2 className="text-white text monospace bg-dark"><b><ins>Share File</ins></b></h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = des
                  props.uploadFile(description , pages)
                }} >
                  <div className="form-group">
                    <br></br>
                    <input
                      id="fileDescription"
                      type="text"
                      onChange={changeValue}
                      className="form-control text-monospace"
                      placeholder='Description...'
                      required />
                  </div>
                  <div className="form-group">
                    <br></br>
                    <input
                      id="fileDescription"
                      type="text"
                      onChange={changeValueForpages}
                      className="form-control text-monospace"
                      placeholder='page numbers with comma separated only'
                      required />
                  </div>
                  <input type="file" onChange={props.captureFile} className="text-white text-monospace" required />
                  <button type="submit" className='btn-primary btn-block'>
                    <b>Upload!</b>
                  </button>
                </form>
              </div>

              <p>&nbsp;</p>

              {/* Create Table*/}
              <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px' }}>
                <thead style={{ 'fontSize': '15px' }}>
                  <tr className='bg-dark text-white'>
                    <th scope='col' style={{ width: '10px' }}>id</th>
                    <th scope='col' style={{ width: '200px' }}>name</th>
                    <th scope='col' style={{ width: '230px' }}>description</th>
                    <th scope='col' style={{ width: '120px' }}>type</th>
                    <th scope='col' style={{ width: '90px' }}>size</th>
                    <th scope='col' style={{ width: '90px' }}>date</th>
                    <th scope='col' style={{ width: '120px' }}>uploader/view</th>
                    <th scope='col' style={{ width: '120px' }}>hash/view/get</th>
                  </tr>
                </thead>
                {props.files && props.files.length && props.files.map((file, key) => {
                  return (
                    <thead style={{ 'fontSize': "12px" }} key={key}>
                      <tr>
                        <td>{file.fileId}</td>
                        <td>{file.fileName}</td>
                        <td>{file.fileDescription}</td>
                        <td>{file.fileType}</td>
                        <td>{convertBytes(file.fileSize)}</td>
                        <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                        <td>
                          <a
                            href={"https://etherscan.io/address/" + file.uploader}
                            rel="noopener noreferrer"
                            target='_blank'>
                            {file.uploader.substring(0, 10)}...
                          </a>
                        </td>
                        <td>
                          <a
                            href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                            rel="noopener noreferrer"
                            target='_blank'>
                            {file.fileHash.substring(0, 10)}...
                          </a>
                        </td>
                      </tr>
                    </thead>
                  )
                })}
              </table>
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
