import axios from 'axios'
const JWT = `Bearer ` + process.env.NEXT_PUBLIC_JWT;


const handleFileSubmission = async(file,fileName) => {

    const formData = new FormData();
    
    formData.append('file', file)

    const metadata = JSON.stringify({
      name: fileName
    });
    formData.append('pinataMetadata', metadata);
    
    const options = JSON.stringify({
      cidVersion: 0,
    })
    formData.append('pinataOptions', options);

    try{
      const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        maxBodyLength: "Infinity",
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          Authorization: JWT
        }
      });
 //     console.log(res.data);
      return  res.data;
    } catch (error) {
   //   console.log(error);
    }
  };


  const handleStringUpload = async(value) => {
    var data = JSON.stringify({
      "pinataOptions": {
        "cidVersion": 1
      },
      "pinataMetadata": {
        "name": "testing",
        "keyvalues": {
          "customKey": "customValue",
          "customKey2": "customValue2"
        }
      },
      "pinataContent": value
    });
    
    var config = {
      method: 'post',
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': JWT
      },
      data : data
    };
    
    const res = await axios(config);
    
//    console.log(res.data);

    return res.data;
  }


export {handleFileSubmission,handleStringUpload}