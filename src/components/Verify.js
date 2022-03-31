import React, {useState} from 'react';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


export default function Verify(props){

    
    const [type, setType] = useState(null);
    const [name, setName] = useState(null);
    const [buffer, setBuffer] = useState(null);
    const [des , setDes] = useState('');

    const captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()

        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result))
            setType(file.type)
            setName(file.name)
            console.log('buffer', buffer)
        }
    }

    //Upload File
    const uploadFile = description => {
        console.log("happy holi");
        ipfs.add(buffer, (error, result) => {
            console.log('IPFS result', result)

            if (error) {
                console.error(error)
                return
            }

            if(props.files){
            for (let i = 0; i < props.files.length; i++) {
                if (props.files[i].fileHash === result[0].hash && props.files[i].uploader === description) {
                    if (!alert('Successfully verfied, no temper')) { window.location.reload(); }
                }
            }
            if (!alert('Successfully verfied, temper')) { window.location.reload(); }
        }else{
            if (!alert('Something is wrong')) { window.location.reload(); }
        }

        })
    }

    return (
        <>
            <div className="container-fluid mt-5 text-center">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px' }}>
                        <div className="content">
                            <p>&nbsp;</p>

                            <div className="card mb-3 mx-auto bg-dark" style={{ maxWidth: '512px' }}>
                                <h2 className="text-white text monospace bg-dark"><b><ins>Verify File</ins></b></h2>
                                <form onSubmit={(event) => {
                                    event.preventDefault()
                                    {console.log(des)}
                                    uploadFile(des)
                                }} >
                                    <div className="form-group">
                                        <br></br>
                                        <input
                                            id="fileDescription"
                                            type="text"
                                            onChange={(event) => { setDes(event.target.value) }}
                                            className="form-control text-monospace"
                                            placeholder='Adress of the given person'
                                            required />
                                    </div>
                                    <input type="file" onChange={captureFile} className="text-white text-monospace" required />
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
        </>
    )
}



// export default Verify;