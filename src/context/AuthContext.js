import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from './createDataContext';
import etextApi from '../api/etext';
import { navigate } from '../navigationRef';

const authReducer = (state, action) => {
    switch(action.type){
        case 'add_error':
            console.log(action.payload);
            return { ...state, errorMessage: action.payload };
        case 'sign_in':
            return { ...state, token: action.payload, errorMessage: '' };
        case 'sign_out':
            return { ...state, token: null, errorMessage: '' };
        case 'get_user_info':
            return { ...state, user: action.payload, errorMessage: '' }
        default:
            return state;
    }
};

const signIn = (dispatch) => async ({ email, password }) => {
    try{
        const response = await etextApi.post('/signin', { email, password });
        console.log(response.data.token)
        await AsyncStorage.setItem('token', response.data.token);
        dispatch({ type: 'sign_in', payload: response.data.token });
        navigate('mainFlow');
    }
    catch(err){
        console.log(`Error Occured: ${err}`);
        dispatch({ type: 'add_error', payload: err });
    }
};

const signUp = (dispatch) => async ({ email, username, password, passwordConfirm }) => {
    if(password !== passwordConfirm){
        dispatch({ type: 'add_error', payload: 'Passwords must match' });
    }
    else{
        try{
            const response = await etextApi.post('/signup', { email, username, password });
            await AsyncStorage.setItem('token', response.data.token);
            dispatch({ type: 'sign_in', payload: response.data.token });
            navigate('mainFlow');
        }
        catch(err){          
            console.log(`Error Occured: ${err}`);  
            dispatch({ type: 'add_error', payload: `An error occurred: ${err}` });
        }
    }
};

const signOut = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'signout' });
    navigate('loginFlow');
};

const getUserInfo = (dispatch) => async () => {
    try{
        const token = await AsyncStorage.getItem('token');
        const response = await etextApi.get('/', {
            headers: {
                authorization: token
            }
        });
        const { username, email } = response.data;
        dispatch({ type: 'get_user_info', payload: { username, email } });
    }
    catch(err){
        console.log('An error occured: ' + err);
        dispatch({ type: 'add_error', payload: `Ran into an error: ${err}` })
    }
}

const checkSignedIn = (dispatch) => async () => {
    try{
        const token = await AsyncStorage.getItem('token');
        const { email, username } = await etextApi.get('/', {
            headers: {
                authorization: token
            }
        });
        navigate('mainFlow');
    }
    catch(err){
        dispatch({ type: 'add_error', payload: `Ran into an error: ${err}` });
        navigate('loginFlow');
    }
}

export const { Provider, Context } = createDataContext(
    authReducer,
    { signIn, signUp, checkSignedIn, signOut, getUserInfo },
    { /*isSignedIn: false,*/ user: {}, errorMessage: '' }
);

