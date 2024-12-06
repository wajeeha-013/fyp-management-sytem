import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing Icons

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={require('../../assets/back.webp')}
        style={styles.backgroundImage}
      />
      <Text style={styles.welcomeText}>Welcome to the COMSATS FYP Dashboard</Text>

      {/* Navigation Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('StudentDashboard')}
      >
        <Icon name="account-circle-outline" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Student Console</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SupervisorDashboard')}
      >
        <Icon name="account-supervisor-circle" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Supervisor Console</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Icon name="shield-account" size={30} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Admin Console</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row', // To align icon and text in a row
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '40%',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10, // Add space between icon and text
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;
