"use client";

import { assets } from '@/assets/assets';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardSidebar = () => {
    const pathname = usePathname();
    const sidebarLinks = [
        { name: "Product List", path: "/dashboard", icon: assets.productListIcon },
        { name: "Add Product", path: "/dashboard/add-product", icon: assets.addIcon },
    ];
    return (
        <div className="w-16 md:w-64 border-r text-base border-primary/70 pt-30 flex flex-col bg-linear-to-b from-[#FDF9E9]">
            {sidebarLinks.map((item) => (
                <Link href={item.path} key={item.name} className={`flex items-center py-3 px-4 gap-3 hover:bg-primary/10 ${pathname === item.path ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary" : ""}`}>
                    <Image src={item.icon} alt="" className="w-7 h-7"/>
                    <p className="md:block hidden text-center">{item.name}</p>
                </Link>
            ))}
        </div>
    )
}

export default DashboardSidebar