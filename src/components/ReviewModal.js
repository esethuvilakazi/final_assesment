import { useState } from 'react';
import { View, Modal, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import StarRatingInput from './StarRatingInput';

export default function ReviewModal({ visible, onClose, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  const submit = () => {
    if (text.trim() === '') return;
    onSubmit(rating, text);
    setText('');
    setRating(5);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Add Review</Text>
          <StarRatingInput rating={rating} onChange={setRating} />
          <TextInput
            placeholder="Write your review"
            value={text}
            onChangeText={setText}
            multiline
            style={styles.input}
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={submit} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#555',
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 6,
  },
  submitText: {
    fontWeight: '700',
  },
});
