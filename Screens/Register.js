import React, {useState} from 'react';
import { View, Button, Text } from 'react-native';
import FormContainer from "../Shared/Form/FormContainer";
import Input from "../Shared/Form/Input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "../Shared/DatePicker";


const Register = (props) => {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [mode, setMode] = useState('date');
    const [date, setDate] = useState(new Date(1598051730000));
    const [show, setShow] = useState(true);


    const sendRequest = async () => {
        // Construct user data for request
        let user = {
            name,
            username,
            email,
            password,
            birthday,
            gender
        };

        // Send request to server and await response
        let res = await fetch("https://bussin.blakekjohnson.dev/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                user,
            })
        });

        // Reject if status is anything other than 200
        if (res.status !== 200) {
            let data = await res.json();
            console.log(data);
            return;
        }

        // Convert response to a JSON object
        let data = await res.json();

        // Output the token that the server response
        console.log(data.token);
        props.navigation.navigate("User Profile");
    };

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
      };
    

    return (
        <KeyboardAwareScrollView
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
        >

            <FormContainer title={"Register"}>
                <Input
                    placeholder={"Name"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text.toLowerCase())}
                />

                <Input
                    placeholder={"Username"}
                    name={"username"}
                    id={"username"}
                    onChangeText={(text) => setUsername(text.toLowerCase())}
                />

                <Input
                    placeholder={"Email"}
                    name={"email"}
                    id={"email"}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />

                <Input
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <Input
                    placeholder={"Gender"}
                    name={"gender"}
                    id={"gender"}
                    onChangeText={(text) => setGender(text.toLowerCase())}
                />
                <View>
                    {show && (
                     <DatePicker
                         date={date}
                        onChange={onChange}
                    />
                    )}
                </View>
                <View>
                    <Button title={"Register"} onPress={sendRequest} />
                </View>
                <View>
                    <Text>Have an account already?</Text>
                    <Button title={"Login"} onPress={
                        () => props.navigation.navigate("Login")}>
                    </Button>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    )
}

export default Register;