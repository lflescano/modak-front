import React from 'react';
import Form from 'react-bootstrap/Form';

import './styles.scss';

const InputText = ({label, type, as, placeholder, rows=1, handleChange, id, error=[]}) => {

return <span>
            <div className="input-text-container">
                <Form.Group controlId={id}>
                    <Form.Label>{label}</Form.Label>
                    <Form.Control type={type} as={as} placeholder={placeholder} onChange={handleChange} rows={rows}/>
                </Form.Group>
            </div>
            <div className="input-error">
            {error.map(item => {
                return <p>{item}</p>;
            })}
            </div>
    </span>
}

export default InputText;