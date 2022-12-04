import React from 'react'
import styled from 'styled-components'
import { HomeRounded, SignalCellularNullRounded} from '@mui/icons-material'
import { AddRounded , VaccinesRounded } from '@mui/icons-material'
import { useRouter } from 'next/router'
import Link from 'next/link'

const HeaderCenter = () => {
   const Router = useRouter();
  return (
    <HeaderNavigatioWrapper>
        <Link href={'/'} style={{textDecoration: 'none'}} >
           <NavLink style={{fontSize:20}}  active={Router.pathname == '/' ? true : false} >
            <HomeRounded style={{fontSize:20}}/>
            &nbsp;
             Home
            </NavLink>
        </Link>
        <Link href={'/surgeries'} style={{textDecoration: 'none'}}>
        <NavLink style={{fontSize:20}}  active={Router.pathname == '/surgeries' ? true : false}>
          <VaccinesRounded style={{fontSize:20}}/>
          &nbsp;
          Surgeries
        </NavLink>
        </Link>
        <Link href={'/addsurgeries'} style={{textDecoration: 'none'}}>
        <NavLink style={{fontSize:20}} active={Router.pathname == '/addsurgeries' ? true : false} >
         <AddRounded style={{fontSize:20}}/>
           Add Surgery
        </NavLink>
        </Link>

    </HeaderNavigatioWrapper>
    
  )
}

const HeaderNavigatioWrapper = styled.div `
  display: flex;
  align-items: center;
  justify-content: center;
`

const NavLink = styled.div`
  width: 140px;
  height: 40px;
  border: ${(props) => props.theme.border };
  border-radius: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
  text-decoration: none;
  color:${(props) => props.theme.color} ;
  font-size: large;

`
export default HeaderCenter