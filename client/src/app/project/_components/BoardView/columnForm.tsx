'use client';

import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface ColumnFormProps {
    projectId: number;
    isSmallItem?: boolean;
    AddColumnMutation: (column: { title: string, color: string, projectId: number }) => Promise<any>
}

const ColumnForm: React.FC<ColumnFormProps> = ({ projectId, isSmallItem, AddColumnMutation }) => {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [color, setColor] = useState('');

    const handleFormSubmit = async () => {
        if (!title || !color) {
            toast.error(`Please fill in ${title ? "color" : "title"}`);
            return;
        }

        try {
            await AddColumnMutation({ title, color, projectId });
            console.log('Column inserted');
            setTitle('');
            setIsFormVisible(false);
        } catch (error) {
            toast.error('Failed to add column. Please try again.');
            console.error(error);
        }
    };

    return (
        <div className={`${isSmallItem ? "" : "relative flex flex-col gap-2  bg-slate-50 dark:bg-dark-bg "}`}>
            {
                isSmallItem && (
                    <button className=' w-full h-full  bg-white' onClick={() => { setIsFormVisible(true) }}>new column</button>
                )
            }
            {!isSmallItem && <button
                className=" rounded py-2 flex gap-2 items-center sm:mt-4 sm:p-0 xl:px-2 ring-rose-500 duration-300 hover:ring-2 cursor-pointer w-[311px] h-[49px] bg-white dark:bg-dark-secondary dark:text-white"
                onClick={() => { setIsFormVisible(true) }}
            >
                <Plus className="ml-2 bg-gray-200 dark:bg-dark-tertiary dark:text-white text-white flex gap-2" />
                New column
            </button>}

            {isFormVisible && (
                <div className="z-50 absolute top-12 left-0 flex flex-col gap-2 justify-center items-center bg-white   dark:bg-dark-secondary   p-4 rounded shadow-lg">
                    <label htmlFor="title" className='dark:text-white text-black'>Column Title</label>
                    <input
                        type="text"
                        placeholder="Column Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded py-2 px-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary dark:text-white"
                    />
                    <label htmlFor="color" className='dark:text-white text-black'>Color</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="rounded py-2 px-4 w-[193px] h-12 border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-secondary dark:text-white"
                    />
                    <button
                        className="rounded py-2 flex justify-center gap-2 items-center mt-2 xl:px-2 ring-rose-500 duration-300 hover:ring-2 cursor-pointer w-[200px] h-[30px] bg-white dark:bg-dark-secondary dark:text-white"
                        //TODO cancle ouside
                        onClick={handleFormSubmit}
                    >
                        Submit
                    </button>
                </div>
            )}
        </div>
    );
}

export default ColumnForm;
