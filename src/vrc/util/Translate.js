import ko from './../../translate/lang/ko.js';
import en from './../../translate/lang/en.js';
import jp from './../../translate/lang/jp.js';
import es from './../../translate/lang/es.js';
import br from './../../translate/lang/br.js';

import { Key as KEY } from './../const/Key';

import {
    getItemAsync,
    setItemAsync
} from './Strorage.js';

export const LANGUAGE_LIST = [{
        lang: 'ko',
        name: '한국어',
        language: ko
    },
    {
        lang: 'en',
        name: 'English',
        language: en
    },
    {
        lang: 'jp',
        name: '日本語',
        language: jp
    },
    {
        lang: 'es',
        name: 'Español',
        language: es
    },
    {
        lang: 'br',
        name: 'Portugués',
        language: br
    }
];

const defaultLanguage = {
    language: 'ko'
};
const languagePack = LANGUAGE_LIST.reduce((a, c) => ({
    ...a,
    [c.lang]: c.language
}), {});
let language = defaultLanguage.language;

const isContain = (key) => key in languagePack;

export const getLanguage = () =>
    getItemAsync(KEY.LANGUAGE_KEY).then(value => {
        language = isContain(value) ? value : defaultLanguage.language;
    }).catch(err => {
        language = defaultLanguage.language;
    });

export const setLanguage = (lang) => {
    language = isContain(lang) ? lang : defaultLanguage.language;
    setItemAsync(KEY.LANGUAGE_KEY, language).then(value => console.log(value), err => console.log(err));
}

export const translate = (key) =>
    key in languagePack[language] ? languagePack[language][key] : `${language}.strings.${key}`;