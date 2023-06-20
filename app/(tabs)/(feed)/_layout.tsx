import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, Tabs, useRouter } from 'expo-router';
import { Pressable, TouchableOpacity, useColorScheme } from 'react-native';

import Colors from '../../..//constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View } from '../../../components/Themed';
import { useState } from 'react';

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
  const router = useRouter();
  const [filterProperty, setFilterProperty] = useState('negdate')

  return (
    <View style={{
      backgroundColor: Colors[colorScheme ?? 'light'].background,flex: 1
    }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          /*  shadowOffset: {
             width: 0,
             height: 3,
           },
           shadowColor: 'black',
           shadowOpacity: 1,
           shadowRadius: 3.84,
           elevation: 15, */
          borderBottomColor: '#eee', borderBottomWidth: 1,
          flexDirection: 'row', justifyContent: 'center'
        }}>
          <TouchableOpacity disabled={filterProperty == 'negdate'} onPress={() => {
            router.push('latest'); setFilterProperty('negdate')
          }}>
            <Text style={{ padding: 15, fontSize: 18, fontWeight: 500, }} lightColor={filterProperty == 'negdate' ? 'black' : '#666'}>{'Latest'}</Text>
          </TouchableOpacity>
          <TouchableOpacity disabled={filterProperty == 'neglikes'} onPress={() => {
            router.replace('trending'); setFilterProperty('neglikes')
          }}>
            <Text style={{ padding: 15, fontSize: 18, fontWeight: 500, }} lightColor={filterProperty == 'neglikes' ? 'black' : '#666'}>{'Trending'}</Text>
          </TouchableOpacity>

        </View><Tabs style={{ flex: 1 }}
          screenOptions={{
            tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
            tabBarHideOnKeyboard: true,
            tabBarStyle: { height: 0, margin: 0, display: 'none' },
          }}>
          <Tabs.Screen
            name="latest"
            options={{
              headerShown: false,
              title: 'FunBot AI',

            }} />
          <Tabs.Screen
            name="trending"
            options={{
              headerShown: false,
              title: 'Ideas',

            }} />

        </Tabs></SafeAreaView>
    </View>

  );
}
