## ``` Digital Signature Software R&D ```


**R&D II**

**Digital Signature Software**

**Outline:**

- About the software
- Our Approach in building the software
- Technologies used
- Frontend and Backend description in detail
- Future versions and improvements to be done in the future
- Problems faced
- Learnings from the project
- Resources and references


### **How we reached here:**
In the last semester, we finally ended up with a blockchain solution with multiple servers. In order to achieve that, we had a special server that maintains the queue and there was a communication protocol between the servers to decide which signature is valid. This is essentially equivalent to creating a blockchain network. In order to implement these complicated steps, we used the open-source wallet, The Metamask wallet is used for storing the ETH coins and making our DApp workable even on the normal browsers. And our DAPP works on the Ethereum network. Most of the DApps are built on Ethereum, hence, instead of creating our own protocols and networks, we used the most popular and reliable one. Now, in order to use Ethereum based applications, we needed to enable the browser to accept DApps. For that, we used Metamask. We then used the Truffle framework to facilitate migration, deployment of our written smart contracts onto the local blockchain environment which is provided by Ganache. It was extensively used for testing.  

It gave us all the tools that we needed to start working on our application.

### **About the software:**
The software we're working on will allow a user to digitally sign and verify a document's authenticity. In our current version, a single user can sign a document at multiple pages. Note that the verification of those signatures would not be accepted partially since it violates the integrity of the document. (For example, suppose a person signs on 4 pages of a 10 page document. So, if that pdf is split and then the verification for only a part of those pages is asked, then our software won’t accept such a signature).

![](https://www.linkpicture.com/q/Registration-in-Blockchain-muti.png)

![](https://www.linkpicture.com/q/Verification_Software.jpeg)


### **Tools and Technologies Used:**
- Frontend:
1. HTML
1. CSS
1. React.js ( Frontend framework)
1. Bootstrap (framework)

- Backend:
1. Solidity (for writing Smart Contract)
1. Truffle Suite (for deploying, migrating smart contracts onto the blockchain)
1. Chai ( testing framework)
1. Ganache (local blockchain network provider)

- Miscellaneous:
1. Google API (for google login)
1. MetaMask (for web3.0 browser )
1. IPFS (for file storing in the blockchain)
###
### **What did we do:**
Our steps: Divided the process into 3 stages:

1) **Registration**: We are using google authentication so that only the email ids with iitdh.ac.in domain could access our DApp application. Then, we need to connect to a blockchain network. For that, browser configuration is required since the default browser operates on web2.0 which doesn't operate on blockchain as it operates on web3.0. Hence, we use the popular and widely used metamask extension that allows us to interact with the Ethereum Blockchain network.

1) **Signing**: The clients are asked to provide the file with the page numbers where they want to sign the document. The .pdf is the only acceptable document format as of now. We attach a text sign at the end of all the mentioned pages asked by the client. We use the hash of this signed document as the unique identifier for this doc file. This hash is stored in the mapping corresponding to his address in the blockchain. The client is able to download the signed document. 

1) **Verification**: The client is asked to provide the signed document which he/she needs to verify, along with the public address of the signee. The hash of this document is generated by sending it to the IPFS. As hashes are always unique so this hash present in the provided user's file signed mapping data structure in the blockchain, clearly indicates that the person had signed the document and not tempered it in any form. Using the property of uniqueness and collision free mapping of hashing, we are successfully able to verify the signed documents. 

### **Description of Application from client side :-** 
1. First client must have iitdh mail id in order to use this application.
1. After the client has registered himself/herself with the iitdh mail id, he/she will be redirected to the main page of the application.
1. Now the client can either sign or verify the PDF document.
1. To sign the desired PDF document, the client needs to fill the form with a file and its  suitable description..
1. After submitting the form, the Metamak will ask for the confirmation of the transaction, once it is confirmed the signed file will be downloaded in the local storage of the client and this signed document will be stored in the blockchain of the local running blockchain.
1. To verify the signed signature client has to submit the document with the hash address(public address) of the client who signed the given document. After submitting our webApp will show the result whether the signed document was tempered or not. 


### **Description of the Frontend part of the application from the Developer's POV :-**
1. The react-google-login npm package is used to check the authenticity of the user.
1. After successful login, the user is redirected to the */app*** route where the main functionalities are available. 
1. All the functionalities are created through function based components in ReactJS.
1. In the above given route, feature of document signing and verification is available for the client. 
1. To sign the desired document, the description of signing pages and the file input will be taken from the user in the Sign Document form.
1. After submitting the above form the request will go from client side to 

IPFS to get the hash of the file uploaded. After getting the successful response from IPFS,  the hash, description, user address, file name, file size and creation time are sent from Client side to Smart contract. After getting all the fields successfully, the smart contract will emit a function to save the data in the local blockchain (Ganache).

1. To confirm the transaction,  the client needs to pay the gas fee to add your data to the blockchain. After confirmation of the transaction, our data will be saved to the blockchain.
1. After successfully saving the transaction, a new window will pop-up and the signed document will be downloaded to the system of the client by the link generated for the file. The application will let the user  successfully sign the desired document with the success alert  message and then can reload the page to remove the input text added to it. 
1. To verify the signed document the application will take the hash address(public address) of the user who signed the document as the input for the confidentiality purpose and the signed file itself.

After getting the hash, this hash will be checked in the Dstorage(our blockchain) with the user address. If this hash is present in a single transaction then the signature is verified and the document is not tempered else it is tempered and the signature is not verified.

### **Description of the Backend part of the application from the Developer's POV :-**
1. Our Smart contract is written in solidity 0.8.1 version. 
1. Truffle is then used to migrate the contract files.
1. Chai is used for testing of the data and contract functions before deploying to the blockchain.
1. The uploadFile function of *Dstorage.sol* contract file is called when a client submits the request for signing a document. 
1. The FileUploaded event is emitted simultaneously on successful uploading.
1. With the truffle migration, the contract will be converted to the json format in ABI file which is used to interact with the frontend of the application.
1. The smart contract handles all kinds of requests and completes it according to the rules set and throws errors if required.
 

**Our hypothesis**: Attach the signature and then remove it to compare the hash.
*Theoretically possible, Practically Impossible*
**Reason**: Adding and removing changes metadata of the file
**Solution**: Implementation for a single signature pdf
Practical reasons to support this: Most documents are signed by only one person. Rarely do we need documents to be signed by multiple people. So implementation is done case by case. In our version 1, we have done single signature documents.

In order for more than one person to sign the same document, we can create the specific cases in future versions.

### **Future versions of the software:**
The current version has the minimalist UI design and styling as it was our least priority at the moment. The top most priority being the fully functional working of the software as intended. 

Our main focus would be on the following:

- Currently we have a basic text sign, for signing any document. We would roll out other options as well to sign a document in our future versions like - Uploading sign image, Drawing the sign. We are attaching the sign at the end of all the pages that a user has requested to sign at, but this could be improved further if we try to use the Shape detection Neural Network model for detecting the rectangles or empty lines where the sign actually needs to be placed. This would be the most realistic document signing features that would make the software more usable. However, it might make our DAPP a bit slower. One other method is to directly use the *ArrayBuffer data type* of javascript to directly manipulate the pdf. But there were not any resources on how to work with this data type. It could be because of security reasons. The libraries which allowed the placing the signature at pin point location *(pdf.js)* were paid. So, it still remains one of the big challenges for us.

- We would allow multiple clients to sign on a single document in our future version where the verification would take place by restoring all the versions of the signed document from the 1st person to sign it till the current version. The blockchain file storage based version control would be required for it. We can also think of some other solutions if they are effective and useful for us in solving this problem of ours.

- Lastly, we would like to improve the UI (user interface) so that it is more user friendly and pleasing to our valuable clients. 

### **Learnings from the project:**
- We spent our first month demystifying the working and implementation of **blockchain** and **web3.0** tech.
- ` `Learning the solidity language which is widely used for writing Smart contracts for the **ethereum** built DApps. 
- Turning our normal browser into a Web3 browser by connecting it to the Metamask wallet.
- Inter Planetary File System (IPFS) and storing our data on it in a distributed file system.
- Making transactions with ETH Coins for the payment of gas fee.
- Truffle Suite for migrating, deploying the smart contract onto the blockchain.
- Testing all of our Dapp functionalities with the Chai framework.
- Styling the client side interface with ReactJS and Bootstrap frontend framework.
- Smartly Googling the solutions for the found bugs and errors midway.
### **Resources and References:**

- [PDF-LIB](https://pdf-lib.js.org/)
- [PDF.js](https://pdfjs.express/?utm_source=google&utm_medium=cpc&utm_campaign=main-express&utm_content=broad&utm_term=pdf.js&gclid=CjwKCAjwo8-SBhAlEiwAopc9W-dH-oRsqfDy8h5twuLemXQPb_TMleyCk51d0ekgzXkZyCLfnzvbrhoCbcMQAvD_BwE)
- [PDFTron SDK](https://www.pdftron.com/webviewer/?utm_source=google&utm_medium=cpc&utm_campaign=PDFTron_Google_Search_Branded_2021&utm_content=language_pdftron_javascript&utm_term=pdftron%20javascript&gclid=CjwKCAjwo8-SBhAlEiwAopc9W-RQubmmvjxnW9fm4va1rqY5rFSreBzskrJexrLgRHYAjoyB3xBxmxoCwOgQAvD_BwE)
- [pdf-merger-js](https://www.npmjs.com/package/pdf-merger-js)
- [node-signpdf](https://www.npmjs.com/package/node-signpdf)
- [Dapp University Youtube Channel](https://www.youtube.com/c/DappUniversity)
- [IPFS](https://ipfs.io/)
- [CryptoZombies](https://cryptozombies.io/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.13/)






