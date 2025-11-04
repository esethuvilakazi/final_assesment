import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

export default function DealsScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await axios.get('https://fakestoreapi.com/products?limit=10');
      setItems(res.data);
      setLoading(false);
    } catch (err) {
      Alert.alert('Failed to GET DEALS')
    } 
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => Alert.alert(item.title)}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemPrice}>R{item.price} p/n</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(i) => i.id.toString()}
      contentContainerStyle={styles.listContent}
      renderItem={renderItem}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 12,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginBottom: 12,
    backgroundColor: 'grey',
    padding: 12,
    borderRadius: 8,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#ccc',
  },
});
