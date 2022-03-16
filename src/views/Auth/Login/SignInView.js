import React, {useState} from 'react';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AuthService } from 'services/AuthService';
import useRequest from 'hooks/useRequest';
import { isMobile } from 'helpers/Mobile';

import LoginHeader from 'components/atoms/LoginHeader';
import InputText from 'components/atoms/InputText';
import InputCheckbox from 'components/atoms/InputCheckbox';
import ActionButton from 'components/atoms/ActionButton';


import './styles.scss';

const SignInView = (props) => {
    const history = useHistory();

    const {
        submitted, success, message, errors,
        beforeSubmit, afterSubmit, showError,
        dealWithError
    } = useRequest();

    const [email, setEmail] = useState("");
    const [clave, setClave] = useState("");
    const [showPass, setshowPass] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        beforeSubmit();
        AuthService.login(email, clave)
            .then(data => {
                AuthService.loadUser().then(data => {
                    afterSubmit();
                    // The event in App.js push to /home
                    history.push('/home');
                    console.log('login');
                }).catch(error => {
                    showError('El usuario no existe');
                });
            }).catch((error) => {
                console.log(error.status);
                dealWithError(error, '');
                console.log(errors);
            });
    }

    const registrar = (e) => {
        e.preventDefault();
    }

    const pedirPassword = (e) => {
        e.preventDefault();
    }

    return (
        <div className="signin-container">
            {!isMobile && <LoginHeader></LoginHeader>}

            <div className="signin-content">
                <form  className="signin-form" onSubmit={handleSubmit}>
                    <h1 className="signin-title">Iniciar Sesión</h1>
                    <div className="signin-input-group">
                        <div className="signin-input-icon-container">
                        </div>
                        <div className="signin-input-container">
                            <InputText id="email" label="" type="text" placeholder="Ingresá tu email"
                                handleChange={(event) => { setEmail(event.target.value) }} error={errors.email}/>
                        </div>
                    </div>
                    <div className="signin-input-group">
                        <div className="signin-input-icon-container">
                        </div>
                        <div className="signin-input-container">
                            <InputText id="password" label="" placeholder="Ingresá tu contraseña"
                                handleChange={(event) => {setClave(event.target.value)}}
                                type={showPass ? 'text' : 'password'} error={errors.password}/>
                            <div className={showPass ? 'register-eye show' : 'register-eye hide'} onClick={() => { setshowPass(false) }}>
                                Mostrar
                            </div>
                            <div className={showPass ? 'register-eye-closed hide' : 'register-eye show'} onClick={() => { setshowPass(true) }}>
                                Ocultar
                            </div>
                        </div>
                    </div>
                    { (success === false && message) &&
                        <p className="error-messages">{message}</p>
                    }
                    <div  className="signin-button">
                        <ActionButton legend={'INGRESAR'} disabled={submitted}
                            handleClick={handleSubmit} type={'submit'} />
                    </div>
                    <div className="signin-olvide">
                        <a onClick={pedirPassword}>Olvidé mi contraseña</a>
                    </div>
                    <div className="signin-bottom-content">
                        <p className="signin-bottom-legend">¿Todavía no te registraste?</p>
                        <div className="signin-bottom-button">
                            <ActionButton legend="REGISTRARME" handleClick={registrar}/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default withTranslation()(SignInView);