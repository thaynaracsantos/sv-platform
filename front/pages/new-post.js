const ContractKit = require('@celo/contractkit');
const contractAddress = '0xE4Be9782DB96A9EE92114Ec5D0a3fE72AabDF949'; 
const SVForumJSON = require('./contracts/SVForum.json'); 

import Web3Modal from 'web3modal';

import React, { useState } from 'react';

const hashTagList = [
  '#AGRESSAO',
  '#ASSEDIO-SEXUAL',
  '#ASSEDIO-MORAL',
  '#ASSEDIO-VIRTUAL',
  '#MANSPLAINING',
  '#STALKING',
  '#DIVULGACAO-NAO-AUTORIZADA-DE-IMAGEM-E-VIDEO',
  '#COMENTARIOS-OU-PIADAS-DE-CUNHO-SEXISTA-OU-DISCRIMINATORIO',
  '#TOQUES-INDESEJADOS-OU-INVASIVOS',
  '#DISCRIMINACAO-RACIAL',
  '#DISCRIMINACAO-DE-GENERO',
  '#REDUCAO-DA-CAPACIDADE',
  '#VIOLENCIA-OBSTETRICA',
  '#ABUSO-PSICOLOGICO',
];

export default function NewPost() {
    const [selectedHashTag, setSelectedHashTag] = useState(hashTagList[0]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
  
    const handleChange = (event) => {
        event.preventDefault();
        setSelectedHashTag(event.target.value);
    };

    const handleTitleChange = (event) => {
        event.preventDefault();
        setTitle(event.target.value);
    };
    
    const handleDescriptionChange = (event) => {
        event.preventDefault();
        setDescription(event.target.value);
    };

    const handleNewPostClick = async (event) => {
        event.preventDefault();
        console.log('Titulo:', title);
        console.log('Descricao:', description);
        console.log('Hashtag:', selectedHashTag);

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
            
            contract.methods.newPost(title, description, selectedHashTag).send({ from: account, gas: 3000000 });
    
          })
          .catch((error) => {
            console.error("error");
            console.error(error); // Handle any errors
          }); 
    };
  
    return (
      <div className="gap-4 flex flex-col rounded lg:px-12 px-6 py-16 dark:bg-slate-200/5 bg-slate-50 shadow-lg dark:shadow-pink-900">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold uppercase">DESABAFE AQUI!</h2>
          <form className="flex flex-col gap-2 font-light">
            <label htmlFor="titulo">Tópico</label>
            <input type="text" id="titulo" placeholder="Insira o tópico do seu desabafo" className="text-black rounded" value={title} onChange={handleTitleChange}/>
            <label htmlFor="hashTag">Categoria</label>
            <select className='rounded' id="hashTag" value={selectedHashTag} onChange={handleChange}>
              {hashTagList.map((hashTag) => (
                <option className='text-black border border-[red] break-words text' key={hashTag} value={hashTag}>
                  {hashTag}
                </option>
              ))}
            </select>
            <label htmlFor="descricao">Desabafo</label>
            <textarea className='h-52 rounded' id="descricao" placeholder="Espaço seguro para contar o que te aflinge" value={description} onChange={handleDescriptionChange}/>
            <button onClick={handleNewPostClick} type="submit" className="mt-2 bg-pink-500 focus:scale-95 hover:bg-pink-900 hover:-translate-y-2 transition-all ease-in-out duration-300 text-white font-bold py-2 px-4 rounded">
              Enviar
            </button>
          </form>
        </div>
      </div>
    );
  }