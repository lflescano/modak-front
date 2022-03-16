import React from 'react'
import './styles.scss';
import { isMobile } from '../../../helpers/Mobile';
import { Link } from 'react-router-dom';

const LoginHeader = () => {

return <div className="login-header-container">
   <div className="login-header-logo">
        <Link to="/home">
            THE LOGO
        </Link>
   </div>
   {!isMobile &&
   <div className="login-header-title">
       <h1 className="login-header-title-text">Datos</h1>
        <div className="login-header-title-line"></div>
   </div>
    }
    {!isMobile && 
    <div className="login-header-contact-info">

    </div>
    }
</div>
}

export default LoginHeader;