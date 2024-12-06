import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Picker, Alert, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AdminDashboard = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [presentationDetails, setPresentationDetails] = useState('');
  const [evaluationDetails, setEvaluationDetails] = useState('');

  // Fetch users and FYP data on component mount
  useEffect(() => {
    const usersFromStorage = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(usersFromStorage);
    const filteredStudents = usersFromStorage.filter((user) => user.role === 'student');
    setStudents(filteredStudents);
  }, []);

  // Function to update FYP data in localStorage
  const updateFypData = (studentUsername, field, details) => {
    const fypKey = `fyp_${studentUsername}`;
    const fypData = JSON.parse(localStorage.getItem(fypKey));

    if (!fypData) {
      Alert.alert('Error', `No FYP data found for student: ${studentUsername}`);
      return;
    }

    fypData[field].push(details);
    localStorage.setItem(fypKey, JSON.stringify(fypData));
    Alert.alert('Success', `${field === 'presentations' ? 'Presentation' : 'Evaluation'} scheduled successfully!`);
  };

  const schedulePresentation = () => {
    if (!selectedStudent || !presentationDetails) {
      Alert.alert('Error', 'Please select a student and provide presentation details.');
      return;
    }
    updateFypData(selectedStudent, 'presentations', presentationDetails);
    setPresentationDetails('');
  };

  const scheduleEvaluation = () => {
    if (!selectedStudent || !evaluationDetails) {
      Alert.alert('Error', 'Please select a student and provide evaluation details.');
      return;
    }
    updateFypData(selectedStudent, 'evaluations', evaluationDetails);
    setEvaluationDetails('');
  };

  const handleLogout = () => {
    alert('You have been logged out!');
    navigation.navigate('Login');
  };

  return (
    <ImageBackground
    source={require('../../assets/back.webp')}
      style={styles.background}
    >
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
      <Icon name="logout" size={20} color="#fff" style={styles.icon} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>

      <View style={styles.container}>
      <View style={styles.dashboard}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <Text style={styles.label}>Select a Student:</Text>
        <Picker
          selectedValue={selectedStudent}
          onValueChange={(itemValue) => setSelectedStudent(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="-- Select Student --" value="" />
          {students.map((student, index) => (
            <Picker.Item key={index} label={student.username} value={student.username} />
          ))}
        </Picker>

        <Text style={styles.label}>Schedule Presentation:</Text>
        <TextInput
          value={presentationDetails}
          onChangeText={(text) => setPresentationDetails(text)}
          placeholder="Enter presentation details"
          style={styles.input}
        />
           <TouchableOpacity style={styles.button} onPress={schedulePresentation}>
          <Text style={styles.buttonText}>Schedule Presentation</Text>
        </TouchableOpacity>
        <Text style={[styles.label, { marginTop: 20 }]}>Schedule Evaluation:</Text>
        <TextInput
          value={evaluationDetails}
          onChangeText={(text) => setEvaluationDetails(text)}
          placeholder="Enter evaluation details"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={scheduleEvaluation}>
          <Text style={styles.buttonText}>Schedule Evaluation</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ImageBackground>
  );
};

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
  dashboard: {
    width: '90%',
    maxWidth: 500, 
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color:"#fff",
  },
  picker: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginBottom: 20,
    color:"fff",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: '#ff5c5c',
    padding: 10,
    borderRadius: 50,
  },

  logout: {
    flexDirection: 'row',       
    alignSelf: 'flex-end',      
    width: 120,                 
    backgroundColor: '#ff5c5c', 
    borderRadius: 5,            
    paddingVertical: 8,         
    paddingHorizontal: 10,      
    margin: 10,                 
    alignItems: 'center',       
  },
  logoutText: {
    color: 'white',            
    fontWeight: 'bold',         
    marginLeft: 8,              
  },
  icon: {
    marginRight: 3,             
  },
  button: {
    backgroundColor: '#4caf50', 
    paddingVertical: 12,        
    borderRadius: 5,           
    alignItems: 'center',       
  },
  buttonText: {
    color: '#fff',             
    fontSize: 16,               
    fontWeight: 'bold',         
  },
});

export default AdminDashboard;
