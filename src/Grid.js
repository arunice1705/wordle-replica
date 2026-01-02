import React from 'react';
import Cell from './Cell';
import './Grid.css';

const Grid = ({ grid, currentRow, currentWord }) => {
    return (
        <div className="grid-container">
            {grid.map((row, rowIndex) => (
                <div key={rowIndex} className="grid-row">
                    {row.map((cell, colIndex) => {
                        // If this is the current active row, we show the characters from currentWord buffer
                        let char = cell.char;
                        let status = cell.status;

                        if (rowIndex === currentRow) {
                            const letterObj = currentWord[colIndex];
                            char = letterObj ? letterObj : '';
                            status = 'empty'; // Active row is always "empty" status visually until submitted
                        }

                        return (
                            <Cell
                                key={colIndex}
                                char={char}
                                status={status}
                            />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Grid;
