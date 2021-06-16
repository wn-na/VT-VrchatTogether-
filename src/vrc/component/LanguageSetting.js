import React, { Component } from "react";
import { View } from "react-native";
import { Actions } from 'react-native-router-flux';
import { getItemAsync } from './../util/Strorage';
import { DEBUG } from "./../util/Debug";
import { LANGUAGE_LIST, setLanguage, LANGUAGE_KEY } from './../util/Translate';
import { Button, Text, BackGroundView, ModalView } from '../style/LanguageSettingStyle';

export default class LanguageSetting extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            checkLanguage: true
        };

        getItemAsync(LANGUAGE_KEY).then(value => {
            this.setState({
                checkLanguage: (value === null)
            }, () => {
                if(value !== null) {
                     Actions.loginSc();
                }
            });
        });
    }

    selectLanguage(language) {
        if(DEBUG){
            console.log(`language ${language}`);
        }
        setLanguage(language);
        this.setState({
            checkLanguage: false
        }, () => { 
            if(DEBUG){
                console.log(`this.state.langCheck1 ${this.state.checkLanguage}`);
            }
            Actions.loginSc();
        });
    }
    
    languageButton() {
        return [...LANGUAGE_LIST].map((language, idx) => (
            <Button key={idx} onPress={this.selectLanguage.bind(this, language.lang)} title={language.name}>
                <Text>{language.name}</Text>
            </Button>
        ))
    }

    render() {
        if(DEBUG){
            console.log(`this.state.langCheck ${this.state.checkLanguage}`);
        }
        if(!this.state.checkLanguage) {
            return (<View></View>);
        }
        return (<BackGroundView>
                    <ModalView>
                        {this.languageButton()}
                    </ModalView>
                </BackGroundView>);
    }
}