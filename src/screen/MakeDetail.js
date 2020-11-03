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
    AsyncStorage,
    Picker,
    TouchableOpacityBase,
    RefreshControl,
    ToastAndroid
} from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import { Actions } from 'react-native-router-flux';

export default class MakeDetail extends Component {
    constructor(props) {
        console.info("MakeDetail => constructor");

        super(props);

        this.state = {
            getAvatars:[],
            getWorlds:[],
            refreshing:false,
            refreshTime:false,
            option:"avatar",
        };
    }

    UNSAFE_componentWillMount() {
        console.info("MakeDetail => componentWillMount");
        this.getAvatars();
        this.getWorlds();
    }

    componentWillUnmount() {
        console.info("MakeDetail => componentWillUnmount");
    }

    componentDidMount() {
        console.info("MakeDetail => componentDidMount");
    }

    async getAvatars() {
        console.info("MakeDetail => getAvatars");

        await fetch("https://api.vrchat.cloud/api/1/avatars?userId="+this.props.userId,{
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log("아바타 :",json)
            this.setState({
                getAvatars:json
            })
        })
    }

    async getWorlds() {
        console.info("MakeDetail => getWorlds");

        await fetch("https://api.vrchat.cloud/api/1/worlds?userId="+this.props.userId,{
            method: "GET",
            headers: {
                "Accept": "application/json",
                "User-Agent":"VT",
                "Content-Type": "application/json",
            }
        })
        .then(response => response.json())
        .then(json => {
            console.log("월드 :",json)
            this.setState({
                getWorlds:json
            })
        })
    }

    avatarList() {
        console.info("MakeDetail => avatarList");

        if(this.state.getAvatars.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>아바타내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }

        return <FlatList
        data={this.state.getAvatars}
        renderItem={({item}) => 
            <View style={{flexDirection:"row", padding:"5%", borderWidth:1}}>
                <View>
                    <Image
                        style={{width: 100, height: 100, borderRadius:20}}
                        source={{
                            uri: item.thumbnailImageUrl,
                            method: "get",
                            headers: {
                                "User-Agent":"VT"
                            }
                        }}
                    />
                </View>
                <View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
                    <View style={{alignItems:"flex-start"}}>
                        <Text>
                            {item.name}
                        </Text>
                        <Text>
                            {item.authorName}
                        </Text>
                        <Text style={{marginTop:"3%"}}>
                            {item.updated_at.substring(0,10)}
                        </Text>
                    </View>
                    <View style={{position:"absolute",top:"-10%",left:"63%"}}>
                        <Icon name="magnifying-glass" size={30} style={{alignItems:"flex-start",marginTop:5}}/>
                    </View>
                </View>
            </View>
        }
        />
    }

    worldList() {
        console.info("MakeDetail => worldList");

        if(this.state.getWorlds.length < 1)
        {
            return <View style={{paddingTop:"50%",paddingBottom:"2%",alignItems:"center"}}>
                <View>
                <Text>월드내역이 존재하지 않습니다.</Text>
                </View>
            </View>
        }

        return <FlatList
        data={this.state.getWorlds}
        renderItem={({item}) => 
            <View style={{flexDirection:"row", padding:"5%", borderWidth:1}}>
                <View>
                    <Image
                        style={{width: 100, height: 100, borderRadius:20}}
                        source={{
                            uri: item.thumbnailImageUrl,
                            method: "get",
                            headers: {
                                "User-Agent":"VT"
                            }
                        }}
                    />
                </View>
                <View style={{width:"100%",marginLeft:"3%",flexDirection:"row"}}>
                    <View style={{alignItems:"flex-start",flex:1}}>
                        <Text style={{width:"70%"}}>
                            {item.name}
                        </Text>
                        <Text>
                            {item.authorName}
                        </Text>
                        <Text style={{marginTop:"3%"}}>
                            {item.updated_at.substring(0,10)}
                        </Text>
                    </View>
                    <View style={{position:"absolute",top:"-10%",left:"63%"}}>
                        <Icon name="star-outlined" size={30} style={{alignItems:"flex-start",marginTop:5}}/>
                    </View>
                </View>
            </View>
        }
        />
    }

    reset() {
        console.info("MakeDetail => reset");

        if(this.state.refreshTime == false)
        {
            this.state.refreshTime = true;

            setTimeout(() => {
                this.state.refreshTime = false;
            }, 5000);

            this.getAvatars();
            this.getWorlds();

            this.setState({
                refreshing:false,
            });
        }
        else
        {
            ToastAndroid.show("새로고침은 5초에 한번 가능합니다.", ToastAndroid.SHORT);
        }
    }

    filter = value => {
        console.info("MakeDetail => filter");

        this.setState({
            option:value
        });
    }

    search = () => {
        console.info("MakeDetail => search");
        let serachCheck;

        if(this.state.search == null || this.state.search == "")
        {
            Alert.alert(
                '오류',
                '검색어를 입력해주세요.',
                [{text: "확인"}]
            );
        }
        else
        {
            if(this.state.getAvatars != null || this.state.getWorlds)
            {
                if(this.state.option == "avatar")
                {
                    serachCheck = this.state.getAvatars.filter((v) => v.name.indexOf(this.state.search) !== -1)
                }
                if(this.state.option == "world")
                {
                    serachCheck = this.state.getWorlds.filter((v) => v.name.indexOf(this.state.search) !== -1)
                }
            }
            if(serachCheck.length == 0)
            {
                Alert.alert(
                    '오류',
                    '검색결과가 존재하지 않습니다.',
                    [{text: "확인"}]
                );
            }
            else
            {
                if(this.state.option == "avatar")
                {
                    this.setState({
                        getAvatars:serachCheck
                    });
                }
                if(this.state.option == "world")
                {
                    this.setState({
                        getWorlds:serachCheck
                    });
                }
                
            }
        }
    }

    render() {
        console.info("MakeDetail => render");
        
        return (
            <View style={{flex:1}}>
                <Header style={styles.logo}>
                    <Text>
                        제작정보
                    </Text>
                </Header>
                <ScrollView 
                    refreshControl={
                        <RefreshControl
                            onRefresh={this.reset.bind(this)}
                            refreshing={this.state.refreshing}
                        />
                    }
                >
                    <View style={styles.textView}>
                        <TextInput 
                            value={this.state.search}
                            onChangeText={(text)=>this.setState({search:text})}
                            onSubmitEditing={this.search}
                            style={{width:"85%"}}
                        />
                        <Icon 
                        onPress={this.search}
                        name="magnifying-glass" size={30} style={{marginTop:5}}/>
                    </View>
                    <View style={{alignItems:"flex-end",marginRight:"2%"}}>
                        <View style={styles.selectView}>
                            <Picker 
                                selectedValue = {this.state.option}
                                onValueChange= {this.filter}
                            >
                                <Picker.Item label = "아바타" value = "avatar" />
                                <Picker.Item label = "월드" value = "world" />
                            </Picker>
                        </View>
                    </View>
                    {this.state.option == "avatar" ? this.avatarList() : this.worldList()}
                    
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
    worldInfo: {
        flex: 1,
        width:"90%",
        padding:10,
        borderWidth:1,
        marginLeft:"5%"
    },
    list:{
        width:"97%",
        marginLeft:"1.5%"
    },
    textView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"95%",
        marginLeft:"2%",
        flexDirection:"row",
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"35%",
        marginLeft:"2%",
        marginTop:"5%",
        marginBottom:"5%"
    }
});