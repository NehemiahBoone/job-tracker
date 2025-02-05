import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ company: "", title: "", status: "applied" });

  useEffect(() => {
    const fetchJobs = async () => {
      const jobCollection = await getDocs(collection(db, "jobs"));
      setJobs(jobCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchJobs();
  }, []);

  const addJob = async () => {
    if (!newJob.company || !newJob.title) return;
    await addDoc(collection(db, "jobs"), newJob);
    setNewJob({ company: "", title: "", status: "applied" });
    window.location.reload(); // Temporary refresh
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Job Tracker</h1>
      
      <div className="mb-4">
        <input type="text" placeholder="Company" value={newJob.company}
          onChange={e => setNewJob({ ...newJob, company: e.target.value })}
          className="border p-2 w-full mb-2" />
        <input type="text" placeholder="Job Title" value={newJob.title}
          onChange={e => setNewJob({ ...newJob, title: e.target.value })}
          className="border p-2 w-full mb-2" />
        <button onClick={addJob} className="bg-blue-500 text-white px-4 py-2">Add Job</button>
      </div>

      <div className="space-y-2">
        {jobs.map(job => (
          <div key={job.id} className="p-4 border rounded shadow">
            <h2 className="text-lg font-bold">{job.company}</h2>
            <p>{job.title}</p>
            <p className="text-sm text-gray-600">Status: {job.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
