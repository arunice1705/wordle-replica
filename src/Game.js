import React, { useState, useEffect, useCallback } from 'react';
import Grid from './Grid';
import Toast from './Toast';
import './Game.css';

const TARGET_WORD = "READS";
const ROWS = 5;
const COLS = 5;

const Game = () => {
    // Grid state: 5 rows, each with 5 cells { char, status }
    const [grid, setGrid] = useState(
        Array(ROWS).fill().map(() => Array(COLS).fill({ char: '', status: 'empty' }))
    );
    const [currentRow, setCurrentRow] = useState(0);
    const [currentWord, setCurrentWord] = useState('');
    const [gameState, setGameState] = useState('playing'); // playing, won, lost
    const [toast, setToast] = useState(null);
    const [submittedWords, setSubmittedWords] = useState([]);

    const showToast = useCallback((msg) => {
        setToast(msg);
    }, []);

    const handleCloseToast = () => setToast(null);

    // Hard Mode Check: Returns null if valid, or error message string
    const checkHardMode = (word) => {
        // Find all previously revealed 'correct' (green) letters
        // We can just scan the grid up to currentRow
        // Ideally, we accumulate constraints.
        // Constraints: { index: char }
        const constraints = {};

        // Scan all previous rows for green letters
        for (let r = 0; r < currentRow; r++) {
            for (let c = 0; c < COLS; c++) {
                if (grid[r][c].status === 'correct') {
                    constraints[c] = grid[r][c].char;
                }
            }
        }

        // Verify current word against constraints
        for (const [index, char] of Object.entries(constraints)) {
            if (word[parseInt(index)] !== char) {
                // Return error message
                // "Once a letter is marked at the right position, subsequent words put must also have the green highlighted letter present at the exact location."
                return `MUST USE '${char}' AT POSITION ${parseInt(index) + 1}`;
            }
        }
        return null;
    };

    const submitGuess = useCallback(() => {
        if (gameState !== 'playing') return;

        if (currentWord.length !== COLS) {
            showToast("COMPLETE THE WORD AND SUBMIT");
            return;
        }

        // Check for repeated word
        if (submittedWords.includes(currentWord)) {
            showToast("REPEATED WORD");
            return;
        }

        // Hard Mode Validation
        const hardModeError = checkHardMode(currentWord);
        if (hardModeError) {
            showToast(hardModeError);
            return;
        }

        // Process the guess
        const newGrid = [...grid];
        const newRow = newGrid[currentRow].map((cell) => ({ ...cell })); // Copy row

        const wordArr = currentWord.split('');
        const targetArr = TARGET_WORD.split('');

        // First pass: correct (Green)
        wordArr.forEach((char, i) => {
            newRow[i] = { char, status: 'absent' }; // Default to absent
            if (char === targetArr[i]) {
                newRow[i].status = 'correct';
                targetArr[i] = null; // Mark as handled
                wordArr[i] = null;   // Mark as handled
            }
        });

        // Second pass: present (Orange)
        wordArr.forEach((char, i) => {
            if (char !== null) { // If not already handled
                const targetIndex = targetArr.indexOf(char);
                if (targetIndex !== -1) {
                    newRow[i].status = 'present';
                    targetArr[targetIndex] = null; // Consume
                }
            }
        });

        // Update grid
        newGrid[currentRow] = newRow;
        setGrid(newGrid);

        // Add to submitted history
        setSubmittedWords(prev => [...prev, currentWord]);

        // Check Win/Loss
        if (currentWord === TARGET_WORD) {
            setGameState('won');
            showToast("AWESOME");
        } else if (currentRow === ROWS - 1) {
            setGameState('lost');
            showToast("BETTER LUCK NEXT TIME");
        } else {
            // Next Turn
            setCurrentRow(prev => prev + 1);
            setCurrentWord('');
        }

    }, [currentWord, currentRow, gameState, grid, showToast, submittedWords]);

    const handleKeyDown = useCallback((e) => {
        if (gameState !== 'playing') return;

        const key = e.key.toUpperCase();

        if (key === 'ENTER') {
            submitGuess();
        } else if (key === 'BACKSPACE') {
            setCurrentWord(prev => prev.slice(0, -1));
        } else if (/^[A-Z]$/.test(key)) {
            if (currentWord.length < COLS) {
                setCurrentWord(prev => prev + key);
            }
        }
    }, [currentWord, gameState, submitGuess]);

    // Window listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);


    return (
        <div className="game-container">
            <Grid
                grid={grid}
                currentRow={currentRow}
                currentWord={currentWord}
            />

            <div className="game-controls">
                {/* Button for "On click should validate" requirement */}
                <button
                    className="submit-btn"
                    onClick={submitGuess}
                    disabled={gameState === 'won'}
                >
                    SUBMIT
                </button>
            </div>

            <Toast
                message={toast}
                onClose={handleCloseToast}
            />
        </div>
    );
};

export default Game;
