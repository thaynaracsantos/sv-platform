import { useState, useEffect } from 'react';
import { ethers } from 'ethers';


const contractAddress = '0x44E7477B4D6ff1CC8ee18677021FE11591399dAD'; 
const url = 'https://polygon-mumbai.g.alchemy.com/v2/9nTsL13BqFT3QTlnN8SlTQMt2PvQQnYv';
const SVForumJSON = require('./contracts/SVForum.json'); 
const Web3 = require('web3');
const web3 = new Web3(url);

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
        var contract = new web3.eth.Contract(SVForumJSON.abi, contractAddress);
      
        const owner = await contract.methods.contractOwner().call();
        console.log(owner);
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
        <div className="container py-12 ">
          <div className="-m-0 flex flex-wrap text-pink-500">
            <div>
              <p><b>Mantenha seu desabafo anônimo!</b></p>
              <p>Para garantir o anonimato, aconselhamos que use essa Metamask, única e exclusivamente para a Vozes Seguras.</p>
            </div>
          </div>
          <div className="-m-0 flex flex-wrap text-pink-500 space-y-2 pt-6 pb-8 md:space-y-5">
            {jointOwnerAddress ? (
                <p><span className="font-bold">Sua Conta {isContractOwner && (<span className="font-bold">(Adm)</span>)}: </span> {jointOwnerAddress}</p>
            ) : (
                <button onClick={checkIfWalletIsConnected}>Conectar Conta</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
