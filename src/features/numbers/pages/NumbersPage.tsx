import React from "react"
import { useAppSelector } from "../../../app/hooks";
import { LoadingSpinner } from "../../../components/spinner/Spinner";
import { useGetLocationsQuery } from "../../locations/locationsApi";
import { locationsSelector } from "../../locations/locationsSlice";
import { useGetTagsQuery } from "../../tags/tagsApi";
import { tagsSelector } from "../../tags/tagsSlice";
import { SearchBar } from "../components/searchBar/SearchBar"
import { Table } from "../components/table/Table"
import { useGetNumbersQuery } from "../numbersApi";
import { numbersSelector } from "../numbersSlice";

export const NumbersPage = () => {
  const { isFetching } = useGetNumbersQuery();
  useGetTagsQuery()
  useGetLocationsQuery()

  const { numbers } = useAppSelector(numbersSelector);
  const { tags } = useAppSelector(tagsSelector);
  const { locations } = useAppSelector(locationsSelector);

  const [searchValue, setSearchValue] = React.useState("")

  return isFetching || !numbers.length || !tags.length || !locations.length
    ? (<div className="flex w-screen align-middle justify-center"><div className="flex flex-col justify-center"><LoadingSpinner /></div></div>)
    : (< div className="flex flex-col w-screen" >
      <div className="flex flex-col w-auto h-16 border-b-[1px] pl-8">
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className="p-4 max-h-[86vh] text-sm">
        <Table searchValue={searchValue} numbers={numbers} tags={tags} locations={locations} />
      </div>
    </div >
    )
}