'use client'
import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import Link from 'next/link';
import Image from 'next/image';


export default function Page() {
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
    return (
        <div className="mx-auto max-w-6xl w-full m-1">
            <header className="text-gray-600 body-font bg-yellow-100">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                    <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Image src="/notes.png" width={80} height={80} alt="" />
                    </Link>
                </div>
            </header>
            <div className='border-[1px] border-yellow-500 border-opacity-40 rounded-md mt-2 flex flex-row gap-x-6 flex-wrap justify-center'>
                {
                    notes.map((note) => (
                        <div className="note-paper w-72 relative">
                            <span
                                className="px-2.5 mx-4 absolute top-28 inline-flex items-center justify-center rounded-full bg-yellow-900 py-0.5 text-white font-medium"
                            >
                                <p className="whitespace-nowrap text-lg text-white font-medium  hover:text-yellow-500  cursor-pointer">See the discussion</p>
                            </span>
                            <h1 className="pt-14 text-yellow-800 px-1"><b>Published by <span className='text-yellow-600'>{note.userid}</span> </b> </h1>
                            <h1 className="pt-14 text-yellow-800 px-2"><b>Subject Name: <span className='text-yellow-600'>{note.subject}</span></b> </h1>
                            <h1 className="pt-2 text-yellow-800 px-3"><b>Teacher Name: <span className='text-yellow-600'>{note.teacher}</span></b> </h1>
                            <h1 className="pt-2 text-yellow-800 w-72 px-5" style={{ wordWrap: 'break-word' }}><b>Note Details: <span className='text-yellow-600'>{note.noteText}</span></b> </h1>
                            <span
                                className="px-2.5 mx-4 mt-4 absolute bottom-4 inline-flex items-center justify-center rounded-full bg-yellow-900 py-0.5 text-white font-medium   "
                            >
                                <p className="whitespace-nowrap text-sm text-white font-semibold cursor-pointer hover:text-yellow-500 ">+ 0</p>
                            </span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}








