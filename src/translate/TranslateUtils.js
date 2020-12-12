import {AsyncStorage} from "react-native";
import ko from './lang/ko.js'
import en from './lang/en.js'
import jp from './lang/jp.js'
import { exp } from "react-native-reanimated";

let languagepack = {ko, en, jp}

const defaultLanguage = {language : 'ko'}
let language = defaultLanguage.language

export function getLanguage(){
    AsyncStorage.getItem("setting_language", (err, value) => {
        if(err) {
            language = defaultLanguage.language
            AsyncStorage.setItem("setting_language", defaultLanguage.language)
        } else {
            if(value in languagepack){
                language = value
            } else {
                language = defaultLanguage.language
                AsyncStorage.setItem("setting_language", language)
            }
        }
    });
}

export function setLanguage(lang){
    if(lang in languagepack){
        language = lang
    } else {
        language = defaultLanguage.language
    }
    AsyncStorage.setItem("setting_language", language)
}

export function userLang(lang){
    AsyncStorage.setItem("user_lang", lang);
    setLanguage(lang);
    getLanguage();
}

export function translate(key) {
    if(key in languagepack[language]) return languagepack[language][key]
    else return `translate error with '${key}' in language '${language}'`
}