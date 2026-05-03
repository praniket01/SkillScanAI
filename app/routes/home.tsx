import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import { resumes } from "~/constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "SKill Scan" },
    { name: "description", content: "One stop solution for your Resume Analysis!" },
  ];
}


export default function Home() {

    const { auth, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumesus, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        if(!auth.isAuthenticated) navigate('/auth?next=/');
    } , [auth.isAuthenticated])

    useEffect(() => {
      const loadResumes = async () => {
        setLoading(true);

        const resumes = (await kv.list('resume:*',true)) as KVItem[];

        const parseReesumes = resumes?.map((resume) => (
          JSON.parse(resume.value) as Resume
        ))

        setResumes(parseReesumes || []);
        setLoading(false);
      }

      loadResumes();
    },[])

  return <main className="bg-[url(/images/bg-main.svg)] bg-cover">
    <Navbar />
    <section className="main-section">
      <div className="main-heading">
        <h1> Track Your Applicatioins & Resume Ratings</h1>
        { !loading && resumesus?.length === 0 ? (
        <h2>No resumes found. Upload your first resume to get feedback.</h2>
        ) : 
        (
          <h2>Review your submissions and check AI-powered feedback.</h2>
        )}
      </div>
       {loading && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

      {!loading && resumesus?.length > 0 && (
        <div className="resumes-section">
          {resumesus.map((resume) => (
            <ResumeCard key={resume.id} resume={resume}/>
          ))}
        </div>
      )}

      {!loading && resumesus?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>

  </main>;
}
