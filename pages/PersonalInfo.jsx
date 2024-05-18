import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Appbar, Avatar, Snackbar } from "react-native-paper";
import { TextFormField, SubmitButton } from "../components/FormField";
import { useNavigation } from "@react-navigation/native";

import { formStyles } from "../utils/globalStyles";

export default function PersonalInfo() {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    
  }, []);

  const getUserPersonalInfo = async () => {
    try {
      //get user name and email to populate the fields

      const url = `${socketAddress}/api/`;
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      //if signup failed display error message
      if (!data["success"]) {
        setServerError(data.message);
      }
      else {
        //populate name and email textfields of the user
        setName(data.name);
        setEmail(data.email);
      }
    } catch (error) {
      setServerError(error.message);
    }
  }


  /* Handlers */
  const onDismissSnackBarHandler = () => setServerError("");

  //check if data in the form are valid
  const isFormValid = () => {
    const EMPTY = "";
    let errorCount = 0;

    setFormError({ name: "", email: "" });

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

    //if error is less than or equal to zero means the form is valid
    return errorCount <= 0;
  };

  const handleSubmitForm = () => {
    if (isFormValid()) editProfile();
  };

  async function editProfile() {
    try {
      setIsLoading(true);

      const url = `${socketAddress}/api/`;
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
        }),
      };
      const res = await fetch(url, requestOptions);
      const data = await res.json();

      //if signup failed display error message
      if (!data["success"]) {
        setServerError(data.message);
      }
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.background }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Personal Info" />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={styles.profile}>
          <Avatar.Image
            size={90}
            style={{ backgroundColor: "white" }}
            source={{
              uri: "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png",
            }}
          />
        </View>

        <View style={[formStyles.form, { marginVertical: 20 }]}>
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

          <SubmitButton
            isLoading={isLoading}
            handleSubmitForm={handleSubmitForm}
            label="Save"
          />

          {/* Display server error response */}
          <Snackbar
            style={formStyles.snackBar}
            visible={serverError}
            onDismiss={onDismissSnackBarHandler}
          >
            {serverError}
          </Snackbar>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingVertical: 30,
    paddingHorizontal: 14,
  },
  profile: {
    alignSelf: "center",
  },
});
