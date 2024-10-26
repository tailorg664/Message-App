import React from 'react'
import SearchBox from '../../blocks/SearchBox/SearchBox';
import Contact from '../../blocks/Contact/Contact';
function UserContacts() {
  return (
    <>
    <div className="chat text-3xl font-bold m-2">Chat</div>
      <SearchBox />
      <Contact />
    </>
  );
}

export default UserContacts
