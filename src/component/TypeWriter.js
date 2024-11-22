import React, { useState, useEffect } from 'react';
import Textview from './Textview';
import Design from '../design/Design';

const Typewriter = ({ text, delay, infinite }) => {
    
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
       
        let timeout;

        if (currentIndex <= text.length) {

            timeout = setTimeout(() => {

                if (text[currentIndex] != undefined) {

                    setCurrentText(prevText => prevText + text[currentIndex]);

                }

                setCurrentIndex(prevIndex => prevIndex + 1);

            }, delay);

        } else if (infinite) {

            setCurrentIndex(0);
            setCurrentText('');
        }

        return () => clearTimeout(timeout);
    }, [currentIndex, delay, infinite, text]);

    return <Textview
        text={currentText + '|'}
        font_size={Design.font_27}
        color={Design.text_light_grey}
        font_family={'medium'}
        //margin_top={35}

    />;
};

export default Typewriter;