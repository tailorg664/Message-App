import React from 'react'

function Search() {
  return (
    <div className="bg-gray-200 p-4">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-2 rounded-lg focus:outline-none border"
      />
    </div>
  );
}

export default Search