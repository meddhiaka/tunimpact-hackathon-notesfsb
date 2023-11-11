export default function Testi() {
    return (
        <div>
            <section className="bg-white dark:bg-gray-900">
                <div className="max-w-6xl px-6 py-10 mx-auto">
                    <p className="text-xl font-medium text-yellow-500 ">Welcome , </p>

                    <h1 className="mt-2 text-2xl font-semibold text-gray-800 capitalize lg:text-3xl dark:text-white">
                        your gateway to educational excellence through shared notes.
                    </h1>

                    <main className="relative z-20 w-full mt-8 md:flex md:items-center xl:mt-12">
                        <div className="absolute w-full bg-yellow-600 -z-10 md:h-96 rounded-2xl"></div>

                        <div className="w-full p-6 bg-yellow-600 md:flex md:items-center rounded-2xl md:bg-transparent md:p-0 lg:px-12 md:justify-evenly">
                            <img className="h-24 w-24 md:mx-6 rounded-full object-cover shadow-md md:h-[32rem] md:w-80 lg:h-[36rem] lg:w-[26rem] md:rounded-2xl" src="/landing.jpg" alt="" />

                            <div className="mt-2 md:mx-6">
                                <div>
                                    <p className="text-xl font-medium tracking-tight text-white">Med Dhia Kassab</p>
                                    <p className="text-yellow-200 ">2nd year computer science student.</p>
                                </div>

                                <p className="mt-4 text-lg leading-relaxed text-white md:text-xl"> “Welcome to the landing page of our hackathon project, FSBNotes! FSBNotes is a platform where the Faculty of Sciences of Bizerte can easily share notes with their professors, introducing a new simplified learning method. Explore the future of learning with us!”.</p>

                                <div className="flex items-center justify-between mt-6 md:justify-start">
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </section>
        </div>
    )
}