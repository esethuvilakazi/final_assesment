import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { AuthContext } from '../context/AuthProvider';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function BookingScreen({ route, navigation }) {
  const { hotel } = route.params;
  const { user } = useContext(AuthContext);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [rooms, setRooms] = useState(1);
  const [showPicker, setShowPicker] = useState({ visible: false, mode: 'checkin' });

  const totalCost = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights * hotel.price * rooms : 0;
  };

  const confirmBooking = async () => {
    if (!user) {
      navigation.navigate('SignIn');
      return;
    }
    if (!checkIn || !checkOut) {
      Alert.alert('Select check-in and check-out dates');
      return;
    }
    if (checkOut <= checkIn) {
      Alert.alert('Check-out must be after check-in');
      return;
    }
    try {
      const bookingRef = await addDoc(collection(db, 'users', user.uid, 'bookings'), {
        hotelId: hotel.id || hotel.name,
        hotelName: hotel.name,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        rooms,
        totalCost: totalCost(),
        createdAt: new Date(),
      });
      Alert.alert('Booking confirmed', `Booking ID: ${bookingRef.id}`);
    } catch  {
      Alert.alert('Booking failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.hotelName}>{hotel.name}</Text>
      <Text style={styles.price}>Price per night: R{hotel.price}</Text>

      <TouchableOpacity
        onPress={() => setShowPicker({ visible: true, mode: 'checkin' })}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{checkIn ? `Check-in: ${checkIn.toDateString()}` : 'Select check-in date'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowPicker({ visible: true, mode: 'checkout' })}
        style={styles.dateButton}
      >
        <Text style={styles.dateText}>{checkOut ? `Check-out: ${checkOut.toDateString()}` : 'Select check-out date'}</Text>
      </TouchableOpacity>

      <View style={styles.roomsContainer}>
        <Text style={styles.roomsLabel}>Rooms:</Text>
        <TouchableOpacity onPress={() => setRooms(r => Math.max(1, r - 1))} style={styles.roomButton}><Text style={styles.roomButtonText}>-</Text></TouchableOpacity>
        <Text style={styles.roomsCount}>{rooms}</Text>
        <TouchableOpacity onPress={() => setRooms(r => r + 1)} style={styles.roomButton}><Text style={styles.roomButtonText}>+</Text></TouchableOpacity>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R{totalCost()}</Text>
      </View>

      <TouchableOpacity onPress={confirmBooking} style={styles.confirmButton}>
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPicker.visible}
        mode="date"
        onConfirm={(date) => {
          setShowPicker({ visible: false, mode: showPicker.mode });
          showPicker.mode === 'checkin' ? setCheckIn(date) : setCheckOut(date);
        }}
        onCancel={() => setShowPicker({ visible: false, mode: 'checkin' })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  price: {
    marginTop: 8,
    color: '#333',
  },
  dateButton: {
    marginTop: 12,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
  },
  dateText: {
    color: '#fff',
  },
  roomsContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  roomsLabel: {
    color: '#000',
  },
  roomButton: {
    marginLeft: 12,
    marginRight: 12,
    padding: 8,
    backgroundColor: '#000',
    borderRadius: 6,
  },
  roomButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  roomsCount: {
    color: '#000',
    fontWeight: '700',
  },
  totalContainer: {
    marginTop: 20,
  },
  totalText: {
    color: '#000',
    fontWeight: '700',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
