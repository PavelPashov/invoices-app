import React, { useEffect, useMemo, useState } from 'react'
import { useTable, useSortBy, useFlexLayout, usePagination, Row, Column, UseTableCellProps, ColumnInstance } from 'react-table'
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io'
import { INumber, INumberRow } from '../../type';
import { ITag } from '../../../tags/type';
import { useCreateNumberMutation, useDeleteNumberMutation, useUpdateNumberMutation } from '../../numbersApi';
import { notify } from '../../../../common/utils/notification';
import { ILocation } from '../../../locations/types';

interface TableProps { searchValue: string, numbers: INumber[], tags: ITag[], locations: ILocation[] }

type TableColumns = "name" | "number" | "tag" | "location" | "options"

const parseNumbers = (numbers: INumber[]): INumberRow[] => {
  return numbers.map<INumberRow>((number) => {
    return {
      ...number,
      tag: number?.tag?.name ?? "",
      location: number?.location?.name ?? "",
      options: ""
    }
  })
}

export const Table = ({ searchValue, numbers, tags, locations }: TableProps) => {
  const [data, setData] = useState(parseNumbers(numbers));

  const [dataHistory, setDataHistory] = useState(data)

  const [updateNumber, { isSuccess, isError }] = useUpdateNumberMutation();
  const [createNumber, { isSuccess: createIsSuccess, isError: createIsError }] = useCreateNumberMutation();
  const [deleteNumber, { isSuccess: deleteIsSuccess, isError: deleteIsError }] = useDeleteNumberMutation();

  useEffect(() => {
    if (isSuccess) {
      notify({ type: "success", message: "Записът е променен успешно!" })
    }
    if (isError) {
      notify({ type: "error", message: "Проблем при записването!" })
      setData(dataHistory)
    }
  }, [isSuccess, isError])
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
    setData(parseNumbers(numbers))
  }, [numbers])


  const columns: any = React.useMemo(
    () => [
      {
        Header: 'Номер',
        accessor: 'number',
      },
      {
        Header: 'Име',
        accessor: 'name',
      },
      {
        Header: 'Група',
        accessor: 'tag',
      },
      {
        Header: 'Локация',
        accessor: 'location',
      },
      {
        Header: 'Действия',
        accessor: 'options',
        Cell: (row: UseTableCellProps<INumberRow>) => (
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

  const saveRow = async (row: INumberRow) => {
    const { options, ...restRow } = row;
    const toBeSavedRow = {
      ...restRow,
      tag: tags.find(t => t.name === row?.tag)?.id ?? null,
      location: locations.find(l => l.name === row?.location)?.id ?? null,
    }
    await updateNumber(toBeSavedRow)
    hideButtons(row)
  }

  const createRow = async (row: INumberRow) => {
    const { options, id, ...restRow } = row;
    const toBeCreatedRow = {
      ...restRow,
      tag: tags.find(t => t.name === row?.tag)?.id ?? null,
      location: locations.find(l => l.name === row?.location)?.id ?? null,
    }
    await createNumber(toBeCreatedRow)
    hideButtons(row)
  }

  const hideButtons = (row: INumberRow) => {
    setData(old =>
      old.map((d) => {
        if (d.number === row.number) {
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

  const removeRecord = async (row: INumberRow) => {
    const answer = confirm("Сигурни ли сте, че искате да изтриете този ред?");
    if (answer) {
      await deleteNumber(row)
      setData(data.filter(d => d.id !== row.id))
    }
  }

  const addNewRow = () => {
    gotoPage(pageCount - 1)
    setData(old => {
      return [...old, {
        id: null,
        number: "",
        name: "",
        tag: "",
        location: "",
        options: "new"
      }]
    })
  }

  const handleActionCancelation = (row: INumberRow) => {
    setData(dataHistory)
    hideButtons(row)
  }

  const searchTable = (value: string) => {
    setData(
      parseNumbers(numbers).filter((row) => {
        if (row.number.toLowerCase().includes(value.toLowerCase()) || row.name.toLowerCase().includes(value.toLowerCase()) ||
          row.location?.toLowerCase().includes(value.toLowerCase()) || row.tag?.toLowerCase().includes(value.toLowerCase())) return true;
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

    if (id === "tag") {
      return <select value={value} onChange={onChangeSelect}>
        {[{ name: "", id: 0 }, ...tags].map((tag) => {
          return <option key={tag.id}>{tag.name}</option>;
        })}
      </select >
    }

    if (id === "location") {
      return <select value={value} onChange={onChangeSelect}>
        {[{ name: "", id: 0 }, ...locations].map((location) => {
          return <option key={location.id}>{location.name}</option>;
        })}
      </select >
    }

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
      <div className="w-full overflow-y-scroll max-h-[79vh] text-sm">
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
            {page.map((row: Row<INumberRow>) => {
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

      <div className='flex flex-col'>
        <div className="flex flex-row mt-6 min-h-full h-full align-middle ">
          <div className="flex flex-row items-start justify-start w-1/2 min-h-full h-full align-middle">
            <button className="text-[#7795FF]" onClick={addNewRow}>Създай нов</button>
          </div>
          <div className="flex flex-row items-end justify-end mb-auto mt-auto w-1/2">
            <div className="flex flex-row">
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
            <div className="flex flex-row">
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
        </div>
      </div>
    </>
  )
}