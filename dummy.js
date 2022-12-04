import { useState } from "react"
import axios from "axios"
const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIzNDU5NDNmNi1lNjM0LTRiMDUtOGNlNS1jMzRkM2Q4Mjc1ZGEiLCJlbWFpbCI6ImhhYnNreTk2QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlMjc1YTdhMDlmYmY3YzMyMzBhZCIsInNjb3BlZEtleVNlY3JldCI6IjZkZDQ2MmQ3M2M4YWRjNWU4N2ZmNjU3NzM1M2FlYWMzYmU5NWRkOTM2YTkwMmE4YjU1MDAyMDFmYzYxZDU3ZWIiLCJpYXQiOjE2Njk3MTY1OTd9.ylrErDzHh6F8WGfNPQ2qe93izFGea4cmtA3w0dvU5Os`

const FileUpload = () => {

  const [selectedFile, setSelectedFile] = useState();

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmission = async() => {

    const formData = new FormData();
    
    formData.append('file', selectedFile)

    const metadata = JSON.stringify({
      name: 'File name',
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
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
    <label class="form-label">Choose File</label>
    <input type="file"  onChange={changeHandler}/>
    <button onClick={handleSubmission}>Submit</button>
    </>
  )
}

export default FileUpload