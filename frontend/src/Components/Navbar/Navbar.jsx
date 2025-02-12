import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext'; // Make sure to import ShopContext
import nav_dropdown from '../Assets/nav_dropdown.png'

export const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems } = useContext(ShopContext); // Using ShopContext to get the cart items
  const menuRef = useRef();

  const dropdown_toggle = (e) =>{
 menuRef.current.classList.toggle('nav-menu-visible');
 e.target.classList.toggle('open');

  }
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt=""/>
      <ul ref={menuRef} className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: 'none'}} to='/' className={menu === "shop" ? "active" : ""}>Shop</Link>
          {menu === "shop" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: 'none'}} to='/mens' className={menu === "mens" ? "active" : ""}>Men</Link>
          {menu === "mens" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: 'none'}} to='/womens' className={menu === "womens" ? "active" : ""}>Women</Link>
          {menu === "womens" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("kids")}>
          <Link style={{ textDecoration: 'none'}} to='/kids' className={menu === "kids" ? "active" : ""}>Kids</Link>
          {menu === "kids" ? <hr /> : null}
        </li>
      </ul>
      <div className="nav-login-cart">
      {localStorage.getItem('auth-token')
      ?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>logout</button>
      :     <Link to='/login'>
          <button>Login</button>
        </Link>}
   
        <Link to='/cart'>
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div> {/* Display cart item count */}
      </div>
    </div>
  );
};
