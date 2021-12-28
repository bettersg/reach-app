import { StyleSheet, PixelRatio, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

// https://developer.apple.com/library/archive/documentation/DeviceInformation/Reference/iOSDeviceCompatibility/Displays/Displays.html
// Specify the desired size on iPhone 10 and iPad, receive the relevant size
export function normalize(mobileSize: number, iPadSize: number) {
    const isMobile = SCREEN_WIDTH < 450;

    if (isMobile) {
        const scale = SCREEN_WIDTH / 375;
        return Math.round(PixelRatio.roundToNearestPixel(mobileSize * scale));
    } else {
        const scale = SCREEN_WIDTH / 834;
        return Math.round(PixelRatio.roundToNearestPixel(iPadSize * scale));
    }
}

export const commonStyles = StyleSheet.create({
    thickPad: {
      paddingHorizontal: normalize(20, 80),
      paddingVertical: normalize(20, 30),
      alignItems: 'center',
      height: '100%'
    },
    hintText: {
        fontSize: normalize(10, 12),
        padding: normalize(5, 10),
        color: 'red',
    },
    actionText: {
        fontSize: normalize(24, 36), 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        width: '100%',
    },
    mainButtonText: {
      fontSize: normalize(15, 18),
      textAlign: 'left'
    },
    menuButton: {
        borderStyle: 'solid', 
        borderWidth: 2, 
        borderColor: '#DDDDDD', 
        width: normalize(350, 450), 
        height: normalize(80, 120), 
        justifyContent: 'center', 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    sideBySide: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
      }
});
  