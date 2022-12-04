import React from 'react'
import networks from '../../helpers/networks';
import { ethers } from 'ethers';
import { useState } from 'react';
import styled from 'styled-components';

const Wallet = () => {
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("");


  const connectWallet = async () => {

    if(typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      if (provider.network !== "matic") {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              ...networks["polygon"],
            },
          ],
        });
      } 

      const account = provider.getSigner();
      const Address = await account.getAddress();
      setAddress(Address);
      const Balance = ethers.utils.formatEther(await account.getBalance());
      setBalance(Balance) 

    }
    
  };

  return (
    <ConnectWalletWrapper onClick={connectWallet}>
      {balance == '' ? '': <Balance>Balance: {balance.slice(0,4)} Matic</Balance> }
      {address == '' ? <Address>Connect Wallet</Address> : <Address>Account: {address.slice(0,10)}...{address.slice(39)}</Address>}
    </ConnectWalletWrapper>
  );

}

const ConnectWalletWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-right: 10px;
`;


const Address = styled.h3`
  height: 40px;
  border: ${(props) => props.theme.border };
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  font-size: large;
  padding: 0px 20px;
`

const Balance = styled.h3`
  height: 40px;
  border: ${(props) => props.theme.border };
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  font-size: large;
  padding: 0px  20px;
    
`


export default Wallet