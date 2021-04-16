import React, { useEffect, useState } from 'react';
import { Image, View, Platform , Button, Text, Alert, TouchableOpacity} from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';


const ModifyAcc = (props) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [accountChanged, setAccountChanged] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [image, setImage] = useState(null);

    const sendRequest = async () => {
        setWaiting(true);
        // Construct user data for request
        let user = {
        };
        if (username != '') user.username = username;
        if (name != '') user.name = name;

        // Get token
        let token = await AsyncStorage.getItem('@bussin-token');

        if (!token) return;

        // If there is an image provided then upload as new profile photo
        if (image) {
            let res = await fetch("https://bussin.blakekjohnson.dev/api/photo", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: image,
                }),
            });

            console.log(res.status);
        }

        // Send request to server and await response
        let res = await fetch("https://bussin.blakekjohnson.dev/api/user", {
            method: "PATCH",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                update: user,
            })
        });

        // Reject if status is anything other than 200
        if (res.status !== 200) {
            let data = await res.json();
            console.log(data);
            return;
        }

        setAccountChanged(true);
    };

    useEffect(() => {
        props.navigation.addListener('focus', () => {
            setName("");
            setUsername("");
        });
    }, []);

    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);

    useEffect(() => {
        if (accountChanged) {
            setWaiting(false);
            setAccountChanged(false);

            props.navigation.navigate('User Profile');
        }
    }, [accountChanged]);

    const createDeleteAlert = () =>
        Alert.alert(
            "Delete Account",
            "You will not be able to recover your account.",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Delete", onPress: deleteProfile }
            ],
            { cancelable: false }
        );

    const deleteProfile = async () => {
        let token = await AsyncStorage.getItem('@bussin-token');
        if (!token) return token;

        let res = await fetch('https://bussin.blakekjohnson.dev/api/user', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res = await res.json();

        logOut();
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.0625,
          base64: true,
        });
    
        if (!result.cancelled) {
          setImage(`data:image/jpeg;base64,${result.base64}`);
        }
      };


    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Modify Account"}>
                <Input
                    placeholder={"Change name"}
                    name={"name"}
                    id={"name"}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />

                <Input
                    placeholder={"Change username"}
                    name={"username"}
                    id={"username"}
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                <View>
                    <Button title={"Save"} onPress={sendRequest} disabled={waiting} />
                </View>
                <View>
                    <Button title={"Change Password"} disabled={waiting} onPress={
                        () => props.navigation.navigate("EditPassword")}>
                    </Button>
                    <Button title='Delete Account' onPress={createDeleteAlert} />
                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button title="Upload Profile Photo" onPress={pickImage} />
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default ModifyAcc;