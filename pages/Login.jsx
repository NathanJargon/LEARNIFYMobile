import { useEffect, useState } from "react";
import { StackActions } from "@react-navigation/native";
import { View } from "react-native";
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
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSecureStore, setSecureStore, removeSecureStore } from "../utils/SecureStore";

export default function Login({ navigation }) {
  const theme = useTheme();

  const signIn = useStore((state) => state.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
  });

  /* Handlers */
  const onDismissSnackBarHandler = () => setServerError("");

  const handleHidePassword = () =>
    setHidePassword((prevHidePassword) => !prevHidePassword);

  //check if data in the form are valid
  const isFormValid = () => {
    const EMPTY = "";
    let errorCount = 0;

    setFormError({ email: "", password: "" });

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

    //if error is less than or equal to zero means the form is valid
    return errorCount <= 0;
  };

  const handleSubmitForm = () => {
    if (isFormValid()) login();
  };

  async function login() {
    try {
      setIsLoading(true);

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          if (!user) {
            setServerError("Login failed");
            return;
          }

          signIn(user.uid);
          setSecureStore("userToken", user.uid);

          AsyncStorage.setItem('email', email).then(() => {
            console.log('Email saved to AsyncStorage');
          });

          AsyncStorage.setItem('password', password).then(() => {
            console.log('Password saved to AsyncStorage');
          });
        })
        .catch((error) => {
          setServerError(error.message);
        });
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    AsyncStorage.getItem('email').then(storedEmail => {
      AsyncStorage.getItem('password').then(storedPassword => {
        if (storedEmail && storedPassword) {
          console.log(`Email: ${storedEmail}`);
          console.log(`Password: ${storedPassword}`);
          setEmail(storedEmail);
          setPassword(storedPassword);
          login();
        }
      });
    });
  }, []);

  return (
    <View style={formStyles.container}>
      <AppBar
        style={formStyles.header}
        title="Log In"
        titleSize={26}
        logoSize={75}
        hasStarIcon={true}
      />

      <View style={formStyles.form}>
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

        <SubmitButton
          isLoading={isLoading}
          handleSubmitForm={handleSubmitForm}
          label="Login"
        />
      </View>

      <View style={formStyles.navLink}>
        <Text style={{ color: theme.colors.secondary }}>
          Don’t have an account?
        </Text>
        <Button
          disabled={isLoading}
          rippleColor="white"
          theme={{ roundness: 2 }}
          onPress={() => navigation.dispatch(StackActions.replace("Signup"))}
        >
          Sign up
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
    </View>
  );
}
