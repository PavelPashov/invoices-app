import React, { useEffect, useState } from "react"
import { useAppSelector } from "../../../app/hooks";
import { SearchBar } from "../components/searchBar/SearchBar"
import { Table } from "../components/table/Table"
import { useGetNumbersQuery } from "../numbersApi";
import { numbersSelector } from "../numbersSlice";

export const NumbersPage = () => {
  const { isFetching } = useGetNumbersQuery();

  const { numbers } = useAppSelector(numbersSelector);

  const [searchValue, setSearchValue] = React.useState("")
  return isFetching ? (<div className="flex flex-row min-h-screen"><p>Зарежда...</p></div>) :
    (< div className="flex flex-col w-screen min-h-screen" >
      <div className="flex flex-col w-auto h-16 border-b-[1px] pl-8">
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className="p-5  text-sm">
        <Table searchValue={searchValue} numbersData={numbers} />
      </div>
    </div >

    )
}