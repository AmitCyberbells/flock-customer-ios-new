import React, { useState, useEffect } from 'react';
import Textview from './Textview';
import { Fonts } from '../constants/Fonts';
import { Colors } from '../constants/Colors';
import { Platform, Text } from 'react-native';

const Typewriter = ({ text, delay, infinite }: TypeWriter) => {
    
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
       
        let timeout: any;

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

    return (<Text
       style={{
        fontSize: Fonts.fs_27,
        color: Colors.light_grey,
        fontFamily: Fonts.medium
       }} 
    >{currentText + '|'}</Text>)
};

export default Typewriter;

interface TypeWriter {
    text: string,
    delay: number,
    infinite: boolean
}