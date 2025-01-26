import React from "react";
import SearchBox from "../blocks/SearchBox/SearchBox";
import Contact from "../blocks/Contact/Contact";
function UserContacts() {
  return (
    <>
      <div className=" flex flex-col w-full h-full pt-16">
        <SearchBox />
        <Contact />
      </div>
    </>
  );
}

export default UserContacts;
