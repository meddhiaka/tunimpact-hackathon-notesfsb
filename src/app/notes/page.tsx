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
import { getDatabase, ref, set, get } from "firebase/database";
import { getDocs, onSnapshot, query } from "firebase/firestore";

export default function Page(): JSX.Element {
  const [isTeacher, setIsTeacher] = useState(false);
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [teacher, setTeacher] = useState('');
  const [noteText, setNoteText] = useState('');
  const db = getFirestore();
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const q = query(collection(getFirestore(), "notes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({ ...doc.data(), id: doc.id });
      });
      setNotes(notes);
      console.log(notes)
    })
  }, []);


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

  useEffect(() => {
    const userUid = user.uid;
    const db = getDatabase();
    const userRef = ref(db, 'users/' + userUid);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          console.log(userData)
          const userIsTeacher = userData.isTeacher;
          setIsTeacher(userIsTeacher);
        } else {
        }
      })
      .catch((error) => {
      });
  }, []);


  return (
    <div>
      <header className="text-gray-600 header-bg">
        <div className="container mx-auto flex flex-wrap p-5 flex-row my-auto items-center justify-between">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4">
            <Image src="/notes.png" width={80} height={80} alt="" className='transform scale-150' />
          </Link>
          <button className="inline-flex items-center hover:text-gray-900 bg-yellow-600 text-gray-100 border-0 py-1 px-3 rounded cursor-pointer" onClick={handleSignOut}>Logout
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </header>
      <div>
        <section className="bg-white dark:bg-gray-900">
          <div className="max-w-6xl px-6 py-10 mx-auto">
            {isTeacher ?
              (<div>
                <p className="text-xl font-medium text-yellow-500 ">Hello there <span><b>@{userid}</b></span>, You're logged in as a teacher👩🏻‍🏫!</p>
                <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                  Welcome to the dedicated page where you can view student notes and assist them with their issues as a teacher, You can't see the student form
                </h1>
              </div>)
              :
              (<div>
                <p className="text-xl font-medium text-yellow-500 ">Hello there <span><b>@{userid}</b></span>, You're logged in as a student👨‍🎓!</p>
                <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                  Welcome to the dedicated page for sharing your notes.
                </h1>
              </div>
              )
            }
          </div>
        </section>
      </div >

      {
        isTeacher ?
          (
            <div className='border-[1px] border-yellow-500 border-opacity-40 rounded-md mt-2 flex flex-row gap-x-6 flex-wrap justify-center py-7'>
              {
                notes.map((note) => (
                  <div className="note-paper w-72 relative">
                    <h1 className="pt-14 text-yellow-800 px-1"><b>Published by <span className='text-yellow-600'>{note.userid}</span> </b> </h1>
                    <h1 className="pt-14 text-yellow-800 px-2"><b>Subject Name: <span className='text-yellow-600'>{note.subject}</span></b> </h1>
                    <h1 className="pt-2 text-yellow-800 px-3"><b>Teacher Name: <span className='text-yellow-600'>{note.teacher}</span></b> </h1>
                    <h1 className="pt-2 text-yellow-800 w-72 px-5" style={{ wordWrap: 'break-word' }}><b>Note Details: <span className='text-yellow-600'>{note.noteText}</span></b> </h1>
                    <span
                      className="absolute bottom-[-15px] px-2.5 mx-4 inline-flex items-center justify-center rounded-full bg-yellow-900 py-0.5 text-white font-medium"
                    >
                      <Link href={`/home/${note.id}`}>
                        <p className="whitespace-nowrap text-lg text-white font-medium  hover:text-yellow-500 cursor-pointer">See the discussion</p>
                      </Link>
                    </span>
                  </div>
                ))
              }
            </div>
          ) :
          (
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
                  </div >

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
                          placeholder="ex. 3andi mochkla fel matiere X..."
                          className="block w-full rounded-md border-0 py-1.5 p-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
                          defaultValue={''}
                        />
                      </div>
                      <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about your problem ...</p>
                    </div>

                  </div>
                </div >
              </div >
              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-600"
                >
                  Publish
                </button>
              </div>
            </form >
          )
      }
    </div >
  );
}
