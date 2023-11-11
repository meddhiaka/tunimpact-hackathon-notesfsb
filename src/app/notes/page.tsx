'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Auth functions
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react'
import { title } from "process";
import { addDoc, collection } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";


export default function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [noteText, setNoteText] = useState('');
  const db = getFirestore();

  function getPartBeforeAlt(str: string) {
    const parts = str.split('@');
    return parts[0];
  }

  const userid = user ? getPartBeforeAlt(user.email) : ''; // Check if user is not null

  const handleNote = async (e: any) => {
    e.preventDefault();
    if (title !== '' && teacher !== '' && noteText !== '') {
      await addDoc(collection(db, "notes"), {
        subject,
        teacher,
        noteText,
        userid
      })
      setNoteText('');
      setSubject('');
      setTeacher('');
    }
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        router.push("/");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };


  useEffect(() => {
    if (user == null) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      <header className="text-gray-600 body-font bg-yellow-100">
        <div className="container mx-auto flex flex-wrap p-5 flex-row my-auto items-center justify-between">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4">
            <Image src="/notes.png" width={80} height={80} alt="" />
          </Link>
          <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4" onClick={handleSignOut}>Logout
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </header>
      <div>
        <section className="bg-white dark:bg-gray-900">
          <div className="max-w-6xl px-6 py-10 mx-auto">
            <p className="text-xl font-medium text-yellow-500 ">Welcome <b>@{userid}</b>, </p>

            <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
              Welcome to the dedicated page for sharing your notes.
            </h1>
          </div>
        </section>
      </div>


      <form className=" max-w-3xl mx-auto m-10 p-10 border-[1px] border-yellow-500 rounded-md" onSubmit={handleNote}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">Student form!</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">Creating the note with complete information.</p>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="col-span-full">
                  <label htmlFor="subject" className="block text-sm font-medium leading-6 text-gray-900">
                    Subject Name
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="ex. Théorie des graphes"
                      type="text"
                      name="subject"
                      id="subject"
                      className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="col-span-full">
                  <label htmlFor="teacher" className="block text-sm font-medium leading-6 text-gray-900">
                    @name of the teacher
                  </label>
                  <div className="mt-2">
                    <input
                      required
                      onChange={(e) => setTeacher(e.target.value)}
                      placeholder="ex. Foulen ben Foulen"
                      type="text"
                      name="teacher"
                      id="teacher"
                      className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label htmlFor="note" className="block text-sm font-medium leading-6 text-gray-900">
                  Your note
                </label>
                <div className="mt-2">
                  <textarea
                    required
                    onChange={(e) => setNoteText(e.target.value)}
                    id="note"
                    name="note"
                    rows={5}
                    className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                  />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your problem ...</p>
              </div>

            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
          >
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
