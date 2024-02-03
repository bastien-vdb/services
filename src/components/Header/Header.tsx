import Link from 'next/link';
import React from 'react';
import ModeToggle from '../Buttons/ModeToggle';
import AdminAvatar from '../Avatars/AdminAvatar';

function Header() {
    return (
        <div className='flex gap-4 m-4 items-center justify-end'>
            <Link href={"/"}>
                Acceuil
            </Link>
            <ModeToggle />
            <AdminAvatar />
        </div>
    );
}

export default Header;