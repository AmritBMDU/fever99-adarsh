////development
// export const fileurl = 'http://192.168.0.49:4022';

////production
// export const fileurl = 'http://192.168.1.8:8000';
export const fileurl = 'https://api.fever99.com';


export const url = `${fileurl}/api`;


export const generateFilePath = (fileName) => {
  if (typeof fileName != 'string') {
    return fileName;
  }

  if (fileName.startsWith('http')) {
    return fileName;
  }
  return `${fileurl}/${fileName}`;
};

export const logoImgUrl = url + '/logo/logo.png';

export default url