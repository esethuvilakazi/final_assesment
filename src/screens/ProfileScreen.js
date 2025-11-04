import  { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { AuthContext } from '../context/AuthProvider';
import { db, auth } from '../../firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.displayName || '');

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'bookings'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setBookings(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch  {
      Alert.alert('Logout failed')
    }
  };

  const saveProfile = async () => {
    try {
      await updateDoc(doc(db, 'users', user.uid), { name });
      await updateProfile(auth.currentUser, { displayName: name });
      setEditing(false);
      Alert.alert('Profile updated');
    } catch  {
      Alert.alert('Error');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.email}>Email: {user?.email}</Text>

      {editing ? (
        <>
          <Text style={styles.label}>Name:</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TouchableOpacity onPress={saveProfile} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setEditing(false)} style={styles.cancelButton}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.label}>Name: {user?.displayName || name}</Text>
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.editButton}>
            <Text>Edit Name</Text>
          </TouchableOpacity>
        </>
      )}

      <Text style={styles.bookingsTitle}>Your Bookings</Text>
      <FlatList
        data={bookings}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text style={styles.bookingHotel}>{item.hotelName}</Text>
            <Text>
              {new Date(item.checkIn).toDateString()} - {new Date(item.checkOut).toDateString()}
            </Text>
            <Text>Total: R{item.totalCost}</Text>
          </View>
        )}
      />

      <TouchableOpacity onPress={logout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  email: {
    marginTop: 8,
    color: '#000',
  },
  label: {
    marginTop: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 6,
    marginTop: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 8,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 8,
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  bookingsTitle: {
    marginTop: 16,
    fontWeight: '700',
    color: '#000',
  },
  bookingItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  bookingHotel: {
    fontWeight: '700',
    color: '#000',
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
