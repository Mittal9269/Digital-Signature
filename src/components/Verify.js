import React, { Component } from 'react';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class Verify extends Component {

    captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()

        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            this.setState({
                buffer: Buffer(reader.result),
                type: file.type,
                name: file.name
            })
            console.log('buffer', this.state.buffer)
        }
    }

    //Upload File
    uploadFile = description => {
        console.log("happy holi");
        ipfs.add(this.state.buffer, (error, result) => {
            console.log('IPFS result', result)

            if (error) {
                console.error(error)
                return
            }

            if(this.props.files){
            for (let i = 0; i < this.props.files.length; i++) {
                if (this.props.files[i].fileHash === result[0].hash && this.props.files[i].uploader === description) {
                    if (!alert('Successfully verfied, no temper')) { window.location.reload(); }
                }
            }
            if (!alert('Successfully verfied, temper')) { window.location.reload(); }
        }else{
            if (!alert('Something is wrong')) { window.location.reload(); }
        }

        })
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            type: null,
            name: null
        }
    }

    render() {
        return (
            <div className="container-fluid mt-5 text-center">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
                        <div className="content">
                            <p>&nbsp;</p>

                            <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
                                <h2 className="text-white text monospace bg-dark"><b><ins>Verify File</ins></b></h2>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    const description = this.fileDescription.value
                                    this.uploadFile(description)
                                }} >
                                    <div className="form-group">
                                        <br></br>
                                        <input
                                            id="fileDescription"
                                            type="text"
                                            ref={(input) => { this.fileDescription = input }}
                                            className="form-control text-monospace"
                                            placeholder='Adress of the given person'
                                            required />
                                    </div>
                                    <input type="file" onChange={this.captureFile} className="text-white text-monospace" required />
                                    <button type="submit" className='btn-primary btn-block'>
                                        <b>Verify!</b>
                                    </button>
                                </form>
                            </div>

                            <p>&nbsp;</p>

                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default Verify;