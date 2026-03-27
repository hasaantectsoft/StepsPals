import { StyleSheet } from 'react-native';
import { Theme } from '../../libs';
import { s } from 'react-native-size-matters';

export const Styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        marginTop: s(20)    ,
    },
    text: {
        marginTop: s(20),
        marginBottom: s(20),
        fontFamily: Theme.typography.Retro.fontFamily,
        textAlign: 'center',
        color: 'black',
    },
});
