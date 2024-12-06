import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Picker, ImageBackground } from 'react-native';

export default function Register({ navigation }) {
  const [credentials, setCredentials] = useState({ username: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const handleRegister = () => {
    const { username, password, role } = credentials;

    if (!username || !password) {
      setError('All fields are required');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some((user) => user.username === username);

    if (userExists) {
      setError('User already exists');
      return;
    }

    users.push({ username, password, role });
    localStorage.setItem('users', JSON.stringify(users));
    setError('');
    alert('Registration successful! Please login.');
    navigation.navigate('StudentDashboard');
  };

  return (
    <ImageBackground
      source={require('../../assets/back.webp')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#ddd"
            value={credentials.username}
            onChangeText={(text) => setCredentials({ ...credentials, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#ddd"
            secureTextEntry
            value={credentials.password}
            onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          />
          <Text style={styles.label}>Select Role</Text>
          <Picker
            selectedValue={credentials.role}
            onValueChange={(itemValue) => setCredentials({ ...credentials, role: itemValue })}
            style={styles.picker}
          >
            <Picker.Item label="Student" value="student" />
          </Picker>
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('StudentDashboard')}>
            <Text style={styles.registerLink}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 36,
    padding: 20,
    width: '90%',
    height:500,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 45,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height:40,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 8,
    marginBottom: 20,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  label: {
    color: '#fff',
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  registerLink: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'none',
    textAlign: 'center',
  },
});
