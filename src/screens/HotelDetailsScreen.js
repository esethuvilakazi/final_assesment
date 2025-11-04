import { useState, useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthProvider';
import axios from 'axios';
import ReviewModal from '../components/ReviewModal';
import { db } from '../../firebase';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { OPENWEATHER_API_KEY } from '@env';

export default function HotelDetailsScreen({ route, navigation }) {
  const { hotel } = route.params;
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'hotels', hotel.id || hotel.name, 'reviews'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      (err) => console.warn('reviews error', err)
    );
    return unsub;
  }, [hotel]);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            hotel.location
          )}&units=metric&appid=${OPENWEATHER_API_KEY}`
        );
        setWeather(res.data);
        setWeatherError(null);
      } catch (err) {
        setWeatherError(err.message);
      } finally {
        setLoadingWeather(false);
      }
    };
    fetchWeather();
  }, [hotel.location]);

  const addReviewToFirestore = async (rating, text) => {
    if (!user) {
      Alert.alert('Please sign in to add review');
      return;
    }
    try {
      await addDoc(collection(db, 'hotels', hotel.id || hotel.name, 'reviews'), {
        uid: user.uid,
        name: user.displayName || user.email,
        rating,
        text,
        createdAt: new Date(),
      });
      setShowReviewModal(false);
      Alert.alert('Thanks for your review');
    } catch (err) {
      Alert.alert('FAILED')
    }
  };

  return (
    <View style={styles.container}>
      <Image source={hotel.image} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        <View style={styles.infoRow}>
          <Text> {hotel.rating} star rating </Text>
          <Text style={styles.price}>R{hotel.price}/night</Text>
        </View>
        <View style={styles.weatherContainer}>
          <Text style={styles.sectionTitle}> Weather</Text>
          {loadingWeather ? (
            <Text style={styles.secondaryText}>Loading...</Text>
          ) : weatherError ? (
            <Text style={styles.errorText}>Error: {weatherError}</Text>
          ) : (
            <Text style={styles.secondaryText}>
              {weather.weather[0].description}, {weather.main.temp}°C
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() =>
            user ? navigation.navigate('Booking', { hotel }) : navigation.navigate('SignIn')
          }
          style={styles.bookButton}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewsContainer}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <TouchableOpacity
          onPress={() => setShowReviewModal(true)}
          style={styles.addReviewButton}
        >
          <Text>Add Review</Text>
        </TouchableOpacity>
        {reviews.length === 0 ? (
          <Text style={styles.secondaryText}>No reviews </Text>
        ) : (
          <FlatList
            data={reviews}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <Text style={styles.reviewName}>
                  {item.name} • ⭐ {item.rating}
                </Text>
                <Text>{item.text}</Text>
              </View>
            )}
          />
        )}
        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={addReviewToFirestore}
        />
      </View>
    </View>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 240 },
  detailsContainer: { padding: 12 },
  hotelName: { fontSize: 20, fontWeight: '700', color: '#000' },
  location: { color: '#555', marginTop: 2 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  price: { fontWeight: '700', color: '#000' },
  weatherContainer: { marginTop: 12 },
  sectionTitle: { fontWeight: '700', color: '#000' },
  secondaryText: { color: '#555', marginTop: 4 },
  errorText: { color: 'red', marginTop: 4 },
  bookButton: { marginTop: 12, backgroundColor: '#000', padding: 12, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontWeight: '600' },
  reviewsContainer: { padding: 12, flex: 1 },
  addReviewButton: { marginTop: 8, backgroundColor: '#eee', padding: 8, borderRadius: 6, alignSelf: 'flex-start' },
  reviewItem: { paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  reviewName: { fontWeight: '700', color: '#000' },
};
