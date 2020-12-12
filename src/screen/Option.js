import React, { Component } from "react";
// common component
import {
    Button,
    Text,
} from "native-base";
import {
    Image,
    ScrollView,
    RefreshControl,
    View,
    Alert,
    ToastAndroid,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    Switch,
    Linking
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Modal from 'react-native-modal';
import { Actions } from "react-native-router-flux";
import { Col, Row } from "react-native-easy-grid";
import styles from '../css/css';
import {NetmarbleM,NetmarbleB,NetmarbleL} from '../utils/CssUtils';
import {translate} from '../translate/TranslateUtils';

export default class Option extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fakeImage: false,
            highImage: false
        };
    }

    UNSAFE_componentWillMount() {
    }

    componentWillUnmount() {
    }

    componentDidMount() {
    }

    // 로그아웃 처리
    logout = () =>
    {
        Alert.alert(
            translate('information'),
            translate('msg_logout'),
            [
                {text: translate('ok'), onPress: () => {
                    fetch(`https://api.vrchat.cloud/api/1/logout`, VRChatAPIPut)
                    .then((response) => response.json())
                    .then(() => {
                        Actions.replace("loginSc");
                    });
                }},
                {text: translate('cancel')}
            ]
        );
    }

    
    render() {
        return (
            <View style={{flex:1}}>
                <View style={[styles.logo,{justifyContent:"center"}]}>
                    <Icon
                    onPress={()=>Actions.pop()}
                    name="chevron-left" size={25}
                    style={{color:"white",position:"absolute",left:15,top:10}}/>
                    <NetmarbleB style={{color:"white"}}>{translate('option')}</NetmarbleB>
                </View>
                <View style={styles.userOption}>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setState({fakeImage:!this.state.fakeImage})}
                        thumbColor={"#f4f3f4"}
                        value={this.state.fakeImage}/>
                        <NetmarbleL style={{color:"#646464"}}>{translate('fake_image')}</NetmarbleL>
                    </View>
                    <View style={styles.userOptionBox}>
                        <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        onValueChange={()=>this.setState({highImage:!this.state.highImage})}
                        thumbColor={"#f4f3f4"}
                        value={this.state.highImage}/>
                        <NetmarbleL style={{color:"#646464"}}>{translate('high_image')}</NetmarbleL>
                    </View>
                </View>
                <View style={styles.setting}>
                    <TouchableOpacity
                    onPress={()=>console.log("1")}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/trans_icon.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('lang_option')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>Linking.openURL("http://www.vrct.kr")}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/homepage.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('homepage')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>console.log("2")}>
                        <View style={styles.settingMenu}>
                            <Image source={require('../css/imgs/logout.png')} style={styles.settingMenuImage}/>
                            <NetmarbleL>{translate('logout')}</NetmarbleL>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}