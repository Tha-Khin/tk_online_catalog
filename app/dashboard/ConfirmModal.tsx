import { Product } from "@/types";

interface ConfirmModalProps {
    targetProduct: Product;
    onConfirm: () => void;
    onCancel: () => void; 
}
const ConfirmModal = ({ targetProduct, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
                Are you sure you want to delete `{targetProduct.title}`?
            </h3>
            <div className="flex gap-3 justify-center">
                <button onClick={onConfirm} className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer">Yes, delete</button>
                <button onClick={onCancel} className="bg-gray-200 px-4 py-2 rounded cursor-pointer">Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default ConfirmModal