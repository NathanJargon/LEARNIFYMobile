import { useState } from "react";
import { StackActions } from "@react-navigation/native";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { Button, Text, useTheme, Snackbar } from "react-native-paper";

import { formStyles } from "../utils/globalStyles";
import useStore from "../hooks/useStore";
import AppBar from "../components/AppBar";
import baseURL from "../utils/baseURL";
import {
  TextFormField,
  PasswordFormField,
  SubmitButton,
} from "../components/FormField";
import { firebase } from "../utils/FirebaseConfig";

export default function Signup({ navigation }) {
  const theme = useTheme();

  const signIn = useStore((state) => state.signIn);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* Handlers */
  const onDismissSnackBarHandler = () => setServerError("");

  const handleHidePassword = () =>
    setHidePassword((prevHidePassword) => !prevHidePassword);

  const handleConfirmHidePassword = () =>
    setHideConfirmPassword(
      (prevConfirmHidePassword) => !prevConfirmHidePassword
    );

  //check if data in the form are valid
  const isFormValid = () => {
    const EMPTY = "";
    let errorCount = 0;

    setFormError({ email: "", password: "" });

    //check if email is empty
    if (name == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, name: "Required" };
      });
      errorCount++;
    }
    //check if email has @ and .com
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError((prevFormError) => {
        return { ...prevFormError, email: "Invalid email" };
      });
      errorCount++;
    }
    //check if email is empty
    if (email == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, email: "Required" };
      });
      errorCount++;
    }
    //check if password and confirm password matched
    if (password !== confirmPassword) {
      setFormError((prevFormError) => {
        return {
          ...prevFormError,
          password: "Password doesnt matched",
          confirmPassword: "Password doesnt matched",
        };
      });
      errorCount++;
    }
    console.log(/[A-Z]/.test(password))
    //check if password have at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      setFormError((prevFormError) => {
        return {
          ...prevFormError,
          password: "Should have atleast 1 uppercase character",
        };
      });
      errorCount++;
    }

    //check if password is more than 8 characters
    if (password.length < 8) {
      setFormError((prevFormError) => {
        return { ...prevFormError, password: "Minimum of 8 characters" };
      });
      errorCount++;
    }

    //check if password is empty
    if (password == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, password: "Required" };
      });
      errorCount++;
    }

    //check if confirm password is empty
    if (confirmPassword == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, confirmPassword: "Required" };
      });
      errorCount++;
    }

    //if error is less than or equal to zero means the form is valid
    return errorCount <= 0;
  };

  const handleSubmitForm = () => {
    if (isFormValid()) signup();
  };

    async function signup() {
      try {
        setIsLoading(true);

        if (!isFormValid()) {
          return;
        }

        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (!user) {
          setServerError("Signup failed");
          return;
        }

        const db = firebase.firestore();

        await db.collection("users").doc(email).set({
          email: email,
          uid: user.uid,
          password: password,
          notification: [
            {
              imageUri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnfAxGV-fZxGL9elM_hQ2tp7skLeSwMyUiwo4lMm1zyA&s",
              text: "Welcome to Learnify!"
            }
          ],
        });

        signIn(user.uid);
        setSecureStore("userToken", user.uid);
      } catch (error) {
        setServerError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

  return (
    <ScrollView
      contentContainerStyle={[
        formStyles.container,
        { justifyContent: "flex-start" },
      ]}
    >
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={0}>
        <AppBar
          style={formStyles.header}
          title="Sign Up"
          titleSize={26}
          logoSize={75}
          hasStarIcon={true}
        />

        <View style={formStyles.form}>
          <TextFormField
            label="Name"
            value={name}
            setValue={setName}
            formError={formError.name}
            icon="account"
            isLoading={isLoading}
          />
          <TextFormField
            label="Email"
            value={email}
            setValue={setEmail}
            formError={formError.email}
            icon="email"
            isLoading={isLoading}
          />

          <PasswordFormField
            label="Password"
            value={password}
            setValue={setPassword}
            formError={formError.password}
            icon="key"
            hidePassword={hidePassword}
            handleHidePassword={handleHidePassword}
            isLoading={isLoading}
          />

          <PasswordFormField
            label="Confirm Password"
            value={confirmPassword}
            setValue={setConfirmPassword}
            formError={formError.confirmPassword}
            icon="key"
            hidePassword={hideConfirmPassword}
            handleHidePassword={handleConfirmHidePassword}
            isLoading={isLoading}
          />

          <SubmitButton
            isLoading={isLoading}
            handleSubmitForm={handleSubmitForm}
            label="Create Account"
          />
        </View>
      </KeyboardAvoidingView>

      <View style={formStyles.navLink}>
        <Text style={{ color: theme.colors.secondary }}>
          Already have an account?
        </Text>
        <Button
          disabled={isLoading}
          rippleColor="white"
          theme={{ roundness: 2 }}
          onPress={() => navigation.dispatch(StackActions.replace("Login"))}
        >
          Login
        </Button>
      </View>

      {/* Display server error response */}
      <Snackbar
        style={formStyles.snackBar}
        visible={serverError}
        onDismiss={onDismissSnackBarHandler}
      >
        {serverError}
      </Snackbar>
    </ScrollView>
  );
}
