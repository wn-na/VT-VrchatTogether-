import React, { Component } from 'react';
import {Scene, Router} from 'react-native-router-flux';
import LoginSc from './src/screen/LoginSc';
import MainSc from './src/screen/MainSc';
import AlertSc from './src/screen/AlertSc';
import FriendListSc from './src/screen/FriendListSc';
import FriendDetail from './src/screen/FriendDetail';

import MapListSc from './src/screen/MapListSc';
import MapDetail from './src/screen/MapDetail';
import AvatarListSc from './src/screen/AvatarListSc';
import FavoriteSc from './src/screen/FavoriteSc';
import BlockSc from './src/screen/BlockSc';

console.disableYellowBox = true;
export default  class App extends Component {
    render() {
        return <Router>
            <Scene key="root">
                <Scene key="loginSc" hideNavBar={true} component={LoginSc} initial />
                <Scene key="mainSc" type={"replace"} hideNavBar={true} component={MainSc} />
                <Scene key="alertSc" hideNavBar={true} component={AlertSc} />
                <Scene key="friendListSc" hideNavBar={true} component={FriendListSc} />
                <Scene key="friendDetail" hideNavBar={true} component={FriendDetail} />
                <Scene key="mapListSc" hideNavBar={true} component={MapListSc} />
                <Scene key="avatarListSc" hideNavBar={true} component={AvatarListSc} />
                <Scene key="favoriteSc" hideNavBar={true} component={FavoriteSc} />
                <Scene key="blockSc" hideNavBar={true} component={BlockSc} />
                <Scene key="MapDetail" hideNavBar={true} component={MapDetail} />
            </Scene>
        </Router>
    }
}
