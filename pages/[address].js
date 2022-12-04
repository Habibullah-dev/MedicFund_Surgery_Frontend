import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'
import { PaidRounded } from '@mui/icons-material'
import { Fragment } from 'react'
import { Timeline, Event } from "react-timeline-scribble";
import {ethers} from 'ethers';
import SurgeryFactory from '../contracts/SurgeryFactory.sol/SurgeryFactory.json';
import Surgery from '../contracts/Surgery.sol/Surgery.json';
import { useEffect, useState } from "react";
import { TailSpin } from 'react-loader-spinner'


export default function Detail({Data, FundsData}) {
  const [myFundings, setMyFundings] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState();
  const [change, setChange] = useState(false);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    const Request = async () => {
      let descriptionData;
      
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
      );
    
      const contract = new ethers.Contract(
        Data.address,
        Surgery.abi,
        provider
      );

      fetch(Data.descriptionLink)
            .then(res => res.text()).then(data => descriptionData = data);

      const fundingsEvent = contract.filters.fundedEvent(Address);
      const AllFundings = await contract.queryFilter(fundingsEvent);

      setMyFundings(AllFundings.map((e) => {
        return {
          funder: e.args.funder,
          amount: ethers.utils.formatEther(e.args.amountFunded),
          timestamp : parseInt(e.args.timeStamp)
        }
      }));

      setDescription(descriptionData);

      console.log(description);
    }

    Request();
  }, [change]);


  const FundSurgery = async () => {
    setLoading(true);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      const contract = new ethers.Contract(Data.address, Surgery.abi, signer);
      
      const transaction = await contract.fundSurgery({value: ethers.utils.parseEther(amount), gasLimit: 100000,});
      await transaction.wait();

      setChange(true);
      setAmount('');
      setLoading(false);
  } catch (error) {
      console.log(error);
  }

  }

  //'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3VyZ2VyeXxlbnwwfHwwfHw%3D&w=1000&q=80'
  return (
    <DetailWrapper>
      <DetailRightWrapper>
        <div>
          <h3><u>Photo Image</u></h3>
          <ImageWrapper>
            <Image 
            alt='image'
            width={500}
            height={500}
            objectFit={'cover'}
            layout={'responsive'}
            src={Data.image}/>
          </ImageWrapper>
        </div>
        <div>
        <div>
          <h3><u>Description of Surgery</u></h3>
          <div>
              {description}
          </div>
        </div>
        <div>
          <h3><u>Signed Document(Hospital Proof)</u></h3>
          <ImageWrapper>
            <Image 
            alt='image'
            width={500}
            height={500}
            objectFit={'cover'}
            layout={'responsive'}
            src={Data.document}/>
          </ImageWrapper>
        </div>

        </div>
      </DetailRightWrapper>
      <DetailLeftWrapper>
        <DetailLeftTopWrapper>
          <h2>{Data.title}</h2>
          <div style={{display:'flex',justifyContent:'space-around',margin:'10px 50px'}}>
  
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount to Fund" type={'number'} required={true}></Input>
            <Button disabled={loading} onClick={FundSurgery}>
                {loading ? <TailSpin height={50}/> :''}
                <PaidRounded style={{color:'green'}}/> &nbsp; Fund Surgery</Button>
    
          </div>
          <div style={{display:'flex',justifyContent:'space-around',margin:'30px 20px'}}>
          <SurgeryData style={{backgroundColor:'lightskyblue'}}>
              <h3>Required</h3>
              <p style={{fontSize:'32px',color:'magenta'}}>{Data.requiredAmount}  Matic</p>
          </SurgeryData>
          <SurgeryData style={{backgroundColor:'lightgreen'}}>
              <h3>Received</h3>
              <p style={{fontSize:'32px',color:'magenta'}}>{Data.receivedAmount} Matic</p>
          </SurgeryData>
          <SurgeryData style={{backgroundColor:'lightyellow'}}>
              <h3>Remaining</h3>
              <p style={{fontSize:'32px',color:'magenta'}}>{Data.amountRemaining} Matic</p>
          </SurgeryData>

          </div>
          <div style={{display:'flex',alignItems:'space-around',flexDirection:'column',margin:'30px 20px'}}>
              <RecentFundHeader><h2>My Recent Funding</h2></RecentFundHeader>
              {myFundings.map((e) => {
              return (
                <RecentFund key={e.timestamp}>
                  <p>{e.funder.slice(0,6)}...{e.funder.slice(39)}</p>
                  <p>{e.amount} Matic</p>
                  <p>{new Date(e.timestamp * 1000).toLocaleString()}</p>
                </RecentFund>
              )
            })
            }
             

          </div>
        </DetailLeftTopWrapper>
         <DetailLeftBottomWrapper>
            <div>
            <Fragment>
              <h1>Surgery Fund TimeLine</h1>
              <Timeline>
                {
                  FundsData.map((e) => {
                    const title = e.funder.slice(0,6)+ '....'+e.funder.slice(39);
                    const amount = e.amount + 'Matic';
                    return(
                      <Event key={e.timestamp} interval={new Date(e.timestamp * 1000).toLocaleString()} title={title} subtitle={amount}>
                       <p>Funder Address:🏦 {title} donated 💰{amount} to support this surgery 🏥 on ⏲️ {new Date(e.timestamp * 1000).toLocaleString()}</p>
                       <p>Kindly help and support this surgery before the deadline date⏱️. Thanks ❤️❤️</p>
                    </Event>
                    )
                  })
                }
             
              </Timeline>
        </Fragment>
            </div>
         </DetailLeftBottomWrapper>
      </DetailLeftWrapper>

    </DetailWrapper>  
    )
}


export async function getStaticPaths() {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
  );

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    SurgeryFactory.abi,
    provider
  );

  const allSurgeryEvents = contract.filters.newSurgeryEvent();
  const AllSurgeries = await contract.queryFilter(allSurgeryEvents);

  return {
    paths: AllSurgeries.map((e) => ({
        params: {
          address: e.args.surgeryAddress.toString(),
        }
    })),
    fallback: "blocking"
  }
}

export async function getStaticProps(context) {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
  );

  const contract = new ethers.Contract(
    context.params.address,
    Surgery.abi,
    provider
  );

  const title = await contract.getTitle();
  const requiredAmount = await contract.getRequiredAmount();
  const image = await contract.getImageLink();
  const descriptionLink = await contract.getDescriptionLink();
  const document = await contract.getDocumentLink();
  const owner = await contract.getOwner();
  const receivedAmount = await contract.getReceivedAmount();
  const amountRemaining = await contract.getAmountRemaining();

  const fundsEvent = contract.filters.fundedEvent();
  const AllFunds = await contract.queryFilter(fundsEvent);

  console.log(AllFunds);


  const Data = {
      address: context.params.address,
      title, 
      requiredAmount: ethers.utils.formatEther(requiredAmount), 
      image, 
      receivedAmount: ethers.utils.formatEther(receivedAmount), 
      descriptionLink, 
      owner,
      document,
      amountRemaining: ethers.utils.formatEther(amountRemaining), 
  }

  const FundsData =  AllFunds.map((e) => {
    return {
      funder: e.args.funder,
      amount: ethers.utils.formatEther(e.args.amountFunded),
      timestamp : parseInt(e.args.timeStamp)
  }});

  return {
    props: {
      Data,
      FundsData
    },
    revalidate: 10
  }


}





const RecentFundHeader = styled.div`
    display: flex;
  
`
const RecentFund = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;
   color:${(props) => props.theme.color} ;
   background-color:${(props) => props.theme.divBackground1};
   padding: 5px;
`
const SurgeryData = styled.div`
   background-color:${(props) => props.theme.divBackground1} ;
   color: black;
   height: 130px;
   width: 200px;
   border-radius: 10px;
   padding:5px;
   text-align: center;
`
const SurgeryDataTitle = styled.h3`
  color: magenta;
`

const Button = styled.button`
  width: 400px;
  height: 60px;
  background-color: lightgreen;
  border-radius: 60px;
  outline: none;
  border: 1px solid green;
  color:${(props) => props.theme.color} ;
  margin-bottom: 5px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  &:disabled {
    background-color: #fff;
    cursor: no-drop;
  }
  `

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.divBackground1} ;
  color:${(props) => props.theme.color} ;
  border: ${(props) => props.theme.border };
  border-radius:8px ;
  outline:none;
  font-size:large;
  width: 40%;
`


const DetailWrapper =  styled.div`
  margin-top: 50px;
  padding: 20px;
  margin: 30px 50px;
  display: flex;
  justify-content: space-between;
`

const DetailRightWrapper = styled.div`
  background-color: ${(props) => props.theme.divBackground2};
  border-radius: 5px;
  display:flex;
  flex-direction: column;
  padding:10px;
  width: 38%;
`

const DetailLeftWrapper = styled.div`
  padding: 10px;
  width: 55%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
`

const DetailLeftTopWrapper = styled.div`
  border-radius: 5px;
  background-color: ${(props) => props.theme.divBackground2};
  min-height: 20%;
  padding: 10px;
`

const DetailLeftBottomWrapper = styled.div`
 border-radius: 5px;
  background-color: ${(props) => props.theme.divBackground2};
  min-height: 20%;
  padding: 10px;
  margin-top: 50px;
`

const ImageWrapper = styled.div`


`