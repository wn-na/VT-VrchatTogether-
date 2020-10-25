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

export default class AvatarListSc extends Component {
    constructor(props) {
        console.info("AvatarListSc => constructor");

        super(props);

        this.state = {

        };
    }

    UNSAFE_componentWillMount() {
        console.info("AvatarListSc => componentWillMount");
    }

    componentWillUnmount() {
        console.info("AvatarListSc => componentWillUnmount");
    }
    componentDidMount() {
        console.info("AvatarListSc => componentDidMount");
    }

    render() {
        console.info("AvatarListSc => render");
        
        return (
			<View style={{flex:1}}>
				<Header style={styles.logo}>
					<Text>아바타 목록</Text>
				</Header>
				<View style={styles.textView}>
					<TextInput
						value={this.state.search}
						onChangeText={(text)=>this.setState({search:text})}
						onSubmitEditing={this.search}
						style={{width:"85%"}}/>
					<Icon
						onPress={this.search}
						name="magnifying-glass" size={30} style={{marginTop:5}}/>
				</View>
				<ScrollView style={styles.list}>
					<FlatList
						style={styles.list}
						data={this.state.mapList}
						refreshing={this.state.refreshing}
						renderItem={({item}) =>
							<View style={{borderWidth:1}}>
								<View>
									<Image
										style={{width:370, height:200, borderRadius:5}}
										source={this.state.refreshing && {url:item.thumbnailImageUrl}}
									/>
								</View>
							</View>
							<View style={{marginLeft:"3%"}}>
								<Text>아바타 이름 : {item.name}</Text>
								<Text>제작자 이름 : {item.authorName}</Text>
								<Text>마지막 업데이트 날짜 : {Moment(item.updated_at).format('LLLL')}</Text>
							</View>
							<View>
								<Button>
									<Text>즐겨찾기 등록</Text>
								</Button>
								<Button>
									<Text>상세보기</Text>
								</Button>
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
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
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
