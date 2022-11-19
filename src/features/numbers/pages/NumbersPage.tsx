import React from "react"
import { SearchBar } from "../components/searchBar/SearchBar"
import { Table } from "../components/table/Table"

export const NumbersPage = () => {

  const [searchValue, setSearchValue] = React.useState("")
  return (
    <div className="flex flex-col w-screen min-h-screen">
      <div className="flex flex-col w-auto h-16 border-b-[1px] pl-8">
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className="p-5  text-sm">
        <Table searchValue={searchValue} />
      </div>
    </div>
  )
}