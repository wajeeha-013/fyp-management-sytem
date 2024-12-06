import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Picker,TouchableOpacity,ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function StudentDashboard({navigation}) {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || null);
  const [fyp, setFyp] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', supervisor: '' });
  const [supervisors, setSupervisors] = useState([]); // List of available supervisors
  const [presentations, setPresentations] = useState([]);
  const [evaluations, setEvaluations] = useState([]);

  useEffect(() => {
    if (loggedInUser) {
      // Fetch FYP data for the logged-in user
      const fypData = JSON.parse(localStorage.getItem(`fyp_${loggedInUser}`)) || null;
      setFyp(fypData);

      // Load supervisors from localStorage or default list
      const availableSupervisors = [
        'Mr. Muhammad Kamran',
        'Prof. Johnson',
        'Dr. Muazzam',
        'Ms. Taylor',
      ];
      setSupervisors(availableSupervisors);

      // Fetch presentations and evaluations scheduled for the user
      const userPresentations = JSON.parse(localStorage.getItem(`presentations_${loggedInUser}`)) || [];
      const userEvaluations = JSON.parse(localStorage.getItem(`evaluations_${loggedInUser}`)) || [];
      setPresentations(userPresentations);
      setEvaluations(userEvaluations);
    }
  }, [loggedInUser]);

  // Fetch registered students from localStorage
  const getRegisteredStudents = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Filter users with the role of "student"
    return users.filter((user) => user.role === 'student');
  };

  // Handle Login
  const handleLogin = () => {
    const students = getRegisteredStudents(); // Get only students
    const user = students.find(
      (u) => u.username === credentials.username && u.password === credentials.password
    );

    if (user) {
      localStorage.setItem('loggedInUser', user.username);
      setLoggedInUser(user.username);
      alert(`Welcome ${user.username}!`);
    } else {
      alert('Invalid username or password!');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setLoggedInUser(null);
    alert('You have been logged out!');
  };

  // Handle FYP Registration
  const handleFypRegistration = () => {
    if (!form.title || !form.description || !form.supervisor) {
      alert('All fields are required!');
      return;
    }

    const newFyp = {
      title: form.title,
      description: form.description,
      supervisor: form.supervisor,
      presentations: [],
      evaluations: [],
      marks: null, // Initially no marks
    };

    // Save FYP data for the logged-in user
    localStorage.setItem(`fyp_${loggedInUser}`, JSON.stringify(newFyp));
    setFyp(newFyp);
    alert('FYP registered successfully!');
  };

  if (!loggedInUser) {
    // Show login form if no user is logged in
    return (
      <ImageBackground
      source={require('../../assets/back.webp')} // Replace with your background image path
      style={styles.background}
    >
      <View style={styles.containerLogin}>
      <View style={styles.formContainer}>
        <Text style={styles.titleLogin}>Login</Text>
        <TextInput
          style={styles.inputLogin}
          placeholder="Username"
          placeholderTextColor="#ddd"
          value={credentials.username}
          onChangeText={(text) => setCredentials({ ...credentials, username: text })}
        />
        <TextInput
          style={styles.inputLogin}
          placeholder="Password"
          placeholderTextColor="#ddd"
          value={credentials.password}
          onChangeText={(text) => setCredentials({ ...credentials, password: text })}
          secureTextEntry
        />
        <TouchableOpacity style={styles.glassyButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerLink}>
          <Text style={styles.registerText}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
      </View>
    </ImageBackground>

    );
  }

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.logout} onPress={handleLogout}>
      <Icon name="logout" size={20} color="#fff" style={styles.icon} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
      {fyp ? (
        // If FYP is registered, show details
        <View style={styles.fypInfoContainer}>
  <ImageBackground
    source={require('../../assets/back.webp')} 
    style={styles.fypBackground}
    imageStyle={styles.fypBackgroundImage}
  >
    <Text style={styles.fypTitle}>Your FYP Details:</Text>
    <Text style={styles.fypDetailText}>Title: {fyp.title}</Text>
    <Text style={styles.fypDetailText}>Description: {fyp.description}</Text>
    <Text style={styles.fypDetailText}>Supervisor: {fyp.supervisor}</Text>
    <Text style={styles.fypDetailText}>
      Latest Marks: {fyp.marks !== null ? fyp.marks : 'Not graded yet'}
    </Text>
    <Text style={styles.fypSubTitle}>Presentations:</Text>
    {fyp.presentations.length > 0 ? (
      fyp.presentations.map((presentation, index) => (
        <Text key={index} style={styles.fypListText}>
          {presentation}
        </Text>
      ))
    ) : (
      <Text style={styles.fypEmptyText}>No presentations scheduled yet.</Text>
    )}
    <Text style={styles.fypSubTitle}>Evaluations:</Text>
    {fyp.evaluations.length > 0 ? (
      fyp.evaluations.map((evaluation, index) => (
        <Text key={index} style={styles.fypListText}>
          {evaluation}
        </Text>
      ))
    ) : (
      <Text style={styles.fypEmptyText}>No evaluations scheduled yet.</Text>
    )}
  </ImageBackground>
</View>

      ) : (
        // If no FYP is registered, show the registration form
        <View style={styles.screen}>
      <ImageBackground
        source={require('../../assets/back.webp')} 
        style={styles.backgroundImage}
      />
        <View style={styles.formContainer}>
        <Text style={styles.title}>Register Your FYP</Text>
        <TextInput
          style={styles.input}
          placeholder="Project Title"
          value={form.title}
          onChangeText={(text) => setForm({ ...form, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Project Description"
          value={form.description}
          onChangeText={(text) => setForm({ ...form, description: text })}
        />
        <Picker
          selectedValue={form.supervisor}
          onValueChange={(itemValue) => setForm({ ...form, supervisor: itemValue })}
          style={styles.picker}
        >
          <Picker.Item label="Select a supervisor" value="" />
          {supervisors.map((supervisor, index) => (
            <Picker.Item key={index} label={supervisor} value={supervisor} />
          ))}
        </Picker>
        <TouchableOpacity style={styles.registerButton} onPress={handleFypRegistration}>
          <Text style={styles.registerButtonText}>Register FYP</Text>
        </TouchableOpacity>
      </View>
      </View>
      
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',    
    backgroundColor: '#f9f9f9', 
  },
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,              
    fontWeight: 'bold',         
    color: '#333',              
    marginBottom: 15,          
    textAlign: 'center',        
  },
  input: {
    borderWidth: 1,            
    borderColor: '#ccc',        
    borderRadius: 5,           
    padding: 10,                
    fontSize: 16,              
    marginBottom: 15,          
    backgroundColor: 'rgba(255, 255, 255, 0.1)', 
  },
  picker: {
    borderWidth: 1,            
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 10,        
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#4caf50', 
    paddingVertical: 12,        
    borderRadius: 5,           
    alignItems: 'center',
    width : 150,       
  },
  registerButtonText: {
    color: '#fff',             
    fontSize: 16,               
    fontWeight: 'bold',         
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  containerLogin: {
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
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 50,
    marginTop : 20,
  },
  titleLogin: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 45,
    textAlign: 'center',
  },
  inputLogin: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    marginBottom: 20,
  },
  glassyButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerLink: {
    color: '#fff',
    marginTop: 20,
    textDecorationLine: 'none',
    textAlign: 'center',
  },
  registerText: {
    color: '#fff',
    textDecorationLine: 'none',
  },
  fypInfoContainer: {
    marginVertical: 20,
    borderRadius: 15,
    overflow: 'hidden', 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  fypBackground: {
    padding: 20,
    justifyContent: 'center',
  },
  fypBackgroundImage: {
    opacity: 0.7, 
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  fypTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    marginTop:50,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  fypDetailText: {
    fontSize: 16,
    color: 'white',
    marginVertical: 5,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fypSubTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'cyan',
    marginTop: 15,
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fypListText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 10,
    marginVertical: 2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  fypEmptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#ddd',
    marginLeft: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom : 20,
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
});
