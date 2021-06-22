import React, { Component } from "react";
import { View, BackHandler } from "react-native";
import { Actions } from 'react-native-router-flux';
import { getItemAsync, setItemAsync } from './../util/Strorage';
import { DEBUG } from "./../util/Debug";
import { translate } from './../util/Translate';
import { Text, BackGroundView, ModalView } from './../style/Base';
import { Button } from './../style/AgreementStyle';
import { Key as KEY } from './../const/Key';

export default class Agreement extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            checkAgree: false
        };
        getItemAsync(KEY.USER_PERMISSION_KEY).then(value => {
            this.setState({
                checkAgree: (value === 'Y')
            }, () => {
                if (value === 'Y') {
                    if(DEBUG){
                        console.log(`this.state.checkAgree1 ${this.state.checkAgree}`);
                    }
                    Actions.loginSc();
                }
            });
        });
    }

    permit() {
        setItemAsync(KEY.USER_PERMISSION_KEY, 'Y');
        this.setState({
            checkAgree: 'Y'
        }, () => {
            if(DEBUG){
                console.log(`this.state.checkAgree2 ${this.state.checkAgree}`);
            }
            Actions.loginSc();
        });
    }

    render() {
        if(DEBUG){
            console.log(`this.state.checkAgree ${this.state.checkAgree}`);
        }
        if(this.state.checkAgree) {
            return (<BackGroundView></BackGroundView>);
        }
        return (<BackGroundView>
                    <ModalView>
                        <Text bold={true} fontSize={30}>
                            {translate('information')}
                        </Text>

                        <Text textAlign={"center"}>
                            {`\n${translate('msg_agreement_first')}`}
                            <Text bold={true}>
                                {translate('msg_agreement_unoffice')}
                            </Text>
                            {translate('msg_agreement_second')}
                        </Text>
                        <Text textAlign={"center"}>
                            {translate('msg_agreement')}
                        </Text>
                        <Text bold={true}>
                            {translate('msg_agree_yn')}
                            </Text>
                        <View style={{ flexDirection:"row", height: 50, paddingTop : 5 }}>
                            <Button onPress={() => this.permit()}>
                                <Text>{translate('agree')}</Text>
                            </Button>
                            <Button onPress={() => BackHandler.exitApp()}>
                                <Text>{translate('disagree')}</Text>
                            </Button>
                        </View>
                    </ModalView>
                </BackGroundView>);
    }
}