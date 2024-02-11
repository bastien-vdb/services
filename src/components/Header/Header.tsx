import Link from 'next/link';
import Image from 'next/image'
import ModeToggle from '../Buttons/ModeToggle';
import AdminAvatar from '../Avatars/AdminAvatar';
import { Home } from 'lucide-react';

function Header() {
    return (
        <>
            <div className='float-left w-12 sm:w-20 lg:w-28 xl:w-40'>
                <Image src={"http://localhost:3000/android-chrome-512x512.png"} width={100}
                    height={100}
                    alt={`Logo of ${process.env.APPNAME}`}>
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