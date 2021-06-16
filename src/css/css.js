import { styled } from 'styled-components';

const NetmarbleM = styled`
    fontFamily: 'NetmarbleM',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const NetmarbleL = styled`
    fontFamily: 'NetmarbleL',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const NetmarbleB = styled`
    fontFamily: 'NetmarbleB',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const GodoR = styled`
    fontFamily: 'GodoR',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const GodoL = styled`
    fontFamily: 'GodoL',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const komaco = styled`
    fontFamily: 'komaco',
    color: ${props => props.darkMode ? '#2b3956' : '#2b3956'}
`;

const placeholder = styled`
    fontFamily: 'NetmarbleL',
    color: ${props => props.darkMode ? '#FFF' : '#2b3956'}
`;

const serachBox = styled`
    borderBottomWidth: 1,
    ${props => 
        props.darkMode && css`
            borderBottomColor: '#C1BFC2'
        `
    }
`;

const mainBackground = styled`
    backgroundColor: ${props => props.darkMode ? '#303A45' : '#FFFFFF'}
`;

const mainColor = styled`
    color: ${props => props.darkMode ? '#FFF' : '#2b3956'}
`;

const loginLogo = styled`
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center'
`;

const loginBox = styled`
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center'
`;

const loginTextBox = styled`
    borderBottomWidth: 1,
    borderBottomColor: '#888c8b',
    width: '80%',
    flexDirection: 'row'
`;

const friendListInfo = styled`
    backgroundColor: ${props => props.darkMode ? '#444444' : '#FFFFFF'},
    marginTop: '-10%',
    margin: '5%',
    padding: '2%',
    elevation: 15,
    borderRadius: 10
`;

const freindLogo = styled`
    backgroundColor: ${props => props.darkMode ? '#9C9C9C' : '#5a82dc'},
    paddingTop: '4%',
    paddingLeft: '4%',
    paddingRight: '4%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 100
`;

const logo = styled`
    backgroundColor: ${props => props.darkMode ? '#444444' : '#5a82dc'},
    paddingTop: '3%',
    paddingLeft: '4%',
    paddingRight: '4%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height: 45
`;

const topMain = styled`
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
`;

const myInfo = styled`
    backgroundColor: ${props => props.darkMode ? '#444444' : '#white'},
    textAlign: 'center',
    fontSize: 13,
    margin: '5%',
    padding: '5%',
    color: 'white',
    fontFamily: 'NetmarbleB',
    borderRadius: 10,
    elevation: 10
`;

const myInfoText = styled`
    marginLeft: '3%',
    width: '70%',
    lineHeight: 30,
    ${props => 
        props.darkMode ? css`
            color: '#C1BFC2',
            fontWeight: 'bold'
        `:
        css`color: '#2b3956'`
    }
`;

const friendsCount = styled`
    textAlign: 'center',
    fontSize: 16,
    padding: '10%',
    textAlignVertical: 'top',
    ${props => 
        props.darkMode ? css`
            color: '#C1BFC2',
            fontWeight: 'bold'
        `:
        css`color: '#2b3956'`
    }
`;

const userCount = styled`
    width: '100%',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor:  ${props => props.darkMode ? '#FFFFFF' : '#4d221e1f'}
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5
`;

const userCuserCountBorderount = styled`
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor:  ${props => props.darkMode ? '#FFFFFF' : '#4d221e1f'}
`;

const menu = styled`
    height: '60%'
`;

const textView = styled`
    alignItems: 'center',
    marginTop: '1%'
`;

const textBox = styled`
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#3a4a6d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
`;

const textViewSmall = styled`
    justifyContent: 'space-around',
    marginTop: '1%'
`;

const textBoxSmall = styled`
    width: '50%',
    borderBottomWidth: 1,
    borderBottomColor: '#3a4a6d',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
`;





const tt = styled`
    fontFamily: 'NetmarbleM',
    ${
        props => props.darkMode && css`
        
        `
    }
    color: '#2b3956',
`;