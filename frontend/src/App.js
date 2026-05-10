import { useState } from "react";
import * as XLSX from "xlsx"
import axios from "axios"
import logo from "./assets/images.png"
import { useNavigate } from "react-router-dom";

function App() {
  const [msg,setmsg] = useState("")
  const [status,setstatus] = useState(false)
  const [emailList,setemailList]  = useState([])
  const [fileName, setFileName] = useState("No file selected");
  const [subject, setSubject] = useState("");
  const navigate = useNavigate();

  function handlemsg(evt){
    setmsg(evt.target.value)
  }

  function handlesubject(evt){
  setSubject(evt.target.value)
}

  function handlefile(evt){
      const file =  evt.target.files[0]
      if (!file) return;
      console.log(file)
      setFileName(file.name);

      const reader = new FileReader()
      reader.onload = function(e){
        const data = e.target.result
        const workbook = XLSX.read(data, {type:"binary"})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:"A"})
        const totalemail = emailList.map(function(item){return item.A}).filter(function(email){return email})
        setemailList(totalemail)
      }
      
      reader.readAsBinaryString(file)
    }

  function send(){
    if (!subject || !msg || emailList.length === 0) {
    alert("Please fill all fields");
    return; }
    setstatus(true)

    axios.post("https://bulkmail-app-h92z.onrender.com/sendemail",{msg:msg,subject:subject,emailList:emailList})
    .then(function(data){
      if(data.data === true){
        alert("Email send Successfully")
        setstatus(false)
        setmsg("")
        setSubject("")
        setemailList([])
        setFileName("No file selected")
      }
      else{
        alert("Failed")
      }
    }).catch(function (error) {
      console.log(error);
      alert("Server Error");
      setstatus(false);
    });
  }

  return (
    <div>
      <nav className="bg-blue-950 px-10 py-5 flex justify-between items-center ">
        <div className="flex gap-3"><div>
        <img className="w-[70px]" src={logo} alt="Logo"/></div>
        <div><h1 className=" text-white text-4xl font-extrabold">Bulkmail</h1>
        <p className="text-white text-sm mt-2">Send personalized bulk emails quickly and efficiently</p></div></div>
        <div>
          <button onClick={() => navigate("/history")} className="bg-white text-gray-600 text-xlg font-bold px-3 py-2 rounded-lg">Go to History</button>
        </div>
      </nav>
      <main className="bg-blue-50 px-10 min-h-screen">
        <div className=" flex flex-col items-center ">
        <p className="text-2xl font-bold pt-7">We can help your business with sending multiple emails at once</p>
        <p>Upload your email list, type your message, and reach multiple recipients in just one click.</p></div>
        <div className="flex flex-col items-center pt-10">
        <input type="text" placeholder="Enter the Subject here..." value={subject} onChange={handlesubject} className="w-[75%] mb-3 px-2 py-2 outline-none border border-gray-300 rounded-md"/>
        <textarea className="w-[75%] h-32 px-2 py-2 outline-none border border-gray-300 rounded-md" placeholder="Enter the Email text here....." onChange={handlemsg} value={msg}></textarea>
        
        <div className="flex items-center gap-4 mt-5 mb-3">
        <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
          Upload Excel File
          <input type="file" accept=".xlsx,.xls" className="hidden" onChange={handlefile}/></label>

        <span className="text-gray-600">{fileName}</span>
      </div>

        <p className="text-lg font-semibold mb-5">Total Email in the file: {emailList.length}</p>
        <button disabled={status} className="bg-blue-900 text-white px-4 py-1 font-semibold rounded-md disabled:opacity-50" onClick={send}>{status?"Sending...":"Send"}</button></div>
      </main>
    </div>
  );
}

export default App;
