import { useEffect, useState } from "react";

export default function Dashboard() { 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
 

  <button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
  <dialog id="my_modal_1" className="modal">
  <div className="modal-box">
      <h3 className="font-bold text-lg">Hello!</h3>
      <p className="py-4">Press ESC key or click the button below to close</p>
      <div className="modal-action">
      <form method="dialog">
          <button className="btn">Close</button>
      </form>
      </div>
  </div>
  </dialog>
    </div>
  );
}