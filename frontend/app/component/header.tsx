import Link from 'next/link';
import React from 'react';

const Header = () => {
  return (
    <div className="bg-slate-700 p-6 flex justify-between items-center">
      <h1 className="text-yellow-200 text-5xl font-extrabold">WashWagon</h1>
      <div className='flex space-x-10'>
          <Link href='/'>
          <h1 className="text-white p-2 hover:bg-sky-700">Home</h1></Link>
          <Link href='/about'>
          <h1 className="text-white p-2 hover:bg-sky-700">About</h1></Link>
          <Link href='/services'>
          <h1 className="text-white p-2 hover:bg-sky-700">Services</h1></Link>
          <Link href='/'>
          <h1 className="text-white p-2 hover:bg-sky-700">Contact</h1></Link>
          <Link href='/login'>
          <h1 className="text-white p-2 hover:bg-sky-700">Login</h1></Link>
      </div>
    </div>
  );
};

export default Header;
