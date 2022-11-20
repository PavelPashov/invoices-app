import React from 'react'
import { useTable, useSortBy, useFlexLayout, usePagination, Row } from 'react-table'
import { IoIosArrowForward, IoIosArrowBack, IoIosArrowRoundDown, IoIosArrowRoundUp } from 'react-icons/io'
import { NumberEntity } from '../../type';

interface TableProps { searchValue: string, numbersData: NumberEntity[] }

type TableColumns = "name" | "number" | "tag" | "location" | "options"

const parseNumber = (number: NumberEntity) => {
  return {
    id: number.id,
    name: number.name,
    number: number.number,
    tag: number?.tag?.name ?? "няма",
    location: number?.location?.name ?? "няма",
    options: ""
  }
}

export const Table = ({ searchValue, numbersData }: TableProps) => {


  const myData = React.useMemo(
    () => numbersData.map(n => (parseNumber(n))),
    []
  )

  React.useEffect(() => {
    searchTable(searchValue)
  }, [searchValue])

  const columns = React.useMemo(
    () => [
      {
        Header: 'Номер',
        accessor: 'number', // accessor is the "key" in the data
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
        accessor: 'location', // accessor is the "key" in the data
      },
      {
        Header: 'Действия',
        accessor: 'options',
        Cell: row => (
          <div>
            {row.row.values.options === "new"
              ? <button className='text-[#7795FF] pr-2' onClick={e => createRow(row.row.original)}>Създай</button> : row.row.values.options === "edit"
                ? <button className='text-[#7795FF] pr-2' onClick={e => saveRow(row.row.original)}>Запази</button> : null}
            <button className='text-[#7795FF]' onClick={e => removeRecord(row.row.original)}>Изтрий</button></div>
        ),
      },
    ],
    []
  )

  const saveRow = (row) => {
    console.log("Saved");
    hideButtons(row)
  }

  const createRow = (row) => {
    console.log("Created");
    hideButtons(row)
  }

  const hideButtons = (row) => {
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
    // We also turn on the flag to not reset the page
    if (data[rowIndex][columnId] === value) return
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

  const [data, setData] = React.useState(myData);


  const removeRecord = (row) => {
    const answer = confirm("Are you sure you want to delete this record?");
    if (answer) {
      setData(old =>
        old.filter((d) => {
          if (d.number === row.number) {
            return false
          }
          return true
        })
      )
    }
  }

  const addNewRow = () => {
    setData(old => {
      return [{
        number: "",
        name: "",
        group: "",
        tag: "",
        location: "",
        options: "new"
      }, ...old]
    })
  }

  const searchTable = (value: string) => {
    setData(
      myData.filter((row) => {
        if (row.number.toLowerCase().includes(value.toLowerCase()) || row.name.toLowerCase().includes(value.toLowerCase()) ||
          row.location.toLowerCase().includes(value.toLowerCase()) || row.tag.toLowerCase().includes(value.toLowerCase())) return true;
        return false;
      })
    )
  }

  const EditableCell = ({
    value: initialValue,
    row: { index },
    column: { id },
    updateMyData, // This is a custom function that we supplied to our table instance
  }) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = (e: { target: { value: string } }) => {
      setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
      updateMyData(index, id, value)
    }


    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
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
  } = useTable({ data, columns, defaultColumn, updateMyData, initialState: { pageIndex: 0, defaultPageSize: 10 } }, useSortBy, useFlexLayout, usePagination)

  return (
    <>
      <div className="w-full h-fit overflow-y-scroll overflow-hidden">
        <table {...getTableProps()} className="w-full h-full">
          <thead className='bg-[#F8F8F8]'>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="flex items-center py-3 text-xs px-2 border-b-[1px] font-semibold text-neutral-500"
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? <IoIosArrowRoundDown className='flex text-lg' />
                          : <IoIosArrowRoundUp className='flex text-lg' />
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row: Row<{ col1: string; col2: string; col3: string; col4: string; col5: string; col6: string }>, i: any) => {
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
        </table>
      </div>

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
            {[10, 15, 20, 25].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
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