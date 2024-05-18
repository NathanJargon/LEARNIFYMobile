import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Snackbar,
} from "react-native-paper";

import { formStyles } from "../utils/globalStyles";

export function SubmitButton({ isLoading, handleSubmitForm, label }) {
  return (
    <Button
      loading={isLoading}
      disabled={isLoading}
      theme={{ roundness: 2 }}
      style={{ marginTop: 12 }}
      mode="contained"
      onPress={handleSubmitForm}
    >
      <Text
        style={[
          formStyles.submitButtonLabel,
          { color: theme.colors.onPrimary },
        ]}
      >
        {label}
      </Text>
    </Button>
  );
}

export function PasswordFormField({
  label,
  value,
  setValue,
  hidePassword,
  handleHidePassword,
  formError,
  icon,
  isLoading,
}) {
  const theme = useTheme();

  return (
    <View style={formStyles.formGroup}>
      <Text
        style={[formStyles.fieldLabel, formError && formStyles.errorfieldLabel]}
      >
        {label}
      </Text>
      <View style={formStyles.formControlFieldWrapper}>
        <TextInput
          disabled={isLoading}
          mode="outlined"
          secureTextEntry={hidePassword}
          outlineColor="lightgray"
          theme={{ roundness: 10 }}
          style={[
            formStyles.formControl,
            { backgroundColor: theme.colors.background },
          ]}
          value={value}
          onChangeText={setValue}
          error={formError}
        />
        <MaterialCommunityIcons
          name={hidePassword ? "eye-off" : "eye"}
          size={24}
          style={formStyles.eye}
          color="gray"
          disabled={isLoading}
          onPress={handleHidePassword}
        />
        <FontAwesome5
          style={formStyles.fieldIcon}
          name={icon}
          color="gray"
          size={16}
        />
      </View>
      {formError && <Text style={formStyles.errorLabel}>{formError}</Text>}
    </View>
  );
}

export function TextFormField({
  label,
  value,
  setValue,
  formError,
  icon,
  isLoading,
}) {
  const theme = useTheme();

  return (
    <View style={formStyles.formGroup}>
      <Text
        style={[formStyles.fieldLabel, formError && formStyles.errorfieldLabel]}
      >
        {label}
      </Text>
      <View style={formStyles.formControlFieldWrapper}>
        <TextInput
          disabled={isLoading}
          mode="outlined"
          outlineColor="lightgray"
          theme={{ roundness: 10 }}
          style={[
            formStyles.formControl,
            { backgroundColor: theme.colors.background },
          ]}
          value={value}
          onChangeText={setValue}
          error={formError}
        />
        <MaterialCommunityIcons
          style={formStyles.fieldIcon}
          name={icon}
          size={18}
          color="gray"
        />
      </View>
      {formError && <Text style={formStyles.errorLabel}>{formError}</Text>}
    </View>
  );
}
