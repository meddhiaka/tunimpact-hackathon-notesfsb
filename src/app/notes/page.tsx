'use client'
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getAuth, signOut } from "firebase/auth"; // Import Firebase Auth functions
import Image from "next/image";
import Link from "next/link";

export default function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

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

  function getPartBeforeAlt(str: string) {
    const parts = str.split('@');
    return parts[0];
  }

  const userid = user ? getPartBeforeAlt(user.email) : ''; // Check if user is not null

  useEffect(() => {
    if (user == null) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <div>
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center justify-between">
          <Link href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <Image src="/notes.png" width={50} height={50} alt="" />
            <span className="ml-3 text-xl text-yellow-700">notesfsb</span>
          </Link>
          <button className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0" onClick={handleSignOut}>Logout
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
    </div>
  );
}
