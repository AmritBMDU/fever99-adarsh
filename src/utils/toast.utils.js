// import toast from 'react-hot-toast'
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

export const toastError = (error, note = "Error") => {
  console.error(JSON.stringify(error, null, 2), "error");
  if (typeof error?.response?.data?.message == 'string') {
    Toast.show({
      type: 'error',
      text1: note != "" && note ? note : 'Error',
      text2: error?.response?.data?.message,
    });
  }
  // alert(error?.response?.data?.message)
  else if (typeof error?.message == 'string') {
    Toast.show({
      type: 'error',
      text1: note != "" && note ? note : 'Error',
      text2: error?.message,
    });
  }
  // alert(error.message)
  else if (typeof error == 'string') {
    Toast.show({
      type: 'error',
      text1: note != "" && note ? note : 'Error',
      text2: error,
    });
  }
  // alert(error)
  // alert("ERROR")
  else {
    Toast.show({
      type: 'error',
      text1: note != "" && note ? note : 'Error',
    });
  }
};


export const alertError = (note = "", error) => {
  console.error(error);
  if (typeof error?.response?.data?.message == 'string') {
    Alert.alert(error?.response?.data?.message)

  }
  // alert(error?.response?.data?.message)
  else if (typeof error?.message == 'string') {
    Alert.alert(error?.message)
  }
  // alert(error.message)
  else if (typeof error == 'string') {
    Alert.alert(error)
  }
  // alert(error)
  // alert("ERROR")
  else {
    Alert.alert(note != "" && note ? note : 'Error')
  }
};


export const toastSuccess = (message) => {
  Toast.show({
    type: 'success',
    text1: 'Success',
    text2: message,
  });
  // alert(message)
};
