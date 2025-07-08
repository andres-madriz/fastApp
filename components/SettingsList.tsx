import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

export default function SettingsList({
  onDeleteAccount,
  onLogout,
  onNotificationMode,
}: {
  onLogout: () => void;
  onDeleteAccount: () => void;
  onNotificationMode: () => void;
}) {
  return (
    <View style={styles.list}>
      <TouchableOpacity style={styles.button} onPress={onNotificationMode}>
        <Text style={styles.buttonText}>🔔 Notification Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Terms', 'Terms and Conditions (TBD)')}>
        <Text style={styles.buttonText}>📑 Terms & Conditions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#fff4f3' }]} onPress={onDeleteAccount}>
        <Text style={[styles.buttonText, { color: '#ef4444' }]}>🗑️ Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logout} onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'flex-start',
    backgroundColor: '#f5f8fa',
    borderRadius: 12,
    marginBottom: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  buttonText: { color: '#222', fontSize: 17, fontWeight: '600' },
  list: { marginTop: 28, width: '100%' },
  logout: {
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 14,
    marginTop: 24,
    padding: 14,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
