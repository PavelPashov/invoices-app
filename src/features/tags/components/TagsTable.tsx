import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useFlexLayout, usePagination, Row, UseTableCellProps } from 'react-table'
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io'

import { ITag, ITagRow } from '../type';
import { notify } from '../../../common/utils/notification';
import { useCreateTagMutation, useDeleteTagMutation, useUpdateTagMutation } from '../tagsApi';

interface TableProps { searchValue: string, tags: ITag[], }

const parseTags = (tags: ITag[]) => {
  return tags.map(t => ({ ...t, options: '' }))
}

type TableColumns = "name" | "options"

export const TagsTable = ({ searchValue, tags }: TableProps) => {
  const [data, setData] = useState(parseTags(tags));

  const [dataHistory, setDataHistory] = useState(data)

  const [updateTag, { isSuccess: updateIsSuccess, isError: updateIssError }] = useUpdateTagMutation();
  const [createTag, { isSuccess: createIsSuccess, isError: createIsError }] = useCreateTagMutation();
  const [deleteTag, { isSuccess: deleteIsSuccess, isError: deleteIsError }] = useDeleteTagMutation();

  useEffect(() => {
    if (updateIsSuccess) {
      notify({ type: "success", message: "Записът е променен успешно!" })
    }
    if (updateIssError) {
      notify({ type: "error", message: "Проблем при записването!" })
      setData(dataHistory)
    }
  }, [updateIsSuccess, updateIssError])
  useEffect(() => {
    if (createIsSuccess) {
      notify({ type: "success", message: "Записът е създаден успешно!" })
    }
    if (createIsError) {
      notify({ type: "error", message: "Проблем при създаването!" })
      setData(dataHistory)
    }
  }, [createIsSuccess, createIsError])
  useEffect(() => {
    if (deleteIsSuccess) {
      notify({ type: "success", message: "Записът е изтрит успешно!" })
    }
    if (deleteIsError) {
      notify({ type: "error", message: "Проблем при изтриването!" })
      setData(dataHistory)
    }
  }, [deleteIsSuccess, deleteIsError])

  useEffect(() => {
    searchTable(searchValue)
  }, [searchValue])

  useEffect(() => {
    setDataHistory(data.map((d) => ({ ...d, options: "" })))
    setData(parseTags(tags))
  }, [tags])


  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Име',
        accessor: 'name',
      },
      {
        Header: 'Действия',
        accessor: 'options',
        Cell: (row: UseTableCellProps<ITagRow>) => (
          <div>
            {row.row.values.options === "new"
              ? <button className='text-[#7795FF] pr-2' onClick={e => createRow(row.row.original)}>Създай</button> : row.row.values.options === "edit"
                ? <button className='text-[#7795FF] pr-2' onClick={e => saveRow(row.row.original)}>Запази</button> : null}
            {
              row.row.values.options === "edit" || row.row.values.options === "new"
                ? <button className='text-[#7795FF]' onClick={e => handleActionCancelation(row.row.original)}>Отмени</button>
                : < button className='text-[#7795FF]' onClick={e => removeRecord(row.row.original)}> Изтрий</button >
            }
          </div >
        ),
      },
    ],
    []
  )

  const saveRow = async (row: ITagRow) => {
    const { options, ...restRow } = row;
    await updateTag(restRow)
    hideButtons(row)
  }

  const createRow = async (row: ITagRow) => {
    const { options, id, ...restRow } = row;
    await createTag(restRow)
    hideButtons(row)
  }

  const hideButtons = (row: ITagRow) => {
    setData(old =>
      old.map((d) => {
        if (d.id === row.id) {
          return {
            ...d,
            options: "",
          }
        }
        return d
      })
    )
  }

  const updateMyData = (rowIndex: number, columnId: TableColumns, value: string) => {
    const oldValue = data[rowIndex][columnId];
    if (oldValue === value) return
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...old[rowIndex],
            [columnId]: value,
            options: old[rowIndex].options === "new" ? "new" : "edit",
          }
        }
        return row
      })
    )
  }

  const removeRecord = async (row: ITagRow) => {
    const answer = confirm("Сигурни ли сте, че искате да изтриете този ред?");
    if (answer) {
      await deleteTag(row)
      setData(data.filter(d => d.id !== row.id))
    }
  }

  const addNewRow = () => {
    gotoPage(pageCount - 1)
    setData(old => {
      return [...old, {
        id: null,
        name: "",
        options: "new"
      }]
    })
  }

  const handleActionCancelation = (row: ITagRow) => {
    setData(dataHistory)
    hideButtons(row)
  }

  const searchTable = (value: string) => {
    setData(
      parseTags(tags).filter((row) => {
        if (row.name.toLowerCase().includes(value.toLowerCase())) return true;
        return false;
      })
    )
  }

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }: any) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue)

    const onChange = (e: { target: { value: string } }) => {
      setValue(e.target.value)
    }

    const onChangeSelect = (e: { target: { value: string } }) => {
      setValue(e.target.value)
      updateMyData(index, id, e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }


    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={onChange} onBlur={onBlur} />
  }

  const defaultColumn = {
    Cell: EditableCell,
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({ data, columns, defaultColumn, updateMyData, initialState: { pageIndex: 0, pageSize: 10 }, autoResetPage: false }, useSortBy, useFlexLayout, usePagination)

  return (
    <>
      <div className="w-full overflow-y-scroll max-h-full">
        <table {...getTableProps()} className="w-full">
          <thead className='bg-[#F8F8F8]'>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="flex items-center py-2 text-xs px-2 border-b-[1px] font-semibold text-neutral-500"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span>
                      {
                        column.isSorted
                          ? column.isSortedDesc
                            ? <IoIosArrowRoundDown className='flex text-lg' />
                            : <IoIosArrowRoundUp className='flex text-lg' />
                          : ''
                      }
                    </span>
                  </th>
                ))}
              </tr>
            ))
            }
          </thead >
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<ITagRow>) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell: { getCellProps: () => JSX.IntrinsicAttributes & React.ClassAttributes<HTMLTableDataCellElement> & React.TdHTMLAttributes<HTMLTableDataCellElement>; render: (arg0: string) => string | number | boolean | React.ReactFragment | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactPortal | null | undefined }) => {
                    return <td className="flex items-center py-3 px-2 border-b-[1px]" {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table >
      </div >

      <div className="flex justify-start mb-5 absolute bottom-0 ml-5">
        <button className="text-[#7795FF]" onClick={addNewRow}>Създай нов</button>
      </div>

      <div className="flex justify-end mb-5 absolute bottom-0 right-0 mr-5">
        <div className="flex">
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 25, 50, 75, 150].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Покажи {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="flex">
          <button className="mr-5" onClick={() => previousPage()} disabled={!canPreviousPage}>
            <IoIosArrowBack />
          </button>
          <span>
            {pageIndex + 1}/{pageOptions.length}
          </span>
          <button className="ml-5" onClick={() => nextPage()} disabled={!canNextPage}>
            <IoIosArrowForward />
          </button>
        </div>
      </div>
    </>
  )
}