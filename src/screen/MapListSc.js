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
    List,
    ListItem,
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

export default class MapListSc extends Component {
    constructor(props) {
        console.info("MapListSc => constructor");

        super(props);

        this.state = {
            
        };
    }

    UNSAFE_componentWillMount() {
        console.info("MapListSc => componentWillMount");
    }

    componentWillUnmount() {
        console.info("MapListSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("MapListSc => componentDidMount");
    }

    render() {
        console.info("MapListSc => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>맵 목록</Text>
                </Header>
                <ScrollView style={{borderWidth:1}}>
                    <FlatList
                        style={styles.list}
                        data={this.state.getAavatar}
                        // onRefresh={this.reset.bind(this)}
                        refreshing={this.state.refreshing}
                        renderItem={({item}) => 
                            <View style={{borderWidth:1}}>
                                <View
                                style={{flexDirection:"row",padding:"5%"}}>
                                    <View>
                                        <Image
                                            style={{width: 100, height: 100, borderRadius:20}}
                                            source={{uri:item.imageUrl}}
                                        />
                                    </View>
                                    <View style={{marginLeft:"3%"}}>
                                    <Text>{item.name}</Text>
                                    <Text>{item.authorName}</Text>
                                    <Text>{item.updated_at}</Text>
                                    </View>    
                                </View>
                                <View style={{flexDirection:"row",width:"100%",paddingLeft:"5%",paddingRight:"5%",marginBottom:"3.5%"}}>
                                    <Button
                                    style={{marginRight:15,width:"48%",justifyContent:"center"}}>
                                        <Text>즐겨찾기 해제</Text>
                                    </Button>
                                    <Button
                                    onPress={()=>Actions.friendDetail({userId:item.authorId,friendCheck:"false"})}
                                    style={{width:"48%",justifyContent:"center"}}>
                                        <Text>상세보기</Text>
                                    </Button>
                                </View>
                            </View>
                        }
                    />
                </ScrollView>
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