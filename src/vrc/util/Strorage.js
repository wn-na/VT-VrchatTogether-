import AsyncStorage from '@react-native-community/async-storage';

export const getItemAsync = (key) =>
    new Promise((resolve, reject) =>
        AsyncStorage.getItem(key)
        .then(value => resolve(JSON.parse(value)), err => reject(err))
    );

export const setItemAsync = (name, item) => {
    return new Promise((resolve, reject) => {
        AsyncStorage.setItem(name, JSON.stringify(item), (error) => {
            if (error) {
                reject(error);
            }
            resolve('success');
        });
    });
}