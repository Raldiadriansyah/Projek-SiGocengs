export default function Budget(){
    return(
<div className="flex flex-col lg:flex-row gap-6 px-4 h-full">

  {/* Kontainer Biru */}
  <div className="bg-blue-500 shadow-md border-r border-gray-300 rounded-r-3xl lg:w-1/2 h-auto p-6 w-full max-w-[700px]">
    <p className="text-white">Kontainer Biru</p>
  </div>

  {/* Kontainer Putih */}
  <div className="bg-blue-50 rounded-r-xl shadow-lg h-auto flex-1 p-6">
    <p className="text-gray-800">Kontainer Putih</p>
  </div>

</div>



    )
}