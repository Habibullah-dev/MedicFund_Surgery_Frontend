import React from 'react'
import Image from 'next/image'
import logo from '../../logo/surgery_fund_logo.png'

const HeaderLeft = () => {
    return (
      <div>
       <Image
        src={logo}
        alt="Picture of the logo"
      />
      </div>
    )
  }
  
  export default HeaderLeft