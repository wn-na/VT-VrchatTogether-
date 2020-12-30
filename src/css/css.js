
import {
    StyleSheet,
    Dimensions
} from 'react-native';

export default StyleSheet.create({
    NetmarbleM: {
        fontFamily:"NetmarbleM",
        color:"#2b3956"
    },
    NetmarbleL: {
        fontFamily:"NetmarbleL",
        color:"#2b3956"
    },
    NetmarbleB: {
        fontFamily:"NetmarbleB",
        color:"#2b3956"
    },
    GodoR: {
        fontFamily:"GodoR",
        color:"#2b3956"
    },
    GodoL: {
        fontFamily:"GodoL",
        color:"#2b3956"
    },
    Komako: {
        fontFamily:"komaco",
        color:"#2b3956"
    },
    loginLogo: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginBox: {
        flex: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginTextBox: {
        borderBottomWidth:1,
        borderBottomColor:"#888c8b",
        width:"80%",
        flexDirection:"row",
    },
    freindLogo: {
        paddingTop:"4%",
        paddingLeft:"4%",
        paddingRight:"4%",
        alignItems: "flex-start",
        justifyContent:"space-between",
        flexDirection:"row",
        backgroundColor:"#5a82dc",
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:100
    },
    logo: {
        paddingTop:"3%",
        paddingLeft:"4%",
        paddingRight:"4%",
        alignItems: "flex-start",
        justifyContent:"space-between",
        flexDirection:"row",
        backgroundColor:"#5a82dc",
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        height:45
    },
    topMain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    myInfo: {
        textAlign:"center",
        fontSize:13,
        margin:"5%",
        padding:"5%",
        color:"white",
        fontFamily:"NetmarbleB",
        borderRadius:10,
        backgroundColor:"white",
        elevation:10
    },
    myInfoText: {
        marginLeft:"3%",
        width:"70%",
        lineHeight:30,
        color:"#2b3956"
    },
    friendsCount: {
        textAlign:"center",
        fontSize:16,
        padding:"10%",
        color:"#2b3956",
        textAlignVertical:"top"
    },
    userCount :{
        width:"100%",
        flexDirection:"row",
        borderTopWidth:1,
        borderColor:"#4d221e1f",
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:5,
        paddingRight:5
    },
    menu: {
        flex:3.5
    },
    textView: {
        alignItems:"center",
        marginTop:"1%"
    },
    textBox: {
        width:"80%",
        borderBottomWidth:1,
        borderBottomColor:"#3a4a6d",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
    },
    textViewSmall: {
        justifyContent:"space-around",
        marginTop:"1%"
    },
    textBoxSmall: {
        width:"50%",
        borderBottomWidth:1,
        borderBottomColor:"#3a4a6d",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"flex-end",
    },
    selectView:{
        borderBottomWidth:1,
        borderBottomColor:"#000",
        width:"35%",
        marginLeft:"2%",
        marginBottom:"5%"
    },
    infoButton:{
        backgroundColor:"white",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:10,
        width:"80%",
        height:"90%",
        margin:5,
        borderRadius:15,
        elevation:5
    },
    infoButtonText: {
        marginTop:"10%",
        color:"#2b3956",
        fontSize:15,
    },
    mapTag: {
        textAlign: 'center',
        width:"20%",
        color:"#3a4a6d",
        minWidth: 90,
        justifyContent:"center",
        textAlignVertical:"center"
    },
    mapSelectTag: {
        textAlign: 'center',
        justifyContent:"center",
        width:"20%",
        color:"#3a4a6d",
        minWidth: 90,
        borderBottomWidth:4,
        borderBottomColor:"#5a82dc",
        textAlignVertical:"center",
        fontFamily:"NetmarbleB",
    },
    worldInfo: {
        borderWidth:1,
        borderRadius:2.8,
        borderColor:"#4d221e1f",
        padding:"5%"
    },
    worldInfoDetail: {
        borderWidth:1,
        borderRadius:2.8,
        borderColor:"#4d221e1f",
        padding:"5%",
        marginTop:"5%",
        margin:"7%"
    },
    worldIcon: {
        position:"absolute",
        color: "#FFBB00",
        right:"2%",
        top:"10%",
        zIndex:2
    },
    friendList: {
        borderWidth:1,
        borderRadius:10,
        borderColor:"#4d221e1f",
        marginBottom:"5%",
        alignItems:"flex-end",
        marginLeft:"5%",
        marginRight:"5%",
        elevation:5,
    },
    friendListView: {
        flexDirection:"row",
        width:"97%",
        padding:"5%",
        borderRadius:9,
        backgroundColor:"white"
    },
    friendInfoText: {
        marginLeft:"3%",
        width:"70%",
        lineHeight:30,
        color:"#2b3956"
    },
    avatarList: {
        borderWidth:1,
        borderRadius:10,
        borderColor:"#4d221e1f",
        backgroundColor:"#9ccbeb",
        marginBottom:"5%",
        alignItems:"flex-end",
        marginLeft:"5%",
        marginRight:"5%",
        elevation:5,
    },
    avatarListView: {
        flexDirection:"row",
        width:"97%",
        padding:"5%",
        borderRadius:9,
        backgroundColor:"white"
    },
    groupButton: {
        marginTop:10,
        margin:15,
        justifyContent:"center",
        backgroundColor:"#fff",
        color:"#000"
    },
    requestButton: {
        justifyContent:"center",
        borderRadius: 4.3,
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#b3e59f"
    },
    selectedMenuGroup:{
        color:"#2b3956",
        paddingTop:"1%",
        paddingBottom:"1%",
        paddingLeft:"2%",
        paddingRight:"2%",
        marginLeft:"2%",
        marginRight:"2%",
        borderBottomWidth:1,
        borderColor:"red"
    },
    menuGroup:{
        color:"#2b3956",
        paddingTop:"1%",
        paddingBottom:"1%",
        paddingLeft:"2%",
        paddingRight:"2%",
        marginLeft:"2%",
        marginRight:"2%"
    },
    userOption: {
        flex:1,
        padding:20,
        margin:10,
        borderBottomWidth:3,
        borderColor:"#dcdcdc"
    },
    userOptionBox: {
        flexDirection:"row",
        marginTop:20
    },
    setting: {
        flex:5,
        padding:20
    },
    settingMenu: {
        flexDirection:"row",
        alignItems:"center",
        marginTop:10,
        marginBottom:10
    },
    settingMenuImage: {
        marginRight: 15,
        width:25,
        height:25,
        resizeMode:"contain"
    }
});