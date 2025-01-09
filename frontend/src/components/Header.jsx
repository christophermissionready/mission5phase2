import React from 'react'
import './Header.css'
import zlogo from './../assets/header/ZLOGO.png'
import personal from './../assets/header/Color4.jpg'
import business from './../assets/header/00 Personal Business.jpg'
import zapp from './../assets/header/Z APP.png'
import about from './../assets/header/Z APP (1).png'
import searchicon from './../assets/header/search icon.png'
import login from './../assets/header/Log in.png'
import atstation from './../assets/header/HF main Menu 1.png'
import power from './../assets/header/HF main Menu 2.png'
import rewards from  './../assets/header/HF main Menu 3.png'
import locate from './../assets/header/Locate.png'

const Header = () => {
  return (<>
    <div className='top'>
      <img className='z' src={zlogo}></img>
      <img className='personal' src={personal}></img>
      <img className='business' src={business}></img>
      <img className='z-app' src={zapp}></img>
      <img className='about' src={about}></img>
      <img className='search' src={searchicon}></img>
      <img className='login' src={login}></img>
    </div>

    <div className='bottom'>
      <img className='at-the-station' src={atstation}></img>
      <img className='power' src={power}></img>
      <img className='rewards' src={rewards}></img>
      <img className='locate' src={locate}></img>
      </div>
    </>
  )
}

export default Header
