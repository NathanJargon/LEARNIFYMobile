import { StyleSheet } from "react-native";

const formStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 30,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 50,
  },
  snackBar: {
    width: "100%",
    marginHorizontal: 14,
    backgroundColor: "red"
  },
  title: {
    fontWeight: "bold",
  },
  form: {
    rowGap: 16,
  },
  formGroup: {
    rowGap: 5,
  },
  formControl: {
    borderRadius: 20,
    paddingStart: 24,
  },
  fieldLabel: {
    marginLeft: 6,
  },
  errorfieldLabel: {
    color: "firebrick"
  },
  errorLabel: {
    color: "firebrick",
    marginLeft: 6,
    fontSize: 12,
  },
  fieldIcon: {
    position: "absolute",
    top: 20,
    left: 14
  },
  eye: {
    position: "absolute",
    top: 16,
    right: 15,
  },
  forgotPasswordWrapper: {
    alignSelf: "flex-end",
  },
  submitButtonLabel: {
    padding: 5,
    fontSize: 16,
    fontWeight: "bold"
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: -5,
  },
});


export {formStyles};