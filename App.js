import React, { Component } from 'react';
import { ToastAndroid } from 'react-native';
import { Scene, Router, Actions } from 'react-native-router-flux';
import LoginSc from './src/screen/LoginSc';
import MainSc from './src/screen/MainSc';
import AlertSc from './src/screen/AlertSc';
import FriendListSc from './src/screen/FriendListSc';
import UserDetail from './src/screen/UserDetail';

import MapListSc from './src/screen/MapListSc';
import AvatarListSc from './src/screen/AvatarListSc';
import FavoriteSc from './src/screen/FavoriteSc';
import BlockSc from './src/screen/BlockSc';

import MakeDetail from './src/screen/MakeDetail';

import Option from './src/screen/Option';

console.disableYellowBox = true;
export default  class App extends Component {
    
    constructor() {
        super();

        this.state = {
            exitApp: false
        }
    }

    backHandler(){
        if(Actions.currentScene == "loginSc" || Actions.currentScene == "mainSc")
        {
            if (this.state.exitApp == false) {
                ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
                this.state.exitApp = true;
    
                setTimeout(() => {
                    this.state.exitApp = false;
                }, 3000);
                return true;
            } else {
                return false;
            }
        }
        else
        {
            Actions.pop();
            return true;
        }
    }

    render() {
        return <Router
            backAndroidHandler={this.backHandler.bind(this)}>
            <Scene key="root">
                <Scene key="loginSc" hideNavBar={true} component={LoginSc} />
                <Scene key="mainSc" type={"replace"} hideNavBar={true} component={MainSc} />
                <Scene key="alertSc" hideNavBar={true} component={AlertSc} />
                <Scene key="friendListSc" hideNavBar={true} component={FriendListSc} />
                <Scene key="userDetail" hideNavBar={true} component={UserDetail} />
                <Scene key="avatarListSc" hideNavBar={true} component={AvatarListSc} />
                <Scene key="favoriteSc" hideNavBar={true} component={FavoriteSc} />
                <Scene key="blockSc" hideNavBar={true} component={BlockSc} />
                <Scene key="mapListSc" hideNavBar={true} component={MapListSc} />
                <Scene key="makeDetail" hideNavBar={true} component={MakeDetail} />
                <Scene key="option" hideNavBar={true} component={Option} />
            </Scene>
        </Router>
    }
}
