import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  Linking,
  Text,
  Image,
} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Amplify, {Hub, Auth} from 'aws-amplify';
import {
  Authenticator,
  SignIn,
  SignUp,
  ConfirmSignUp,
  ForgotPassword,
} from 'aws-amplify-react-native';
import config from './src/aws-exports';

import HomeScreen from './src/screens/Home_Screen';
import MatchesScreen from './src/screens/Matches_Screen';
import ProfileOptionScreen from './src/screens/ProfileOption_Screen';
import LikingMeScreen from './src/screens/Liking_Me_Screen';

import logo from './assets/images/logo.png';
import fbLogin from './assets/images/fbLogin.png';
import gLogin from './assets/images/gLogin.png';
import robo from './assets/images/robo.png';
import zaloguj from './assets/images/zaloguj.png';

Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
  oauth: {
    ...config.oauth,
    urlOpener,
  },
});

async function urlOpener(url, redirectUrl) {
  await InAppBrowser.isAvailable();
  const {type, url: newUrl} = await InAppBrowser.openAuth(url, redirectUrl, {
    showTitle: false,
    enableUrlBarHiding: true,
    enableDefaultShare: false,
    ephemeralWebSession: false,
  });

  if (type === 'success') {
    Linking.openURL(newUrl);
  }
}

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [user, setUser] = useState(null);

  const activeColor = '#f18c15';
  const color = '#5dbcd2';

  useEffect(() => {
    const listener = Hub.listen('datastore', async hubData => {
      const {event, data} = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        setIsUserLoading(false);
      }
    });

    return () => listener();
  }, []);

  useEffect(() => {
    Hub.listen('auth', ({payload: {event, data}}) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then(userData => setUser(userData));
          break;
        case 'signOut':
          setUser(null);
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
      }
    });

    getUser().then(userData => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => userData)
      .catch(() => console.log('Not signed in'));
  }

  const handleAuthStateChange = state => {
    if (state === 'signedIn') {
      console.log('zalogowany');
      setActiveScreen('HOME');
    }
    if (state === 'signedOut') {
      console.log('wylogowany');
      setActiveScreen('');
    }
  };

  const renderPage = () => {
    console.log('renderPage');
    console.log('activeScreen: ', activeScreen);
    console.log('user:', user);
    if (activeScreen === 'HOME') {
      return <HomeScreen isUserLoading={isUserLoading} />;
    }
    if (activeScreen === 'LOGIN') {
      return (
        <Authenticator hideDefault={true} onStateChange={handleAuthStateChange}>
          <SignIn />
          <SignUp />
          <ConfirmSignUp />
          <ForgotPassword />
        </Authenticator>
      );
    }

    if (isUserLoading) {
      return <ActivityIndicator style={{flex: 1}} />;
    }
    if (activeScreen === 'LIKING_ME') {
      return <LikingMeScreen />;
    }
    if (activeScreen === 'CHAT') {
      return <MatchesScreen />;
    }
    if (activeScreen === 'OPTIONS') {
      return <ProfileOptionScreen />;
    }
  };

  const render = () => {
    console.log('render:');
    console.log('user: ', user);
    console.log('activeScreen: ', activeScreen);
    if (user) {
      return (
        <View style={styles.pageContainer}>
          <View style={styles.topNavigationBar}>
            <Pressable onPress={() => setActiveScreen('HOME')}>
              <Octicons
                name="flame"
                size={40}
                color={activeScreen === 'HOME' ? activeColor : color}
              />
            </Pressable>
            <Pressable onPress={() => setActiveScreen('LIKING_ME')}>
              <MaterialCommunityIcons
                name="star-four-points"
                size={40}
                color={activeScreen === 'LIKING_ME' ? activeColor : color}
              />
            </Pressable>
            <Pressable onPress={() => setActiveScreen('CHAT')}>
              <Ionicons
                name="ios-chatbubbles"
                size={40}
                color={activeScreen === 'CHAT' ? activeColor : color}
              />
            </Pressable>
            <Pressable onPress={() => setActiveScreen('OPTIONS')}>
              <FontAwesome5
                name="robot"
                size={40}
                color={activeScreen === 'OPTIONS' ? activeColor : color}
              />
            </Pressable>
          </View>
          {renderPage()}
        </View>
      );
    }

    if (activeScreen === 'LOGIN') {
      console.log('active screen LOGIN');
      return <View style={styles.pageContainer}>{renderPage()}</View>;
    }

    return (
      <View style={styles.loginPage}>
        <Text style={styles.loginText}>WITAJ W</Text>
        <Image source={logo} />
        <Image source={robo} />
        <Pressable onPress={() => setActiveScreen('LOGIN')}>
          <Image source={zaloguj} style={styles.loginButton} />
        </Pressable>
        <Pressable onPress={() => Auth.federatedSignIn({provider: 'Facebook'})}>
          <Image source={fbLogin} resizeMode="contain" />
        </Pressable>
        <Pressable onPress={() => Auth.federatedSignIn({provider: 'Google'})}>
          <Image source={gLogin} resizeMode="contain" />
        </Pressable>
      </View>
    );
  };

  return <SafeAreaView style={styles.root}>{render()}</SafeAreaView>;
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#373737',
  },
  root: {
    flex: 1,
  },
  topNavigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#202020',
    alignItems: 'center',
  },
  loginPage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#373737',
  },
  loginText: {color: '#979797', fontSize: 20, fontWeight: 'bold'},
  loginButton: {
    marginBottom: 10,
  },
});

export default App;
