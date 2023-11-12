'use client'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

export default function page() {
    const [note, setNote] = useState([]);
    const pathname = usePathname();
    const id = extractPartAfterSecondSlash(pathname);

    function findObjectWithId(array, targetId: string) {
        for (const obj of array) {
            if (obj.id === targetId) {
                return obj;
            }
        }
        return 0;
    }

    useEffect(() => {
        const q = query(collection(getFirestore(), "notes"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notes = [];
            querySnapshot.forEach((doc) => {
                notes.push({ ...doc.data(), id: doc.id });
            });
            const resultNote = findObjectWithId(notes, id);
            setNote(resultNote)
            console.log(resultNote)
        })
    }, []);

    function extractPartAfterSecondSlash(inputString: string) {
        const parts = inputString.split('/');
        if (parts.length >= 3) {
            return parts[2];
        }
        return 'none';
    }

    return (
        <div>
            <header className="text-gray-600  header-bg">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                    <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Image src="/notes.png" width={80} height={80} alt="" className="transform scale-150" />
                    </Link>
                </div>
            </header>
            <div className='border-[1px] border-yellow-500 border-opacity-40 rounded-md mt-2 flex flex-row gap-x-6 flex-wrap justify-center py-7 mx-8'>
                {

                    <div className="note-paper w-72 relative">
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
                }
            </div>
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion (20)</h2>
                    </div>
                    <form className="mb-6">
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label htmlFor="comment" className="sr-only">Your comment</label>
                            <textarea id="comment" rows="6"
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..." required></textarea>
                        </div>
                        <button type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-800 rounded-lg focus:ring-4 focus:ring-yellow-800 dark:focus:ring-yellow-800 hover:bg-yellow-800">
                            Post comment
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}