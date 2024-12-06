import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, ImageBackground,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SupervisorDashboard() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loggedInSupervisor, setLoggedInSupervisor] = useState(
    localStorage.getItem('loggedInSupervisor') || null
  );
  const [supervisedFYPs, setSupervisedFYPs] = useState([]);
  const [currentGrade, setCurrentGrade] = useState({ username: '', grade: '' });

  useEffect(() => {
    const predefinedSupervisors = [
      { username: 'Mr. Muhammad Kamran', password: 'Supervisor@12345' },
      { username: 'Prof. Johnson', password: 'Supervisor@12345' },
      { username: 'Dr. Muazzam', password: 'Supervisor@12345' },
      { username: 'Ms. Taylor', password: 'Supervisor@12345' },
    ];

    const savedSupervisors = JSON.parse(localStorage.getItem('supervisors')) || [];
    if (savedSupervisors.length === 0) {
      localStorage.setItem('supervisors', JSON.stringify(predefinedSupervisors));
    }

    if (loggedInSupervisor) {
      const allUsers = JSON.parse(localStorage.getItem('users')) || [];
      const fypList = allUsers
        .filter((user) => user.role === 'student')
        .map((student) => {
          const fypKey = `fyp_${student.username}`;
          const fyp = JSON.parse(localStorage.getItem(fypKey));
          return fyp && fyp.supervisor === loggedInSupervisor
            ? { ...fyp, fypKey, username: student.username } // Add original username
            : null;
        })
        .filter(Boolean);

      setSupervisedFYPs(fypList);
    }
  }, [loggedInSupervisor]);

  const handleLogin = () => {
    const supervisors = JSON.parse(localStorage.getItem('supervisors')) || [];
    const supervisor = supervisors.find(
      (sup) => sup.username === credentials.username && sup.password === credentials.password
    );

    if (supervisor) {
      localStorage.setItem('loggedInSupervisor', supervisor.username);
      setLoggedInSupervisor(supervisor.username);
      alert(`Welcome ${supervisor.username}!`);
    } else {
      alert('Invalid username or password!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInSupervisor');
    setLoggedInSupervisor(null);
    alert('You have been logged out!');
  };

  const handleGradeSubmit = () => {
    const { username, grade } = currentGrade;

    if (!username || !grade) {
      alert('Please enter both username and grade.');
      return;
    }

    const fypKey = `fyp_${username}`; // Add prefix for internal key
    const fypData = JSON.parse(localStorage.getItem(fypKey));

    if (!fypData || fypData.supervisor !== loggedInSupervisor) {
      alert('FYP data not found or you are not authorized to grade this FYP.');
      return;
    }

    fypData.marks = grade;
    localStorage.setItem(fypKey, JSON.stringify(fypData));

    setSupervisedFYPs((prevFYPs) =>
      prevFYPs.map((fyp) => (fyp.fypKey === fypKey ? { ...fyp, marks: grade } : fyp))
    );

    alert(`Grade "${grade}" has been assigned to ${username}'s FYP.`);
    setCurrentGrade({ username: '', grade: '' });
  };

  if (!loggedInSupervisor) {
    return (
      <ImageBackground
      source={require('../../assets/back.webp')} 
      style={styles.background}
    >
      <View style={styles.containerLogin}>
      <View style={styles.formContainer}>
        <Text style={styles.titleLogin}>Supervisor Login</Text>
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
      </View>
      </View>
    </ImageBackground>

    );
  }

  return (
    <ImageBackground
    source={require('../../assets/back.webp')} // Add your background image path here
    style={styles.background}
  >
    <View style={styles.container}>
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Icon name="logout" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.dashboard}>
        <Text style={styles.title}>Welcome, {loggedInSupervisor}</Text>

        <Text style={styles.sectionTitle}>Supervised FYPs:</Text>
        {supervisedFYPs.length > 0 ? (
          <FlatList
            data={supervisedFYPs}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text>Student Username: {item.username}</Text>
                <Text>Title: {item.title}</Text>
                <Text>Description: {item.description}</Text>
                <Text>Marks: {item.marks !== null ? item.marks : 'Not graded yet'}</Text>
              </View>
            )}
          />
        ) : (
          <Text>No FYPs assigned to you yet.</Text>
        )}

        <Text style={styles.sectionTitle}>Assign Grade:</Text>
        <TextInput
          style={styles.input}
          placeholder="Student Username"
          value={currentGrade.username}
          onChangeText={(text) => setCurrentGrade({ ...currentGrade, username: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Marks Here"
          value={currentGrade.grade}
          onChangeText={(text) => setCurrentGrade({ ...currentGrade, grade: text })}
        />
        <Button title="Submit Grade" onPress={handleGradeSubmit} />
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


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dashboard: {
    width: '90%',
    maxWidth: 400,
    borderRadius : 36,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color : "rgba(255, 255, 255, 0.7)",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom:20,
    color : "rgba(255, 255, 255, 0.7)",
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '100%',
    color : "rgba(255, 255, 255, 0.7)",
  },
});
