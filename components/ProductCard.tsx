import Image from 'next/image'
import { Product } from '../types'
import Link from 'next/link';

const ProductCard = ({product} : {product: Product}) => {
  const primaryImage = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : null;
  return (
    <Link href={`/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="overflow-hidden">
        {primaryImage && <Image className="transition-transform duration-300 group-hover:scale-105" alt='product-image' src={primaryImage} width={400} height={400}/>}
      </div>
      <div className="flex flex-1 flex-col p-2 md:p-4 space-y-2">
        <h3 className="text-base font-semibold text-slate-800">{product.title}</h3>
        <p className="text-sm md:text-lg font-bold text-slate-900">{product.price.toLocaleString('en-US')} MMK</p>
        <button className="mt-2 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 cursor-pointer">See Detail</button>
      </div>
    </Link>
  )
}

export default ProductCard