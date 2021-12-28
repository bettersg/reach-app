import {useState, useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import { TextInput } from 'react-native-paper';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { isValidNric } from '@root/utils/validateNric';
import { commonStyles } from '@root/commonStyles';
import { hash } from '@root/utils/cryptography';
import React from 'react';


const NricInput: React.FC<{onScan: () => void}> = ({onScan}) =>{
    const { setIdHash } = useContext(EventContext);
    const [showNricHint, setShowNricHint] = useState(false);

    const handleOnChangeText = useCallback(async (nric) => {
        const nricWrong = !isValidNric(nric);
        setShowNricHint(nricWrong);
        if (setIdHash) {
            const inputIdHash = nricWrong ? undefined : await hash(nric);
            setIdHash(inputIdHash);
        }
    }, []);

    return (
        <View>
            <View style={commonStyles.sideBySide}>
                <TextInput label={'NRIC'} onChangeText={handleOnChangeText} style={{width: '100%'}}/>
                <TouchableOpacity 
                    style={{height: '100%', width: '10%', position: 'absolute', right: 15}} 
                    onPress={onScan}
                >
                    <Image source={require('@root/assets/images/camera-icon.png')} style={{height: '100%', width: '100%', resizeMode: 'contain'}} />
                </TouchableOpacity>
            </View>
            <OptionalVisibility isVisible={showNricHint}>
                <Text style={commonStyles.hintText}>Enter a valid NRIC</Text>
            </OptionalVisibility>
        </View>
    );
};

export default NricInput;