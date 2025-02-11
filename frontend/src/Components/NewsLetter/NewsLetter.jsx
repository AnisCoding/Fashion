import React from 'react'
import './NewsLetter.css'
export const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>get Exclusive Offers On Your Email</h1>
        <p>Subscibe to our newletter and stay updated</p>
        <div>
            <input type='email' placeholder='Your Email Id'/>
            <button>Subscribe</button>
        </div>
    </div>
  )
}
export default NewsLetter