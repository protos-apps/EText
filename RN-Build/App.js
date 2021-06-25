import React from 'react';
import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { setNavigator } from './src/navigationRef';
// Context
import { Provider as AuthProvider } from './src/context/AuthContext';
// Screens
import SignUpScreen from './src/screens/SignUpScreen';
import SignInScreen from './src/screens/SignInScreen';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen';
import ConversationsScreen from './src/screens/ConversationsScreen';
import AccountScreen from './src/screens/AccountScreen';

const switchNavigator = createSwitchNavigator({
  //ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    ResetPasswordScreen: ResetPasswordScreen
  }),
  mainFlow: createBottomTabNavigator({
    Conversations: ConversationsScreen,
    Account: AccountScreen
  })
});

const App = createAppContainer(switchNavigator);

export default () => {
  return (
    <AuthProvider>
      <App ref={(navigator) => { setNavigator(navigator) }} />
    </AuthProvider>
  );
};