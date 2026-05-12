import { useEffect, useState } from "react";
import axios from "axios";
import logo from "./assets/images.png";
import { useNavigate } from "react-router-dom";

function History() {

  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://bulkmail-app-h92z.onrender.com/gethistory")
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <nav className="bg-blue-950 px-5 md:px-10 py-5 flex justify-between items-center flex-wrap">
        <div className="flex gap-3"><div>
          <img className="md:w-[70px] w-[60px]" src={logo} alt="Logo" /></div>
          <div>
            <h1 className="text-white text-3xl md:text-4xl font-extrabold">Bulkmail</h1>
            <p className="text-white text-sm md:mt-2">
              Email History Page
            </p>
          </div></div>
        <div>
          <button onClick={() => navigate("/home")} className="bg-white text-gray-600 font-bold px-3 md:py-2 py-1 rounded-lg">Back to Home</button>
        </div>
      </nav>

      <main className="bg-blue-50 md:px-10 px-5 min-h-screen md:py-8 py-5">

        <h2 className="text-2xl font-bold mb-5">Emails History</h2>

        <div className="space-y-4">

          {data.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded shadow">

              <h3 className="font-bold">Subject: {item.subject}</h3>

              <p className="mt-2">Message: {item.message}</p>

              <p className="mt-2">
                Recipients: {item.recipients.length}
              </p>

              <p className="mt-2">
                Status: {item.status}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                {new Date(item.date).toLocaleString()}
              </p>

            </div>
          ))}

        </div>

      </main>
    </div>
  );
}

export default History;