import Link from 'next/link';
import Image from 'next/image'
import ModeToggle from '../Buttons/ModeToggle';
import AdminAvatar from '../Avatars/AdminAvatar';
import { Home } from 'lucide-react';

function Header() {
    return (
        <>
            <div className='float-left bg-white flex justify-center items-center rounded-full pb-2'>
                <Image
                 src={"http://localhost:3000/android-chrome-512x512.png"} width={100}
                 className='sm:w-14 lg:w-20 xl:w-28'
                    height={100}
                    alt={`Logo of ${process.env.APPNAME ?? "the app"}`}>
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