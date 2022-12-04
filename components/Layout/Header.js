import React from 'react'
import styled from 'styled-components';
import HeaderCenter from '../components/HeaderCenter';
import HeaderLeft from '../components/HeaderLeft';
import HeaderRight from '../components/HeaderRight';

const Header = () => {
  return (
    <HeaderWrapper>
      <HeaderLeft/>
      <HeaderCenter/>
      <HeaderRight/>
     
    </HeaderWrapper>
  )
};

const HeaderWrapper = styled.div`
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.divBackground1 };
  padding: 10px;
  box-shadow: 1px 3px 2px #bcbcbc;
`;


export default Header