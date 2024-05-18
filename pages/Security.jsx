import { View, StyleSheet } from "react-native";
import { useState } from "react";
import { Appbar, Snackbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

import { formStyles } from "../utils/globalStyles";
import { PasswordFormField, SubmitButton } from "../components/FormField";

export default function Security() {
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [hideOldPassword, setHideOldPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmNewPassword, setHideConfirmNewPassword] = useState(true);
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

  const handleHideOldPassword = () =>
    setHideOldPassword((prevHidePassword) => !prevHidePassword);

  const handleHideNewPassword = () =>
    setHideNewPassword((prevHidePassword) => !prevHidePassword);

  const handleHideConfirmNewPassword = () =>
    setHideConfirmNewPassword(
      (prevConfirmHidePassword) => !prevConfirmHidePassword
    );

  //check if data in the form are valid
  const isFormValid = () => {
    const EMPTY = "";
    let errorCount = 0;

    setFormError({ oldPassword: "", newPassword: "", confirmNewPassword: "" });

    //check if password and confirm password matched
    if (newPassword !== confirmNewPassword) {
      setFormError((prevFormError) => {
        return {
          ...prevFormError,
          newPassword: "Password doesnt matched",
          confirmNewPassword: "Password doesnt matched",
        };
      });
      errorCount++;
    }
    //check if password is more than 8 characters
    if (newPassword.length < 8) {
      setFormError((prevFormError) => {
        return { ...prevFormError, newPassword: "Minimum of 8 characters" };
      });
      errorCount++;
    }

    //check if new password is empty
    if (newPassword == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, newPassword: "Required" };
      });
      errorCount++;
    }

    //check if old password is empty
    if (oldPassword == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, oldPassword: "Required" };
      });
      errorCount++;
    }

    //check if confirm password is empty
    if (confirmNewPassword == EMPTY) {
      setFormError((prevFormError) => {
        return { ...prevFormError, confirmNewPassword: "Required" };
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
          password: newPassword,
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
        <Appbar.Content title="Security" />
      </Appbar.Header>

      <View style={styles.content}>
        <View style={[formStyles.form, { marginVertical: 20 }]}>
          <PasswordFormField
            label="Old Password"
            value={oldPassword}
            setValue={setOldPassword}
            formError={formError.oldPassword}
            icon="key"
            hidePassword={hideOldPassword}
            handleHidePassword={handleHideOldPassword}
            isLoading={isLoading}
          />

          <View style={{height: 30}} />

          <PasswordFormField
            label="New Password"
            value={newPassword}
            setValue={setNewPassword}
            formError={formError.newPassword}
            icon="key"
            hidePassword={hideNewPassword}
            handleHidePassword={handleHideNewPassword}
            isLoading={isLoading}
          />

          <PasswordFormField
            label="Confirm Password"
            value={confirmNewPassword}
            setValue={setConfirmNewPassword}
            formError={formError.confirmNewPassword}
            icon="key"
            hidePassword={hideConfirmNewPassword}
            handleHidePassword={handleHideConfirmNewPassword}
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
    paddingHorizontal: 14,
  },
});
