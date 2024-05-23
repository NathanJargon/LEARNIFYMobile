import { useEffect, useState } from "react";
import { StackActions } from "@react-navigation/native";
import { View } from "react-native";
import { Button, Text, useTheme, Snackbar } from "react-native-paper";
import { formStyles } from "../utils/globalStyles";
import AppBar from "../components/AppBar";
import baseURL from "../utils/baseURL";
import {
  TextFormField,
  PasswordFormField,
  SubmitButton,
} from "../components/FormField";
import { firebase } from "../utils/FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

export default function Login({ navigation }) {
  const theme = useTheme();
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


  useEffect(() => {
    const testAsyncStorage = async () => {
      try {
        await AsyncStorage.setItem('testKey', 'testValue');
        const value = await AsyncStorage.getItem('testKey');
        console.log(value); // Should log 'testValue'
      } catch (e) {
        console.log(e); // Logs any errors
      }
    };
  
    testAsyncStorage();
  }, []);

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
    if (password.length < 6) {
      setFormError((prevFormError) => {
        return { ...prevFormError, password: "Minimum of 6 characters" };
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
  
      // Get Firestore instance
      const db = getFirestore();
  
      // Create a query against the collection.
      const q = query(collection(db, "users"), where("email", "==", email));
  
      const querySnapshot = await getDocs(q);
      let userExists = false;
  
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        if (doc.data().password === password) {
          userExists = true;
          // Save user data to AsyncStorage
          AsyncStorage.setItem('userToken', doc.id);
          console.log('User token saved to AsyncStorage');
    
          AsyncStorage.setItem('email', email);
          console.log('Email saved to AsyncStorage');
    
          AsyncStorage.setItem('password', password);
          console.log('Password saved to AsyncStorage');

          navigation.navigate("Main");
        }
      });
  
      if (!userExists) {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  
  useEffect(() => {
    AsyncStorage.getItem('userToken').then(userToken => {
      if (userToken) {
        AsyncStorage.getItem('email').then(storedEmail => {
          AsyncStorage.getItem('password').then(storedPassword => {
            if (storedEmail && storedPassword) {
              console.log(`Email: ${storedEmail}`);
              console.log(`Password: ${storedPassword}`);
              setEmail(storedEmail);
              setPassword(storedPassword);
              navigation.navigate("Main");
            }
          });
        });
      }
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
