import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './spinner.css';

const Loading = ({ message = 'Cargando...', size = 'normal' }) => {
    return (
        <div className={`loading-container loading-${size}`}>
            <div className="loading-content">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
                {message && <div className="loading-message">{message}</div>}
            </div>
        </div>
    );
};

Loading.propTypes = {
    message: PropTypes.string,
    size: PropTypes.oneOf(['small', 'normal', 'large'])
};

export default Loading;