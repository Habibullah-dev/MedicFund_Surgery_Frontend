import { style } from '@mui/system'
import React from 'react'
import Form from '../components/components/Form'
import styled from 'styled-components'

const addsurgeries = () => {
  return (
     <Wrapper>
        <Form/>
     </Wrapper>
  );
}

const Wrapper = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
`

export default addsurgeries