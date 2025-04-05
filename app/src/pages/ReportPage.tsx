import Navbar from "@/components/ui/Navbar"

function ReportPage() {
    return (
        <div>
            <Navbar/>
            <main className="flex flex-grow items-center justify-center px-4 md:px-8 m-10">
                <div id="Analysis" >
                    {/*Heading*/}
                    <h1 className="text-[5rem] text-center font-bold text-blue-800 font-theme tracking-wide mb-2 ">
                        Analysis
                    </h1>

                    {/*Graph*/}
                    <img>
                    
                    </img>

                    {/*Text Report*/}
                    <p id="data" className="bg-gray-100 p-5"> 

                    </p>
                </div>
            </main>
        </div>
    )
}

export default ReportPage