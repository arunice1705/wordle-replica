import React from 'react';
import './Cell.css';

const Cell = ({ char, status }) => {
    return (
        <div className={`cell ${status}`}>
            {char}
        </div>
    );
};

export default Cell;
