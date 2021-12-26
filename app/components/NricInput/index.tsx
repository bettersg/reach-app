import {useState, useContext, useCallback} from 'react';
import { View, Text } from 'react-native';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import { TextInput } from 'react-native-paper';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { isValidNric } from '@root/utils/validateNric';
import { commonStyles } from '@root/commonStyles';
import { hash } from '@root/utils/cryptography';
import React from 'react';

export default function NricInput() {
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
            <TextInput label={'NRIC'} onChangeText={handleOnChangeText} style={{width: '100%'}}/>
            <OptionalVisibility isVisible={showNricHint}>
                <Text style={commonStyles.hintText}>Enter a valid NRIC</Text>
            </OptionalVisibility>
        </View>
    );
}
