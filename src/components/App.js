import DStorage from '../abis/DStorage.json'
import React from 'react';
import { useState, useLayoutEffect } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import Verify from "./Verify";
import jsPDF from "jspdf";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { useCookies } from 'react-cookie';
import { Navigate, NavLink } from 'react-router-dom';


const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

export default function App() {
  const [account, setAccount] = useState('');
  const [dstorage, setDstorage] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const [name, setName] = useState(null);
  const [fileCount, setFilecount] = useState(0);
  const [buffer, setBuffer] = useState(null);
  const [cookies] = useCookies(['user']);
  const [redirect, setRedirect] = useState(false);
  const [fileHashObject, setFileHashObject] = useState({})



  useLayoutEffect(async () => {
    if (cookies.jwttoken) { }
    else { setRedirect(true); }
    await loadWEb3();
    await loadBlockChainData();

  }, [])


  const loadWEb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  }

  const loadBlockChainData = async () => {
    const web3 = window.web3

    //Load account
    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0]);
    //Network ID 
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if (networkData) {
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      setDstorage(dstorage);
      const filesCount = await dstorage.methods.fileCount().call()
      setFilecount(filesCount);

      let tempStoreofFile = [];
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        try {
          fileHashObject[file.fileHash] = file.uploader;
          setFileHashObject({ ...fileHashObject })
          tempStoreofFile.push(file)
        }
        catch {
          console.log("error occured");
        }
      }
      setFiles(tempStoreofFile)
    } else {
      window.alert('DStorage contract not deployed to detect network.')
    }
    setLoading(false)
  }



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




  const ModifyPDF = async (pdf, description) => {
    try {
      const pdfDoc = await PDFDocument.load(pdf)

      // Embed the Helvetica font
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)

      // Get the first page of the document

      let Newdescription = description.trim()
      var nameArr = Newdescription.split(',')
      const pages = pdfDoc.getPages()
      const d = {};
      const time = new Date();
      const userName = localStorage.getItem('Name') ? JSON.parse(localStorage.getItem('Name')) : 'Dapp User';

      const InsertString =  `Signed by  ${userName} using DApp \n on ${time.toDateString()} ${time.toLocaleTimeString()}`;

      nameArr.forEach((element) => {
        const index = parseInt(element);
        if (index !== null && index>= 1 && index <= pages.length && !(index in d)) {
          d[index-1] = 1;
          let firstPage = pages[index-1];
          // const { width, height } = firstPage.getSize()
          firstPage.drawText(InsertString, {
            x: 25,
            y: 50,
            size: 25,
            font: helveticaFont,
            color: rgb(0.1, 0.1, 0.1),
            opacity: 0.9
          })
        }
        else {
          if (!alert('Invalid input please write page numbers with comma separated  only')) { window.location.reload(); }
        }

      });

      // Get the width and height of the first page

      // Draw a string of text diagonally across the first page


      // Serialize the PDFDocument to bytes (a Uint8Array)
      const pdfBytes = await pdfDoc.save()



      const buf = Buffer.from(pdfBytes, 'base64');
      return buf;
    }
    catch {
      console.log("Error occured\n");
    }



  }




  //Upload File
  const uploadFile = (description, pageNumbers) => {
    console.log("submitting to IPFS.....")
    //Add file to the IPFS
    ModifyPDF(buffer , pageNumbers)
      .then(newBuff => {
        ipfs.add(newBuff, (error, result) => {
          console.log('IPFS result', result)

          if (error) {
            if (!alert('Please Upload a PDF file')) { window.location.reload(); }
            return
          }

          setLoading(true)

          if (type === '') {
            setType('none')
          }




          dstorage.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: account }).on('transactionHash', (hash) => {
            setLoading(false)
            setType(null)
            setName(null)

            let bytes = new Uint8Array(newBuff); // pass your byte response to this constructor

            var blob = new Blob([bytes], { type: "application/pdf" });
            var url = URL.createObjectURL(blob);
            window.open(url, "_blank");



            window.location.reload()

          }).on('error', (e) => {
            window.alert('Error')
            console.log(e)
            setLoading(false)
          })

        })
      })
      .catch(err =>{
        if (!alert('Internal Error please try again!')) { window.location.reload(); }
      })
    //Check If error
    //Return error

    //Set state to loading

    //Assign value for the file without extension

    //Call smart contract uploadFile function 

  }


  return (
    <>
      {redirect && <Navigate to="/" />}
      <div>
        <Navbar account={account} />
        {loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <>
            <NavLink
              exact
              activeClassName="menu_active"
              className="btn btn-danger"
              to="/logout"
            >
              Logout
            </NavLink>
            <Main
              files={files}
              captureFile={captureFile}
              uploadFile={uploadFile}
            />
            <Verify
              files={files}
              HashObject={fileHashObject}
            />
          </>
        }
      </div>
    </>
  )
}

// export default App;