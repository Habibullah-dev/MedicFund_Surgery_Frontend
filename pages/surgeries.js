import styled from 'styled-components';
import  AccountBalanceRounded  from '@mui/icons-material/AccountBalanceRounded';
import  PunchClockRounded  from '@mui/icons-material/PunchClockRounded';
import  PaidRounded  from '@mui/icons-material/PaidRounded';
import  EventAvailableRounded  from '@mui/icons-material/EventAvailableRounded';
import { ethers } from 'ethers';
import SurgeryFactory from '../contracts/SurgeryFactory.sol/SurgeryFactory.json';
import Countdown from 'react-countdown'
import Link from 'next/link';
import { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';

import Image from 'next/image';



export default function Surgeries({data}) {
  
  const [loading,setLoading] = useState(false);

  const Completionist = () => <span style={{color:'red'}}>Surgery Expired!</span>;

// Renderer callback with condition
const renderer = ({days, hours, minutes, seconds, completed }) => {
  if (completed) {
    // Render a completed state
    return <Completionist />;
  } else {
    // Render a countdown
    return <span style={{color:'green',fontSize:'18px'}} >{days}days:{hours}hr:{minutes}min:{seconds}sec</span>;
  }
};

  return (
    <Wrapper>
    {
      data.map((e) => {
        return(
        <CardWrapper key={e.title}>
        <Card>
          <ImageContainer>
            <Image 
              src={e.image}
              alt='image'
              width={100}
              height ={90}
              layout='responsive'
              style={{margin:'2px', borderRadius: '20px 20px 0px 0px'}}
            />
            <div>
                <Title>{e.title}</Title>
            </div>

            <CardInfo>
                <div style={{display:'flex',alignItems:'center'}}>
                    <AccountBalanceRounded style={{color:'blue'}}/> 
                     <Text>Owner</Text>
                </div>
                <Text>{e.owner.slice(0,6)}...{e.owner.slice(39)}</Text>
            </CardInfo>
            <CardInfo>
                <div style={{display:'flex',alignItems:'center'}}>
                    <PunchClockRounded style={{color:'red'}}/> 
                     <Text>Deadline</Text>
                </div>
                <Text>{e.deadline > 0 ? <Countdown renderer={renderer} date={new Date(e.deadline).toLocaleString()}/> : 'Not Specified'}</Text> 
            </CardInfo>
            <CardInfo>
                <div style={{display:'flex',alignItems:'center'}}>
                    <PaidRounded style={{color:'green'}}/> 
                     <Text>Amount Needed</Text>
                </div>
                <Text>{e.requiredAmount}Matic</Text>
            </CardInfo>
            <CardInfo>
                <div style={{display:'flex',alignItems:'center'}}>
                    <EventAvailableRounded style={{color:'pink'}}/> 
                     <Text>Launch Date</Text>
                </div>
                <Text>{new Date(e.timestamp*1000).toLocaleString()}</Text>
            </CardInfo>
            <Link style={{textDecoration:'none'}} passHref={true} href={'/' + e.surgeryAddress} disabled={loading}  onClick={() => setLoading(true)}
              ><Button disabled={loading}>
            {loading ? <TailSpin height={20} color='black'/> : ''}Fund Details
               </Button>
          </Link>
           
          </ImageContainer>
  
        </Card>
  
      </CardWrapper>
        )
      })
    }
 
    </Wrapper>
  )

}

export async function getStaticProps() {

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC
  );

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    SurgeryFactory.abi,
     provider
  );

  const getAllSurgeries = contract.filters.newSurgeryEvent();

  const events = await contract.queryFilter(getAllSurgeries);

  const data = events.map((e) => {
    return {
      title: e.args.title,
      image: e.args.imageLink,
      owner: e.args.owner,
      requiredAmount: ethers.utils.formatEther(e.args.requiredAmount),
      timestamp:  parseInt(e.args.timeStamp),
      deadline:  parseInt(e.args.surgeryDeadline),
      surgeryAddress: e.args.surgeryAddress
    }
  });

  console.log(data);

  return {
    props : {
      data
    }
  }

}

const Wrapper = styled.div`
    margin-top: 50px;
    width: 90%;
    min-height: 90vh;
    background-color: ${(props) => props.theme.divBackground2};
    border-radius: 10px;
    box-shadow: 5px 5px 2px rgba(0,0,0,.3);
    padding: 20px;
    margin: 30px auto;
    display: flex;
    justify-content: start;
    align-items: flex-start;
    flex-wrap: wrap;

`
const CardWrapper = styled.div`
    min-height: 500px;
    width: 300px;
    border-radius: 20px;
    background-color: ${(props) => props.theme.divBackground1};
    box-shadow: 2px 2px 1px #bbb;
    border:1px solid rgba(0,0,0,0.2);
    margin: 10px;
`

const Card = styled.div`
     border-radius: 20px;

`

const ImageContainer = styled.div`
    border-radius: 20px;
    padding-right:2px;
    object-fit: cover;
`
const Text = styled.div`
    margin-left: 5px;
    margin-top: 2px;

`
const Title = styled.h5`
   font-size: 20px;
   font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
   margin-left:5px;
`
const CardInfo = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;


`
const Button = styled.button`
  margin-top: 20px;
  width: 200px;
  height: 35px;
  margin-left: 5px;
  background-color: ${(props) => props.theme.divBackground2};
  border-radius: 20px;
  outline: none;
  border: ${(props) => props.theme.border };
  color:${(props) => props.theme.color} ;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  &:disabled {
    background-color: #fff;
    cursor: no-drop;
  }

`
