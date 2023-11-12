'use client'
import signUp from "@/firebase/auth/signup";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import Link from 'next/link';
import Image from 'next/image';


function Page(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isTeacher, setIsTeacher] = useState(false);
  const router = useRouter();

  // Handle form submission
  const handleForm = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Attempt to sign up with provided email and password
    const { result, error } = await signUp(email, password);
    const db = getDatabase();
    set(ref(db, 'users/' + result.user.uid), {
      email: email,
      isTeacher: isTeacher
    });

    if (error) {
      // Display and log any sign-up errors
      console.log(error);
      return;
    }

    // Sign up successful
    console.log(result);

    // Redirect to the admin page
    router.push("/notes");
  }

  return (
    <section className="text-gray-600 ">

      <header className="text-gray-600  header-bg">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <Image src="/notes.png" width={80} height={80} alt="" />
          </Link>
        </div>
      </header>
      <form onSubmit={handleForm} className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">Professors make special notes that help students understand tricky stuff better.</h1>
          <p className="leading-relaxed mt-4">These notes are like a map that shows the way to do well in school.</p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">Sign Up</h2>
          <div className="relative mb-4">
            <label htmlFor="full-name" className="leading-7 text-sm text-gray-600">e-mail</label>
            <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Password</label>
            <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" className="w-full bg-white rounded border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
          <div className="m-5 space-y-10">
            <fieldset>
              <div className="mt-6 space-y-6">
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="teacher"
                      name="teacher"
                      type="checkbox"
                      onChange={(e) => setIsTeacher(true)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="teacher" className="font-medium text-gray-900">
                      Teacher
                    </label>
                    <p className="text-gray-500">Choosing this option makes you a teacher.</p>
                  </div>
                </div>
                <div className="relative flex gap-x-3">
                  <div className="flex h-6 items-center">
                    <input
                      id="offers"
                      name="offers"
                      type="checkbox"
                      onChange={(e) => setIsTeacher(false)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                  </div>
                  <div className="text-sm leading-6">
                    <label htmlFor="offers" className="font-medium text-gray-900">
                      Student
                    </label>
                    <p className="text-gray-500">Choosing this option makes you a student.</p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <button className="text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg" type="submit">Sign Up</button>
          <p className="text-xs text-gray-500 mt-3">Education is learning for growth and progress.</p>
        </div>
      </form>
    </section>
  );
}

export default Page;


















