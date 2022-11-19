import React from 'react';
import searchSvg from "../../../../assets/search.svg";


export const SearchBar: React.FunctionComponent = ({ setSearchValue, value }) => {
  return (
    <div className="flex flex-row w-auto h-full items-center">
      <label className="flex bg-[#F8F8F8] w-2/5 p-1 rounded-md placeholder:text-sm placeholder:pl-3">
        <input className="bg-[#F8F8F8] w-full placeholder:text-sm placeholder:pl-3 focus:outline-none" onChange={e => setSearchValue(e.target.value)} value={value} placeholder='Търсене'></input>
        <img src={searchSvg}></img>
      </label>
    </div>
  )
}