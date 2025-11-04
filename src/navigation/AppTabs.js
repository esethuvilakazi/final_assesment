import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ExploreScreen from '../screens/ExploreScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DealsScreen from '../screens/DealsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import BookingScreen from '../screens/BookingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ExploreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Explore" component={ExploreScreen} options={{ headerShown:false }} />
      <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} options={{ title:'Details' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title:'Booking' }} />
    </Stack.Navigator>
  );
}

export default function AppTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={ExploreStack} options={{ headerShown:false }} />
      <Tab.Screen name="Deals" component={DealsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}