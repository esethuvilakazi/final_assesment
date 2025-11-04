import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HotelCard from '../components/HotelCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const sampleHotels = [
  { 
    id: 'h1', 
    name: 'VEELAA Resort', 
    location: 'Durban', 
    rating: 4.7, 
    price: 200, 
    image: require('../../assets/images/Files/Materials/06-Explore Page/image-1.png') 
  },
  { 
    id: 'h2', 
    name: 'Nomthandzo Hotels', 
    location: 'Johannesburg', 
    rating: 4.3, 
    price: 150, 
    image: require('../../assets/images/Files/Materials/06-Explore Page/image-13.png') 
  },
  { 
    id: 'h3', 
    name: 'Andile Palace', 
    location: 'Pretoria', 
    rating: 4.9, 
    price: 250, 
    image: require('../../assets/images/Files/Materials/06-Explore Page/image-14.png') 
  },
];


export default function ExploreScreen({ navigation }) {
  const [hotels, setHotels] = useState(sampleHotels);
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    sortHotels(sortBy);
  }, [sortBy]);

  const sortHotels = (key) => {
    const sorted = [...hotels].sort((a, b) => {
      if (key === 'price') return a.price - b.price;
      if (key === 'rating') return b.rating - a.rating;
      return 0;
    });
    setHotels(sorted);
  };

  const renderItem = ({ item }) => (
    <HotelCard hotel={item} onPress={() => navigation.navigate('HotelDetails', { hotel: item })} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.sortContainer}>
        <TouchableOpacity
          onPress={() => setSortBy('rating')}
          style={[styles.sortButton, sortBy === 'rating' && styles.activeSortButton]}
        >
          <Text style={styles.activeSortButtonText}>Top Rated</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSortBy('price')}
          style={[styles.sortButton, sortBy === 'price' && styles.activeSortButton]}
        >
          <Text style={styles.activeSortButtonText}>Price</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={hotels}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  sortButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  activeSortButton: {
    backgroundColor: '#000',
  },
  activeSortButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 10,
  },
});
