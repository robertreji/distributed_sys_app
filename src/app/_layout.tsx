import "react-native-get-random-values";
import process from "process";
import { Buffer } from "buffer";
import { Stack } from "expo-router";
import "../../global.css"
global.process = process;
global.Buffer = Buffer;


export default function RootLayout() {
console.log('Stack:', Stack);

  return <Stack />;
}