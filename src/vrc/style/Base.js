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
borderRadius: 14px;
`;

export const Text = styled.Text `
color: #fff;
text-align: center;
fontFamily: ${ prop => prop.bold ? 'NetmarbleB' : 'NetmarbleL' };
color: ${ prop => prop.color ?? 'black' };
fontSize: ${ prop => prop.fontSize ?? 16 }px;
textAlign: ${ prop => prop.textAlign ?? 'center' };
`;