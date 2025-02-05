import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Trash2 } from "lucide-react";

const columnColors = {
  Applied: "bg-blue-300 border-blue-600 text-gray-900",
  Interview: "bg-yellow-300 border-yellow-600 text-gray-900",
  Offer: "bg-green-300 border-green-600 text-gray-900",
  Rejected: "bg-red-300 border-red-600 text-gray-900",
};

export default function JobTracker() {
  const [jobs, setJobs] = useState({ Applied: [], Interview: [], Offer: [], Rejected: [] });
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsCollection = collection(db, "jobs");
      const jobSnapshot = await getDocs(jobsCollection);
      const jobData = { Applied: [], Interview: [], Offer: [], Rejected: [] };
      
      jobSnapshot.forEach((doc) => {
        const job = { id: doc.id, ...doc.data() };
        jobData[job.status].push(job);
      });
      
      setJobs(jobData);
    };
    
    fetchJobs();
  }, []);

  const addJob = async () => {
    if (!company || !title) return;
    const newJob = { company, title, status: "Applied" };
    const docRef = await addDoc(collection(db, "jobs"), newJob);
    setJobs((prev) => ({
      ...prev,
      Applied: [...prev.Applied, { id: docRef.id, ...newJob }],
    }));
    setCompany("");
    setTitle("");
  };

  const deleteJob = async (jobId, status) => {
    await deleteDoc(doc(db, "jobs", jobId));
    setJobs((prev) => ({
      ...prev,
      [status]: prev[status].filter((job) => job.id !== jobId),
    }));
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    
    setJobs((prev) => {
      const sourceCol = result.source.droppableId;
      const destCol = result.destination.droppableId;
      const jobList = Array.from(prev[sourceCol]);
      const [movedJob] = jobList.splice(result.source.index, 1);
      movedJob.status = destCol;
      
      updateDoc(doc(db, "jobs", movedJob.id), { status: destCol });
      
      return {
        ...prev,
        [sourceCol]: jobList,
        [destCol]: [...prev[destCol], movedJob],
      };
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans min-h-screen bg-gray-900 bg-gradient-to-br from-gray-800 to-gray-900 text-white"> 
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input placeholder="Company Name" value={company} onChange={(e) => setCompany(e.target.value)} className="p-3 rounded-lg border border-[#006d77] focus:ring w-full md:w-1/3 bg-gray-700 text-white" />
        <Input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} className="p-3 rounded-lg border border-[#006d77] focus:ring w-full md:w-1/3 bg-gray-700 text-white" />
        <Button onClick={addJob} className="bg-[#006d77] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#005a66] w-full md:w-auto">Add Job</Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 bg-gray-800 p-4 md:p-6 rounded-xl shadow-xl w-full overflow-x-auto"> 
          {Object.keys(jobs).map((status) => (
            <Droppable key={status} droppableId={status}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className={`p-4 rounded-lg min-h-[500px] flex-1 border ${columnColors[status]} shadow-md bg-gray-700 w-full min-w-[250px]`}> 
                  <h2 className="font-bold text-lg mb-3 text-center uppercase tracking-wide text-gray-900">{status}</h2>
                  <div className="space-y-3">
                    {jobs[status].map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="relative group">
                            <Card className="p-4 rounded-lg shadow-lg border bg-gray-800 hover:shadow-xl transition-all">
                              <CardContent>
                                <h3 className="text-lg font-semibold">{job.company}</h3>
                                <p className="text-gray-600 text-sm">{job.title}</p>
                                <button onClick={() => deleteJob(job.id, job.status)} className="absolute top-2 right-2 hidden group-hover:block text-red-500 hover:text-red-700">
                                  <Trash2 size={20} />
                                </button>
                              </CardContent>
                            </Card> 
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
