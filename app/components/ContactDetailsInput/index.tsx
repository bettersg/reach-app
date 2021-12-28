import {useState, useContext, useCallback} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {EventContext} from '@root/navigation/providers/CheckinProvider';
import { TextInput } from 'react-native-paper';
import OptionalVisibility from '@root/components/OptionalVisibility';
import { commonStyles } from '@root/commonStyles';
import React from 'react';
import { Spacer } from '..';

export default function ContactDetailsInput() {
    const { setFirstName, setLastName, setPhone } = useContext(EventContext);
    const [showFirstNameHint, setShowFirstNameHint] = useState(false);
    const [showLastNameHint, setShowLastNameHint] = useState(false);
    const [showPhoneHint, setShowPhoneHint] = useState(false);

    const handleOnChangeFirstName = useCallback((inputFirstName) => {
        const firstNameValid = inputFirstName.length !== 0;
        setShowFirstNameHint(!firstNameValid);
        setFirstName!(firstNameValid ? inputFirstName : undefined);
    }, []);

    const handleOnChangeLastName = useCallback((inputLastName) => {
        const lastNameValid = inputLastName.length !== 0;
        setShowLastNameHint(!lastNameValid);
        setLastName!(lastNameValid ? inputLastName : undefined);
    }, []);

    const handleOnChangePhone = useCallback((inputPhone) => {
        const phoneValid = inputPhone.length === 8 && ['6', '8', '9'].includes(inputPhone.slice(0, 1));
        setShowPhoneHint(!phoneValid);
        setPhone!(phoneValid ? inputPhone : undefined);
    }, []);

    return (
        <View style={commonStyles.thickPad}>
            <View style={commonStyles.sideBySide}>
                <View style={{flex: 3}}>
                    <TextInput label={'First name'} onChangeText={handleOnChangeFirstName}/>
                    <OptionalVisibility isVisible={showFirstNameHint}><Text style={commonStyles.hintText}>Enter your first name</Text></OptionalVisibility>
                </View>
                <View style={{paddingHorizontal: 5}}/>
                <View style={{flex: 2}}>
                    <TextInput label={'Last name'} onChangeText={handleOnChangeLastName}/>
                    <OptionalVisibility isVisible={showLastNameHint}><Text style={commonStyles.hintText}>Enter your last name</Text></OptionalVisibility>
                </View>
            </View>
            <Spacer/>
            <View style={commonStyles.sideBySide}>
                <View style ={{flex: 1}}>
                    <TextInput style={{width: '100%'}} label={'Phone number'} onChangeText={handleOnChangePhone}/>
                    <OptionalVisibility isVisible={showPhoneHint}>
                        <Text style={commonStyles.hintText}>Enter a valid phone number</Text>
                    </OptionalVisibility>
                </View>
            </View>
        </View>
    );
}
