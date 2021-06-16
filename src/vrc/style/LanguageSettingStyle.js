import styled from "styled-components/native";

export const BackGroundView = styled.View `
backgroundColor: rgba(0, 0, 0, 0.7);
flexDirection: row;
alignItems: center;
height : 100%;
`;

export const ModalView = styled.View `
backgroundColor: white;
flexDirection: column;
width: 86%;
padding: 5px;
margin: 7%;
borderRadius: 14;
`;

export const Button = styled.TouchableOpacity `
justifyContent: center;
border-radius: 14px;
padding: 14px;
borderWidth: 0;
backgroundColor: #279cff;
margin: 5px;
`;

export const Text = styled.Text `
fontFamily: NetmarbleB;
color: #fff;
text-align: center;
`;