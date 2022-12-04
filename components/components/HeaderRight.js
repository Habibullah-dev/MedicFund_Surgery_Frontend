
import styled from 'styled-components'
import { DarkModeOutlined } from '@mui/icons-material';
import { LightModeOutlined } from '@mui/icons-material';
import { useContext } from 'react';
import { App } from '../Layout/Layout';
import Wallet from '../components/Wallet'

const HeaderRight = () => {

   const {changeTheme,theme} = useContext(App);

    return (
      <HeaderRightWrapper>
      <Wallet/>
      <ToggleWrapper onClick={changeTheme}>
        {
          theme == 'lightTheme' ? <DarkModeOutlined style={{fontSize:36}} /> :  <LightModeOutlined style={{fontSize:36}}/>
        }
      </ToggleWrapper>
      </HeaderRightWrapper>
    )
  }

  const ToggleWrapper = styled.p`
  `;

const HeaderRightWrapper = styled.div`
   display :flex;
   justify-content: center;
   align-items: center;

`;

  
  export default HeaderRight