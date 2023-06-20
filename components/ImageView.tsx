import { ActivityIndicator, } from 'react-native-paper';
import { Image } from 'react-native';
import { useEffect, useState } from 'react';
import { View } from './Themed';


export function ImageView(props: { width: number, height: number, src: string, onLoadEnd?: () => void, isParentLoading?: boolean }) {

  const [isGenerating, setGenerating] = useState(false)
 
  return <View>
    <View style={{
      position: 'absolute',
      width: props.width,
      height: props.height,
      alignItems: "center", justifyContent: "center", zIndex: 20,
      backgroundColor: 'rgba(52, 52, 52, 0)'
    }}>
      <ActivityIndicator size={'large'} animating={isGenerating ?? props.isParentLoading } />
    </View>
    <Image
      onLoadStart={() => setGenerating(true)}
      onLoadEnd={() => { setGenerating(false); ;if (props.onLoadEnd) props.onLoadEnd() }}
      source={{ uri: props.src }} style={{
        width: props.width,
        height: props.height,
        opacity: isGenerating ?? props.isParentLoading ? 0.5 : 1,
        backgroundColor: "#888"
      }} />
  </View>
}
