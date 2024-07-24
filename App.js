import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const localUri = `${FileSystem.documentDirectory}index.html`;
  
  return (
    <View style={styles.container}>
      <WebView source={{ uri: localUri }} style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
