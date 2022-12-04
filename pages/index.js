import React from 'react'
import styled from 'styled-components'
import Image from 'next/image';
import doctor from '../logo/doctor.svg'
import Link from 'next/link';


export default function index() {
  return (
    <IndexWrapper>
       <IndexRight>
         <IndexTitle>FundMedic+ Surgery Fund</IndexTitle>
         <h1 style={{fontStyle:'italic'}}>A  <sapn style={{color:'magenta'}}>Transparent decentralize surgery</sapn> crowd <br/> funding web application.</h1>
          <h1 style={{fontStyle:'italic'}}>For receiving donation for emergency surgeries</h1>

          <ActionButtonWrapper>
            <Link href={'/surgeries'}>
             <StartButton>
                Get Started Today
             </StartButton>
             </Link>
          </ActionButtonWrapper>
       </IndexRight>
        <IndexLeft>

        <Image 
            alt='image'
            width={500}
            height={500}
            layout={'responsive'}
            src={doctor}/>
       </IndexLeft>
        
    </IndexWrapper>
  )
}

const ActionButtonWrapper = styled.div`
  margin-top: 100px;
  display: flex;
`
const StartButton = styled.button`
   width: 350px;
   height: 80px;
   border: ${(props) => props.theme.border };
   border-radius: 50px;
   font-size: 40px;
`

const IndexWrapper = styled.div`
   background-color:${(props) => props.theme.divBackground1} ;
   width: 100%;
   min-height: 100vh;
   display: flex;
   margin-bottom: 30px;
`;

const IndexRight = styled.div`
    width: 50%;
    padding: 30px;
    display: flex;
    flex-direction: column;

`

const IndexLeft = styled.div`
    width: 50%;
    padding: 30px;
`

const IndexTitle = styled.h1`
  font-size: 45px;
  color: #6C63FF;
  margin-bottom: 10%;
`