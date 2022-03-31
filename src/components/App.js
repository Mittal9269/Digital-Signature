import DStorage from '../abis/DStorage.json'
import React, {  useState,useLayoutEffect } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import Verify from "./Verify";

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

  useLayoutEffect( async () => {
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
    // this.setState({ account: accounts[0] })
    setAccount(accounts[0]);
    //Network ID 
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    if (networkData) {
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      // this.setState({ dstorage })
      setDstorage(dstorage);
      const filesCount = await dstorage.methods.fileCount().call()
      // this.setState({ filesCount })
      console.log(fileCount)
      setFilecount(filesCount);

      let tempStoreofFile = [];
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        tempStoreofFile.push(file)
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

  //Upload File
  const uploadFile = description => {
    console.log("submitting to IPFS.....")
    //Add file to the IPFS
    ipfs.add(buffer, (error, result) => {
      console.log('IPFS result', result)

      if (error) {
        console.error(error)
        return
      }

      setLoading(true)

      if (type === '') {
        setType('none')
      }
      
      // console.log(buffer)
      dstorage.methods.uploadFile(result[0].hash, result[0].size, type, name, description).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
        setType(null)
        setName(null)
      // this.setState({ filesCount })
        console.log(fileCount)
        window.location.reload()
        // console.log(hash)
      }).on('error', (e) => {
        window.alert('Error')
        console.log(e)
        setLoading(false)
      })

    })
    //Check If error
    //Return error

    //Set state to loading

    //Assign value for the file without extension

    //Call smart contract uploadFile function 

  }

  return (
    <>
      <div>
        <Navbar account={account} />
        {loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <>
            <Main
              files={files}
              captureFile={captureFile}
              uploadFile={uploadFile}
            />
            <Verify
              files={files}
            />
          </>
        }
      </div>
    </>
  )
}

// export default App;