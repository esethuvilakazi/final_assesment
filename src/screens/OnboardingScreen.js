import { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthProvider';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

const slides = [
  { key: '1', title: 'Browse Hotels', text: 'Discover top hotels and locations', image: require('../../assets/images/Files/Materials/01-Onboarding Page/Onboarding 1.png') },
  { key: '2', title: 'Book Rooms', text: 'Select dates and confirm bookings quickly', image: require('../../assets/images/Files/Materials/01-Onboarding Page/Onboarding 2.png') },
  { key: '3', title: 'Leave Reviews', text: 'Rate your stay and help others decide', image: require('../../assets/images/Files/Materials/01-Onboarding Page/Onboarding 3.png') },
];

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const navigation = useNavigation();
  const { user, setOnboarded } = useContext(AuthContext);

  useEffect(() => {
    AsyncStorage.getItem('hasOnboarded').then(val => {
      if (val === 'true' && !user) {
        navigation.replace('SignIn');
      }
    });
  }, []);

  const next = async () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      await AsyncStorage.setItem('hasOnboarded', 'true');
      if (user) {
          await setDoc(doc(db, 'users', user.uid), { onboarded: true }, { merge: true });
          setOnboarded(true);
      }
      navigation.replace('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={slides[index].image} style={styles.image} />
      <Text style={styles.title}>{slides[index].title}</Text>
      <Text style={styles.text}>{slides[index].text}</Text>
      <TouchableOpacity style={styles.nextButton} onPress={next}>
        <Text style={styles.nextButtonText}>{index < slides.length -1 ? 'Next' : 'Get Started'}</Text>
      </TouchableOpacity>
      {index > 0 && (
        <TouchableOpacity onPress={() => setIndex(index - 1)} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 300,
    height: 400,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: '#000',
  },
  text: {
    textAlign: 'center',
    marginTop: 8,
    color: '#555',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    fontWeight: '600',
    color: '#fff',
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    color: '#000',
  },
});
