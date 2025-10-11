export default function Modal({isOpen,onClose,children}){

    if(!isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>

            <div className=" relative  p-6 w-96 rounded-lg shadow-lg flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>

                    {children}

            </div>

        </div>
    )


}