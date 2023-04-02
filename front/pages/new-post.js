const ContractKit = require('@celo/contractkit');
const contractAddress = '0xED3F33dD0401831955abFc828E6dBF09F400C54A'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

import Web3Modal from 'web3modal';

export default function NewPost() {  
    const handleNewPostClick = async (title, description, tags) => {
        event.preventDefault();

        const web3Modal = new Web3Modal({
          network: "celo", // Use the Celo Alfajores testnet
          cacheProvider: true,
        });
        
        console.log("web3Modal"); 
        console.log(web3Modal); // Check if the web3Modal object is initialized
        
        const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org'); // Use the URL of the Celo Alfajores testnet
        
        web3Modal.connect()
          .then((provider) => {
            console.log("provider"); 
            console.log(provider); // Print the provider object
    
            kit.web3.eth.setProvider(provider);
    
            const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);        
    
            const account = provider.selectedAddress;
    
            console.log(account);    
            
            contract.methods.newPost(title, description, tags).send({ from: account, gas: 3000000 });
    
          })
          .catch((error) => {
            console.error("error");
            console.error(error); // Handle any errors
          }); 
    };


    return (
        <>
            <div></div>
        </>
    )
}