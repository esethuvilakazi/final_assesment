import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function HotelCard({ hotel, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={hotel.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{hotel.name}</Text>
        <Text style={styles.location}>{hotel.location}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {hotel.rating}</Text>
          <Text style={styles.price}>R{hotel.price}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    backgroundColor: 'grey',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  location: {
    color: 'white'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  rating: {
    color: 'white'
  },
  price: {
    fontWeight: '700',
    color: 'white'
  },
});
