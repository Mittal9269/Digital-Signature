import React, {useState} from 'react';
import { PDFDocument } from 'pdf-lib';

// 919934576820-b77pvk0cqk5u9jj7rnd3lhdr06ls7o59.apps.googleusercontent.com

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })


export default function Verify(props){


    const [buffer, setBuffer] = useState(null);
    const [des , setDes] = useState('');



    const MergePDF = async (pdf1) => {
        try{
          const cover1 = await PDFDocument.load(pdf1);
          const doc =  await PDFDocument.create();
    
          const contentPage1 = await doc.copyPages(cover1 , cover1.getPageIndices());
          let length = contentPage1.length;
          let index = 0;
            for(let page of contentPage1){
                if(index !== length - 1){
                    doc.addPage(page); 
                }
              index++;
            }
            const pdfBytes = await doc.save();
    
            // let bytes = new Uint8Array(pdfBytes); // pass your byte response to this constructor
    
            // var blob = new Blob([bytes], { type: "application/pdf" });
            // var url = URL.createObjectURL(blob);
            // window.open(url, "_blank"); 
            console.log(buffer);
            console.log(pdfBytes);
            const buf = Buffer.from(pdfBytes, 'base64');
            // console.log(buf);
            return buf;
        }
        catch{
            console.log("Error occured\n"); 
        }
    
      }
    


    const captureFile = event => {
        event.preventDefault()
        const file = event.target.files[0]
        const reader = new window.FileReader()

        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
            setBuffer(Buffer(reader.result))
            console.log('buffer', buffer)
        }
    }

    //Upload File
    const uploadFile = description => {

        MergePDF(buffer).then(newBuffer =>{
            ipfs.add(newBuffer, (error, result) => {
                console.log('IPFS result', result)
    
                if (error) {
                    console.error(error)
                    return
                }
    
                if(props.files){
                for (let i = 0; i < props.files.length; i++) {
                    if (props.files[i].fileHash === result[0].hash && props.files[i].uploader === description) {
                        if (!alert('The file has been Successfully verfied, Result : No temper/modification in the file')) { window.location.reload(); }
                    }
                }
                if (!alert('The file has been Successfully verfied, Result : The file has been tempered/modified')) { window.location.reload(); }
            }else{
                if (!alert('Something is wrong!!')) { window.location.reload(); }
            }
    
            })
        })
        .catch(err => console.log(err))
        
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