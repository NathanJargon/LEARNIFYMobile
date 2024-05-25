import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";
import { StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppBar from "../components/AppBar";
import Description from "../components/Course/Description";
import LearningMaterials from "../components/Course/LearningMaterials";
import Activity from "../components/Course/Activity";
import Forum from "../components/Course/Forum";
import baseURL from "../utils/baseURL";
import { firebase } from "../utils/FirebaseConfig";
import { getFirestore, doc, collection, getDocs, getDoc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default function Course({ navigation, route }) {
  const [userToken, setUserToken] = useState(null);
  const [serverError, setServerError] = useState("");
  const Tab = createMaterialTopTabNavigator();
  const id = route.params.id;
  const imgPath = route.params.imgPath;
  const [course, setCourse] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('userToken').then(token => {
      setUserToken(token);
      console.log("User Token: " + token);
      console.log("Course Recieved Id: " + id);
    });
  }, []);
  
  console.log(userToken)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const db = getFirestore();
        const courseDoc = doc(db, "courses", id);
    
        // Get userEmail from AsyncStorage
        const userEmail = await AsyncStorage.getItem('email');
        setUserEmail(userEmail); 
        setRefreshing(true);
    
        console.log("User email :" + userEmail);  
        console.log("User id: " + id);
    
        const courseSnapshot = await getDoc(courseDoc);
        if (courseSnapshot.exists()) {
          setCourse({ id: courseSnapshot.id, ...courseSnapshot.data() });
          console.log('Course after initial fetch:', course);  // Log the course after initial fetch
    
          // Fetch related activities
          const activitiesCollection = collection(db, 'activities');
          const activitiesQuery = query(activitiesCollection, where('courseId', '==', id));
          const activitiesSnapshot = await getDocs(activitiesQuery);
    
          const activities = activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('activities:', activities);  // Log the activities
    
          // Add activities to course state
          setCourse(course => {
            console.log('Course before adding activities:', course);  // Log the course before adding activities
            const updatedCourse = { ...course, activities };
            console.log('Course after adding activities:', updatedCourse);  // Log the course after adding activities
            return updatedCourse;
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.log('Error in fetchCourse:', error);  // Log any errors or warnings
      }
    };
  
    fetchCourse();
  }, [id, needsRefresh]);
  
  console.log('Course in render:', course);  // Log the course in the render method
  

  console.log(course);

  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setNeedsRefresh(true);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (needsRefresh) {
      setNeedsRefresh(false);
    }
  }, [needsRefresh]);


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
          children={(props) => {
            console.log('Activities in Activity component:', course?.activities);  
            return <Activity activities={course?.activities} {...props} />;
          }}
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
