import React from "react"
import { useAppSelector } from "../../../app/hooks";
import { SearchBar } from "../../../common/components/SearchBar/SearchBar";
import { LoadingSpinner } from "../../../components/spinner/Spinner";
import { useGetTagsQuery } from "../../tags/tagsApi";
import { tagsSelector } from "../../tags/tagsSlice";
import { TagsTable } from "../components/TagsTable";


export const TagsPage = () => {
  const { isFetching } = useGetTagsQuery();


  const { tags } = useAppSelector(tagsSelector);
  const [searchValue, setSearchValue] = React.useState("")

  return isFetching || !tags.length
    ? (<div className="flex w-screen align-middle justify-center"><div className="flex flex-col justify-center"><LoadingSpinner /></div></div>)
    : (< div className="flex flex-col w-screen" >
      <div className="flex flex-col w-auto h-16 border-b-[1px] pl-8">
        <SearchBar setSearchValue={setSearchValue} value={searchValue} />
      </div>
      <div className="p-2 max-h-[88vh] text-sm">
        <TagsTable searchValue={searchValue} tags={tags} />
      </div>
    </div >
    )
}