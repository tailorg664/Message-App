import React from 'react'

function SearchBox() {
  return (
    <div className=" p-2">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded-3xl focus:outline-none border"
      />
    </div>
  );
}

export default SearchBox
