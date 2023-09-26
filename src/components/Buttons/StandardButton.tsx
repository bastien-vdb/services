import React, { PropsWithChildren } from 'react';

type StandardButtonProps = {
    onClick?: () => void,
    color?: 'indigo' | 'red',
}


function StandardButton({ children, onClick, color = 'indigo' }: PropsWithChildren<StandardButtonProps>) {
    return (
        <a
            onClick={onClick}
            href="#"
            className=
            {
                color === 'indigo' ?
                    `inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700`
                    :
                    `inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700`
            }
        >
            {children}
        </a>
    );
}

export default React.memo(StandardButton);

