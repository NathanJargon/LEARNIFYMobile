import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PDFViewer({ route }) {
  const { pdfUrl } = route.params;
  console.log(pdfUrl);

  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}`;

  return (
    <WebView
      source={{ uri: googleDocsUrl }}
      style={styles.webview}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});