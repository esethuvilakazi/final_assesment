import { View, TouchableOpacity, Text } from 'react-native';

export default function StarRatingInput({ rating=5, onChange }) {
  return (
    <View style={{flexDirection:'row',marginTop:8}}>
      {[1,2,3,4,5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} style={{marginRight:6}}>
          <Text style={{fontSize:22, color: n <= rating ? '#FFD700' : '#ccc'}}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}