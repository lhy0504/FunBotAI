import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          tabBarHideOnKeyboard: true,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Meme',
            tabBarIcon: ({ color }) => <MaterialIcons name='image'  size={25} color={color} />,
          }}
        />
        <Tabs.Screen
          name="dialogue"
          options={{
            headerShown: false,
            title: 'Dialogue',
            tabBarIcon: ({ color }) => <MaterialIcons name='message'  size={25} color={color} />,
          }}
        />
        <Tabs.Screen
          name="(feed)"
          options={{
            headerShown:false,
            title: 'Ideas',
            tabBarIcon: ({ color }) => <MaterialIcons name="local-fire-department" size={28} color={color} />,
          }}
        />

      </Tabs>
 
  );
}
