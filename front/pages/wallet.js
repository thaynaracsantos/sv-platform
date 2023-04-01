import { useState, useEffect } from 'react';
import { ethers } from 'ethers';


const ContractKit = require('@celo/contractkit');
const contractAddress = '0x6389b1F4Ea365E62fa88b4648a54E18017a315B9'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

export default function MyComponent() {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [jointOwnerAddress, setJointOwnerAddress] = useState(null); 

    const [isContractOwner, setIsContractOwner] = useState(false);
    const [contractOwnerAddress, setContractOwnerAddress] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setJointOwnerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getContractOwner = async () => {
    try {
        const kit = ContractKit.newKit('https://alfajores-forno.celo-testnet.org');
        const contract = new kit.web3.eth.Contract(SVForumJSON.abi, contractAddress);
      
        const owner = await contract.methods.contractOwner().call();
        setContractOwnerAddress(owner);

        if (owner.toLowerCase() === jointOwnerAddress.toLowerCase()) {
            setIsContractOwner(true);
        }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getContractOwner();
  }, [isWalletConnected])

  return (
    <>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-pink-900 dark:text-pink-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            Carteira
          </h1>
        </div>
        <div className="container py-12">
          <div className="-m-0 flex flex-wrap text-pink-500">
            {isContractOwner && (
                <p><span className="font-bold">(Adm)</span></p>
            )}
            {jointOwnerAddress ? (
                <p><span className="font-bold">Sua Conta: </span> {jointOwnerAddress}</p>
            ) : (
                <button onClick={checkIfWalletIsConnected}>Conectar Conta</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
