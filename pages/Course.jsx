import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";

import AppBar from "../components/AppBar";
import Description from "../components/Course/Description";
import LearningMaterials from "../components/Course/LearningMaterials";
import Activity from "../components/Course/Activity";
import Forum from "../components/Course/Forum";
import baseURL from "../utils/baseURL";
import { getSecureStore } from "../utils/SecureStore";
import { firebase } from "../utils/FirebaseConfig";
import { getFirestore, doc, collection, getDocs, getDoc } from "firebase/firestore";

export default function Course({ route }) {
  const userToken = getSecureStore("userToken");
  const [serverError, setServerError] = useState("");
  const Tab = createMaterialTopTabNavigator();
  const id = route.params.id;
  const imgPath = route.params.imgPath;
  const [course, setCourse] = useState({});

  useEffect(() => {
    getCourse();
  }, []);

    const getCourses = async () => {
      try {
        const db = getFirestore(firebase);
        const coursesCollection = collection(db, "courses");

        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => doc.data());

        setCourses(courseList);
      } catch (error) {
        setServerError(error.message);
      }
    };

  const onDismissSnackBarHandler = () => setServerError("");

  return (
    <>
      <AppBar hasBackAction={true} hasLogo={false} title={course?.title} />
      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,
          tabBarIndicatorStyle: {
            backgroundColor: theme.colors.primary,
            height: 3,
          },
        }}
        sceneContainerStyle={{ backgroundColor: theme.colors.background }}
      >
        <Tab.Screen
          name="Description"
          children={(props) => (
            <Description
              title={course?.title}
              instructor={course?.instructor_name}
              image={imgPath}
              desc={course?.description}
              objectives={course?.objectives}
              topics={course?.topics}
              {...props}
            />
          )}
        />
        <Tab.Screen
          name="Materials"
          children={(props) => (
            <LearningMaterials materials={course?.materials} {...props} />
          )}
        />
        <Tab.Screen
          name="Activity"
          children={(props) => (
            <Activity activities={course?.activities} {...props} />
          )}
        />
        <Tab.Screen
          name="Forum"
          children={(props) => <Forum forums={course?.forums} {...props} />}
        />
      </Tab.Navigator>

      {/* Display server error response */}
      <Snackbar
        style={styles.snackBar}
        visible={serverError}
        onDismiss={onDismissSnackBarHandler}
      >
        {serverError}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  snackBar: {
    marginHorizontal: 14,
    backgroundColor: "red",
  },
});
