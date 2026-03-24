import { StyleSheet } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { combineStyles } from '../../libs/combineStyle';

export const Styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.90)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: scale(20),
    justifyContent: 'center',
  },
  bgImage: {

    width: moderateScale(170),
    height: moderateScale(170),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  petImage: {
    width: "100%",
    height: "100%",
    resizeMode: 'contain',
  },
  modalContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(25),
    paddingVertical: moderateScale(30),
    gap: moderateScale(15),
  },
  title: {
    ...combineStyles.regular26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  description: {
    ...combineStyles.regular14,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: moderateScale(22),
  },
  petNameYellow: {
    ...combineStyles.regular14,
    color: '#FFFF00',
  },
  buttonContainer: {
    width: '100%',
    gap: moderateScale(12),
    marginTop: moderateScale(10),
  },
  reviveButton: {
    backgroundColor: '#00FF00',
    paddingVertical: moderateScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviveButtonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#000000',
  },
  startOverButton: {
    backgroundColor: '#FFA500',
    paddingVertical: moderateScale(12),
    paddingHorizontal: scale(20),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  startOverButtonText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  button: {

    width: moderateScale(150),
    height: moderateScale(60),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  btnTxt: {
    ...combineStyles.regular10,
    top: moderateScale(5),
  },
  petName: {
    ...combineStyles.regular16,
    fontSize:moderateScale(10),
    width:moderateScale(120),
    textAlign:"center",
    
    
  },
  birthDate: {
    ...combineStyles.regular6,
    fontSize:moderateScale(5),

     position:"absolute",
  bottom: moderateScale(40),
  },
  deathDate: {
    ...combineStyles.regular6,
    fontSize:moderateScale(5),
    
  position:"absolute",
  bottom: moderateScale(30),
  },
});

