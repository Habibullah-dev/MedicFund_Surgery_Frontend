import React from 'react'
import Header from './Header'
import Footer from './Footer'
import themes from '../themes/theme'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { useState, createContext } from 'react'
import { ToastContainer } from 'react-toastify'
import  'react-toastify/dist/ReactToastify.css'


const App = createContext();

const Layout = ({children}) => {

  const [theme,setTheme] = useState('lightTheme');

  const changeTheme = () => {
    setTheme(theme == "lightTheme" ?"darkTheme" : "lightTheme");
  }

  return (
    <App.Provider value={{changeTheme,theme}}>
    <ThemeProvider theme={themes[theme]}>
      <LayoutWrapper>
         <ToastContainer/>
        <GlobalStyle/>
          <Header/>
          {children}
      </LayoutWrapper>

    </ThemeProvider>
    </App.Provider>
  )
}


const LayoutWrapper = styled.div`
          background-color: ${(props) => props.theme.bgColor };
          background-image: ${(props) => props.theme.bgImage };
          color: ${(props) => props.theme.color };
          width: 100%;
          min-height:100vh;
          `;

const GlobalStyle = createGlobalStyle`
    body {
      margin: 0;
      padding: 0;
      width: 100%;
      font-family: sans-serif,Arial, Helvetica, ;
      font-weight: 500;
    }
`;

export default Layout;

export {App}
