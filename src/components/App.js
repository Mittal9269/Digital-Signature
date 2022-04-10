import DStorage from '../abis/DStorage.json'
import React from 'react';
import {  useState,useLayoutEffect } from 'react';
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
  const [fileHashObject , setFileHashObject] = useState({})



  useLayoutEffect( async () => {
    if (cookies.jwttoken) {}
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
        try{
          fileHashObject[file.fileHash] = file.uploader;
          setFileHashObject({...fileHashObject})
          tempStoreofFile.push(file)
        }
        catch{
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


  const CreatLastPagePDF = () =>{
    const doc = new jsPDF();
    doc.setFontSize(40)
    doc.text(35, 25, 'Signed with DAPP')
    const arraybuffer = doc.output("arraybuffer", "multiPng.pdf");
    return arraybuffer;
  }

  const MergePDF = async (pdf1 , pdf2) => {
    try{
      const cover1 = await PDFDocument.load(pdf1);
      const cover2 = await PDFDocument.load(pdf2);

      const doc =  await PDFDocument.create();

      const contentPage1 = await doc.copyPages(cover1 , cover1.getPageIndices());
        for(let page of contentPage1){
          doc.addPage(page);
        }

        const contentPage2 = await doc.copyPages(cover2 , cover2.getPageIndices());
        for(let page of contentPage2){
          doc.addPage(page);
        }

        const pdfBytes = await doc.save();

        const buf = Buffer.from(pdfBytes, 'base64');
        return buf;
    }
    catch{
        console.log("Error occured\n"); 
    }

  }


  

  //Upload File
  const uploadFile = (description, pageNumbers) => {
    console.log("submitting to IPFS.....")
    //Add file to the IPFS
    MergePDF(buffer , CreatLastPagePDF())
    .then(newBuff => {
      ipfs.add(newBuff , (error, result) => {
        console.log('IPFS result', result)
  
        if (error) {
          console.error(error)
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
    .catch(err => console.log(err))
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