import React, { Component } from "react";
import { Actions } from 'react-native-router-flux';
import { getItemAsync } from './../util/Strorage';
import { DEBUG } from "./../util/Debug";
import { LANGUAGE_LIST, setLanguage } from './../util/Translate';
import { Button } from '../style/LanguageSettingStyle';
import { Text, BackGroundView, ModalView } from '../style/Base';
import { Key as KEY } from './../const/Key';

export default class LanguageSetting extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            checkLanguage: false
        };

        getItemAsync(KEY.LANGUAGE_KEY).then(value => {
            this.setState({
                checkLanguage: (value === null)
            }, () => {
                if(value !== null) {
                    Actions.agreement();
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
            Actions.agreement();
        });
    }
    
    languageButton() {
        return [...LANGUAGE_LIST].map((language, idx) => (
            <Button key={idx} onPress={this.selectLanguage.bind(this, language.lang)} title={language.name}>
                <Text bold={true}>{language.name}</Text>
            </Button>
        ))
    }

    render() {
        if(DEBUG){
            console.log(`this.state.langCheck ${this.state.checkLanguage}`);
        }
        if(!this.state.checkLanguage) {
            return (<BackGroundView></BackGroundView>);
        }
        return (<BackGroundView>
                    <ModalView>
                        {this.languageButton()}
                    </ModalView>
                </BackGroundView>);
    }
}