import { Asset } from "expo-asset";
import { Image } from "react-native";

export function cacheImages(images:string[]) {
    return images.map((image) => {
        Image.prefetch(image)
        .then((data:any) => {
            
        })
        .catch((data:any) => {
            
        })
        .finally(() => {
            return images
        })
    });
   }

export function properDate(date:any){
    return new Date(date.seconds * 1000);
    
}