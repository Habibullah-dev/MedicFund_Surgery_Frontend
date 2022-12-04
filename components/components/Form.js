import styled from "styled-components"
import { Description, FileCopyRounded, Tune } from "@mui/icons-material"
import { SendRounded } from "@mui/icons-material"
import { createContext ,useState} from "react"
import { toast } from "react-toastify"
import { FidgetSpinner,TailSpin } from "react-loader-spinner"
import { handleFileSubmission,handleStringUpload } from "../../helpers/pinataUpload"
import { ethers } from "ethers"
import SurgeryFactory  from '../../contracts/SurgeryFactory.sol/SurgeryFactory.json'

// const uploaded = await client.add(form.description);
// setDescriptionUrl(uploaded.path)

const Form = () => {
  const [form,setForm] = useState({
    title:"",
    description:"",
    requiredAmount:"",
    deadline:""
  });

  const [image,setImage] = useState(null)

  const [document,setDocument] = useState(null)

  
  const ImageHandler = (e)=> {
   // console.log(e.target.files);
    setImage(e.target.files[0]);
  }

  const DocumentHandler = (e) => {
  //  console.log(e.target.files);
    setDocument(e.target.files[0]);
  }

  const FormHandler = (e) => {
    setForm({
      ...form,
      [e.target.name] : e.target.value,
    });
  }

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);


  const [descriptionUrl,setDescriptionUrl] = useState()
  const [imageUrl,setImageUrl] = useState()
  const [documentUrl,setDocumentUrl] = useState()


  const uploadFilesToIpfs = async (e) => {
    e.preventDefault();

    setUploading(true);

    if(form.description !== '') {
      try {
      const data = await handleStringUpload(form.description);
      setDescriptionUrl('https://gateway.pinata.cloud/ipfs/' + data.IpfsHash);

      }catch(e) {
          toast.warn("Error Occur While Uploading Desciption");
      }
    }

    if(image !== null) {
      try {
         const data = await handleFileSubmission(image,'Image Photo');
         setImageUrl('https://gateway.pinata.cloud/ipfs/' + data.IpfsHash);
      }catch(e) {
          toast.warn("Error Occur While Uploading Image");
      }
    }

    if(document !== null) {
      try {
        const data = await handleFileSubmission(document,'Document File');
        setDocumentUrl('https://gateway.pinata.cloud/ipfs/' + data.IpfsHash);
      }catch(e) {
          toast.warn("Error Occur While Uploading Document");
      }
    }

    setUploading(false);
    setUploaded(true);
    toast.success("Upload Completed Successfully")

  }


  const [loading,setLoading] = useState(false);
  const [address,setAddress] = useState("");

  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  const handleSubmitSugery = async(e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if(form.title == "") {
        toast.warn("Title Field Is Empty");
    } else if(form.description == "") {
       toast.warn("Description Field Is Empty");
    } else if(form.requiredAmount == "") {
      toast.warn("Required  Amount Field Is Empty");
    } else if(form.deadline == "") {
      toast.warn("Deadline is  EMpty");
    } else if (parseInt(new Date(form.deadline).getTime()) < new Date().getTime())
      {
        toast.warn('Deadine should be in the future')
      }
    else {
      setLoading(true);
    }

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      SurgeryFactory.abi,
      signer
    );
    

    
    const requiredAmount = ethers.utils.parseEther(form.requiredAmount);

    const surgeryData = await contract.createfromSurgery(
      form.title,
      descriptionUrl,
      documentUrl,
      imageUrl,
      parseInt(new Date(form.deadline).getTime()) ?? 0,
      requiredAmount
    )

    console.log(form.title,descriptionUrl,documentUrl,imageUrl,parseInt(new Date(form.deadline).getTime()),requiredAmount)

    await surgeryData.wait();

    setAddress(surgeryData.to);

}



  return (
      <>
        {
          loading == true ? (address == '' 
            ? <BackdropSpinner> <TailSpin height={100} color={'white'} /> </BackdropSpinner>
            
            : <SurgerySubmit> 
                  <h1>Surgery Funding Created Successfully</h1>
                  <h2>{address}</h2>
                  <ButtonSubmit style={{marginTop:'20px',height:'60px',fontSize:'30px'}}>View Surgeries</ButtonSubmit>
            </SurgerySubmit>)
          : 
      <FormWrapper>
        <FormHeader><u>Surgery Funding Form</u></FormHeader>
        <FormInput>
            <Label>Surgery Title</Label>
            <Input placeholder="Surgery Name" onChange={FormHandler} required={true} name="title" value={form.title}></Input>
        </FormInput>
        <FormInput>
            <Label>Required Amount</Label>
            <Input placeholder="Amount Required" onChange={FormHandler} name="requiredAmount" required={true} value={form.requiredAmount} type={'number'}></Input>
        </FormInput>
        <FormInput>
            <Label>Description</Label>
            <TextArea placeholder="Surgery Description" onChange={FormHandler}  name="description" value={form.description} required={true}></TextArea>
        </FormInput>
        <FormInput>
            <Label>Image</Label>
            <Input placeholder="Patient Image" type={'file'} onChange={ImageHandler} accept={'image/*'} required={true}></Input>
        </FormInput>
        <FormInput>
            <Label>Hospital Signed Document</Label>
            <Input placeholder="Signed Hospital Document" onChange={DocumentHandler} type={'file'} required={true}></Input>
        </FormInput>
        <FormInput>
            <Label>Surgery Deadline</Label>
            <DateInput placeholder="Surgery Deadline" onChange={FormHandler} name="deadline" value={form.deadline} type={'date'} required={true} ></DateInput>
        </FormInput>


        <ButtonGroup>  
         {
          uploading == true ? 
          <ButtonUpload disabled={true}>
            <TailSpin color='white' height={30}/> 
          </ButtonUpload> :
          uploaded == false ?
          <ButtonUpload onClick={uploadFilesToIpfs}>
              <FileCopyRounded />
              &nbsp;
              Ipfs File Upload
          </ButtonUpload>
          :
          <ButtonUpload disabled={uploaded}>Files Uploaded</ButtonUpload>
          } 

          <ButtonSubmit disabled={!uploaded} onClick={handleSubmitSugery}>
              <SendRounded />
              &nbsp;
              Submit
          </ButtonSubmit>
        </ButtonGroup>
   
      </FormWrapper>

          }
      </>
  )
}


const SurgerySubmit = styled.div`
   background-color: ${(props) => props.theme.divBackground2};
   display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  flex-direction: column;
  height: 50vh;
  width: 50%;
  margin-top: 100px;
  border-radius: 20px;


`

const BackdropSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;

`
const FormWrapper = styled.form`
    margin-top: 50px;
    width: 800px;
    background-color: ${(props) => props.theme.divBackground2};
    min-height: 80vh;
    border-radius: 30px;
    box-shadow: 5px 5px 2px rgba(0,0,0,.3);
    padding: 10px ;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;
    
`

const FormHeader = styled.h1`
    text-align: center;
    font-size: 32px;
`

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 5px 10px;
`

const Input = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.divBackground1} ;
  color:${(props) => props.theme.color} ;
  border: ${(props) => props.theme.border };
  border-radius:8px ;
  outline:none;
  font-size:large;
`

const DateInput = styled.input`
  padding:15px;
  background-color:${(props) => props.theme.divBackground1} ;
  color:${(props) => props.theme.color} ;
  border: ${(props) => props.theme.border };
  border-radius:8px ;
  outline:none;
  font-size:large;
  /* &::-webkit-textfield-decoration-container{
    position: absolute;
    left: 0;
    top: 0;
    padding: 0px;
    width: 100%;
    height: 100%;
    cursor: pointer;
  } */

`

const Label = styled.p`
  font-size: 20px;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color:${(props) => props.theme.color} ;
`

const TextArea = styled.textarea`
  background-color: ${(props) => props.theme.divBackground1};
  color:${(props) => props.theme.color} ;
  border: ${(props) => props.theme.border };
  border-radius:8px ;
  outline:none;
  width: 98%;
  margin: 5px 10px;
  min-height:160px ;
  &::placeholder {
    font-size: 20px;
    padding: 15px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  width: 80%;
  justify-content: space-between;
`
const ButtonUpload = styled.button`
  background-color: blue;
  margin: 10px 0px;
  outline: none;
  color:${(props) => props.theme.color} ;
  color: white;
  border: none;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 25px;
  margin-right: 5px;
  &:disabled {
    background-color: grey;
    cursor: no-drop;
  }

`

const ButtonSubmit = styled.button`
  background-color: green;
  outline: none;
  margin: 10px 0px;
  color: white;
  border: none;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 25px;
  margin-left: 5px;
  &:disabled {
    background-color: grey;
    cursor: no-drop;
  }

`

export default Form