import React from 'react';
import { Text } from 'native-base';
import styles from '../css/css';

export const NetmarbleM = props => <Text onPress={props.onPress} style={[styles.NetmarbleM,props.style]}>{props.children}</Text>
export const NetmarbleL = props => <Text onPress={props.onPress} style={[styles.NetmarbleL,props.style]}>{props.children}</Text>
export const NetmarbleB = props => <Text onPress={props.onPress} style={[styles.NetmarbleB,props.style]}>{props.children}</Text>

export const GodoR = props => <Text onPress={props.onPress} style={[styles.GodoR,props.style]}>{props.children}</Text>
export const GodoL = props => <Text onPress={props.onPress} style={[styles.GodoL,props.style]}>{props.children}</Text>