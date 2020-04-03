import React, { Component } from "react";
// common component
import {
    Container,
    Header,
    Content,
    Footer,
    Button,
    Left,
    Right,
    Body,
    Item,
    Label,
    Input,
    H2,
    H1,
    Badge,
    Text,
    SwipeRow,
    Picker,
    Textarea,
    Fab,
    Switch,
    Drawer
} from "native-base";
import {
    Image,
    StyleSheet,
    SectionList,
    FlatList,
    TouchableOpacity,
    ScrollView,
    View,
    TextInput,
    Dimensions,
    Alert,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { Actions } from 'react-native-router-flux';
import utf8 from "utf8";
import base64 from 'base-64';
import { List, ListItem } from "react-native-elements";

export default class AlertSc extends Component {
    constructor(props) {
        console.info("AlertSc => constructor");

        super(props);

        this.state = {
            id:"",
            pw:""
        };
    }

    UNSAFE_componentWillMount() {
        console.info("AlertSc => componentWillMount");
    }

    componentWillUnmount() {
        console.info("AlertSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("AlertSc => componentDidMount");
    }

    render() {
        console.info("AlertSc => render");
        
        return (
            <View>
                <Header style={styles.logo}>
                    <Text>알림</Text>
                </Header>
                <View style={{flex:1,borderWidth:1}}>
                    <ListItem
                        
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:"#fff"
    },
    login: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    info: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor:"red",
        borderWidth:2
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"80%",
        flexDirection:"row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start'
    }
});