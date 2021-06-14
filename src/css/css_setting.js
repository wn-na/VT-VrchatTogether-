import styles_dark from './css_dark';
import styles_white from './css_white';

import { AsyncStorage } from 'react-native';

export let styles = styles_dark;

export const getUserCssOption = async (state) => {
    await AsyncStorage.getItem('user_dark_mode', (err, value) => {
        if (value === 'check') {
            styles = styles_dark;
        } else {
            styles = styles_white;
        }
    });
};
