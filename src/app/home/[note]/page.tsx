'use client'
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { arrayUnion, collection, onSnapshot, query } from "firebase/firestore";
import { doc, updateDoc, } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import { useAuthContext } from "@/context/AuthContext";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export interface NoteInterface {
    comments?: Comment;
    id?: string;
    noteText?: string;
    subject?: string;
    teacher?: string;
    userid?: string;
}

export default function page() {
    const { user } = useAuthContext() as { user: any };
    const router = useRouter();
    const [isTeacher, setIsTeacher] = useState(false);
    const [note, setNote] = useState<NoteInterface | null>(null);
    const pathname = usePathname();
    const id = extractPartAfterSecondSlash(pathname);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (user == null) {
            router.push("/");
        }
    }, [user, router]);



    function findObjectWithId(array: Array<NoteInterface>, targetId: string) {
        for (const obj of array) {
            if (obj.id === targetId) {
                return obj;
            }
        }
        return null;
    }

    const db = getFirestore();
    useEffect(() => {
        const q = query(collection(getFirestore(), "notes"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const notes: NoteInterface[] = [];
            querySnapshot.forEach((doc) => {
                notes.push({ ...doc.data(), id: doc.id });
            });
    
            const resultNote: NoteInterface | null = findObjectWithId(notes, id);
            
            // Check if the note was found before setting the state
            if (resultNote !== null) {
                setNote(resultNote);
                console.log("note", resultNote);
            }
        });
    
        return () => {
            unsubscribe();
        };
    }, []);


    function extractPartAfterSecondSlash(inputString: string) {
        const parts = inputString.split('/');
        if (parts.length >= 3) {
            return parts[2];
        }
        return 'none';
    }

    function getPartBeforeAlt(str: string) {
        const parts = str.split('@');
        return parts[0];
    }

    const userid = user ? getPartBeforeAlt(user.email) : '';
    const cmtsRef = doc(db, "notes", id);

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


    const addComment = async (e: any) => {
        e.preventDefault()
        await updateDoc(cmtsRef, {
            comments: arrayUnion({ comment, userName: userid, isTeacher: isTeacher })
        })
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

    return (
        <div>
            <header className="text-gray-600 header-bg ">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
                    <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Image src="/notes.png" width={80} height={80} alt="" className='transform scale-150' />
                    </Link>
                    <button className="inline-flex items-center hover:text-gray-900 bg-yellow-600 text-gray-100 border-0 py-1 px-3 rounded cursor-pointer" onClick={handleSignOut}>Logout
                    </button>
                </div>
            </header>
            <div className='border-[1px] border-yellow-500 border-opacity-40 rounded-md mt-2 flex flex-row gap-x-6 flex-wrap justify-center py-7 mx-8'>
                {

                    <div className="note-paper w-72 relative h-full">
                        <h1 className="pt-10 text-yellow-800 px-1"><b>Published by <i><span className='text-yellow-600'>{note && note.userid}</span></i> </b> </h1>
                        <h1 className="pt-5 text-yellow-800 px-2"><b>Subject Name: <span className='text-yellow-600'>{note && note.subject}</span></b> </h1>
                        <h1 className="pt-2 text-yellow-800 px-3"><b>Teacher Name: <span className='text-yellow-600'>{note && note.teacher}</span></b> </h1>
                        <h1 className="pt-2 text-yellow-800 w-72 px-5" style={{ wordWrap: 'break-word' }}>
                            <b>Note Details: <span className='text-yellow-600'>{note && note.noteText}</span></b>
                        </h1>
                    </div>
                }
            </div>
            <section className="bg-white dark:bg-gray-900 py-8 lg:py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-white">Discussion ({note && note.comments ? note.comments.length : 0})</h2>
                    </div>

                    <form className="mb-6" onSubmit={addComment}>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label htmlFor="comment" className="sr-only">Your comment</label>
                            <textarea id="comment" rows={6}
                                className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..."
                                required
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-yellow-800 rounded-lg focus:ring-4 focus:ring-yellow-800 dark:focus:ring-yellow-800 hover:bg-yellow-800">
                            Post/ Reply to a  comment
                        </button>
                    </form>
                    {
                        note && note.comments && Array.isArray(note.comments) && note.comments.map((comment) => (
                            <article className="p-6 mb-3 ml-6 lg:ml-12 text-base bg-white rounded-lg dark:bg-gray-900">
                                <footer className="flex justify-between items-center mb-2">
                                    <div className="flex items-center">
                                        <p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white font-semibold">{comment && comment.userName}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{comment.isTeacher ? 'Teacher' : 'Student'}</p>
                                    </div>
                                </footer>
                                <p className="text-gray-500 dark:text-gray-400">{comment.comment}</p>
                            </article>
                        ))
                    }
                </div>
            </section>
        </div>
    )
}