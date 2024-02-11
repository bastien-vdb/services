import Link from 'next/link';
import Image from 'next/image'
import ModeToggle from '../Buttons/ModeToggle';
import AdminAvatar from '../Avatars/AdminAvatar';
import { Home } from 'lucide-react';

function Header() {
    return (
        <>
            <div className='float-left ml-2 w-10 sm:w-16 sm:m-2 lg:m-6 lg:w-24 xl:ml-10 xl:w-30 bg-white flex justify-center items-center rounded-xl'>
                <Image src={"http://localhost:3000/android-chrome-512x512.png"} width={100}
                    height={100}
                    alt={`Logo of ${process.env.NEXT_PUBLIC_APPNAME ?? "the app"}`}>
                </Image>
            </div>
            <div className='flex gap-4 m-4 items-center justify-end'>
                <Link title='Accueil' href={"/"}>
                    <Home size={32}/>
                </Link>
                <ModeToggle />
                <AdminAvatar />
            </div>
        </>
    );
}

export default Header;