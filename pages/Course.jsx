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
import { getFirestore, doc, collection, getDocs, getDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Course({ route }) {
  const userToken = getSecureStore("userToken");
  const [serverError, setServerError] = useState("");
  const Tab = createMaterialTopTabNavigator();
  const id = route.params.id;
  const imgPath = route.params.imgPath;
  const [course, setCourse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  console.log(userToken)
  useEffect(() => {
    const fetchCourse = async () => {
      const db = getFirestore();
      const courseDoc = doc(db, "courses", id);
  
      const auth = getAuth();
      const userEmail = auth.currentUser?.email;
      setUserEmail(userEmail); 
      setRefreshing(true);

      console.log("User email :" + userEmail);

      
      const courseSnapshot = await getDoc(courseDoc);
      if (courseSnapshot.exists()) {
        setCourse({ id: courseSnapshot.id, ...courseSnapshot.data() });
  
        // Fetch related activities
        try {
          const activitiesCollection = collection(db, 'activities');
          const activitiesQuery = query(activitiesCollection, where('courseId', '==', id));
          const activitiesSnapshot = await getDocs(activitiesQuery);
          console.log('activitiesSnapshot:', activitiesSnapshot);  // Log the activitiesSnapshot
  
          const activities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
          // Add activities to course state
          setCourse(course => ({ ...course, activities }));
        } catch (error) {
          console.log('Error fetching activities:', error);  // Log any errors
        }
      } else {
        console.log("No such document!");
      }
    };
  
    fetchCourse();
  }, [id]);

  console.log(course);

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
              title={course?.courseName}
              instructor={course?.userEmail}
              image={imgPath}
              desc={course?.courseDescription}
              objectives={course?.courseObjectives}
              topics={course?.courseTopics}
              {...props}
            />
          )}
        />
        <Tab.Screen
          name="Materials"
          children={(props) => (
            <LearningMaterials materials={course?.learningMaterials} {...props} />
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
          children={(props) => <Forum forums={course?.comments} courseId={id} {...props} />}
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
