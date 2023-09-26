import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { useTime } from '@/src/hooks/useTime';
import { Button } from '@/src/components/ui/button';

const SelectSlot = () => {

    const { daySelected } = useTime();

    const selectedDate = moment(daySelected).subtract(1, 'hours');

    let ListOfSlot = [] as Date[];
    for (let i = 0; i < 24; i++) {
        ListOfSlot.push(selectedDate.add(1, 'hours').toDate());
    }

    const [listOfSlot, setListOfSlot] = useState<Date[]>(ListOfSlot);

    useEffect(() => {
        setListOfSlot(ListOfSlot)
    }, [daySelected])

    const bookASlot = (slot: Date) => {
        setListOfSlot(listOfSlot => listOfSlot.filter(each => each !== slot));
    }

    return (
        <div>
            <ul className='flex flex-wrap w-80 gap-2 items-center justify-center p-2'>
                {
                    listOfSlot.map((slot, key) => (
                        <li key={key}><Button onClick={() => bookASlot(slot)}>{moment(slot).format('HH:mm:ss').toString()}</Button></li>
                    ))
                }
                <span className='m-2'>Day: {selectedDate.toString()}</span>
            </ul>
        </div>
    );
};

export default SelectSlot;