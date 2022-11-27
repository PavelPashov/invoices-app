import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '../../../../common/components/Button/Button'
import { notify } from '../../../../common/utils/notification'
import { LoadingSpinner } from '../../../../components/spinner/Spinner'
import { useUploadFileMutation } from '../../numbersApi'

export const Dropzone = () => {
  const [file, setFile] = useState<File | null>(null)
  const [areButtonsVisible, setAreButtonsVisible] = useState(false)

  const formData = new FormData();

  const [uploadFile, { isSuccess, isError, isLoading }] = useUploadFileMutation();

  const onDrop = useCallback((acceptedFiles: any) => {
    setFile(acceptedFiles[0])
    setAreButtonsVisible(true)
  }, [])

  useEffect(() => {
    if (file) {
      setAreButtonsVisible(true)
    }
    else setAreButtonsVisible(false)
  }, [file])

  useEffect(() => {
    if (isSuccess) {
      notify({ type: "success", message: "Успешна обработка, моля проверете вашият емейл!" })
    }
    if (isError) {
      notify({ type: "error", message: "Проблем при обработката!" })
    }
  }, [isSuccess, isError])

  const handleUploadFile = async () => {
    formData.append("file", file!, encodeURI(file?.name || ""));
    await uploadFile(formData);
    setFile(null)
  };


  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop, accept: {
      'application/zip': [],
      'application/x-zip-compressed': [],
      'multipart/x-zip': [],
      'application/zip-compressed': [],
      'application/x-zip': [],
    }
  })

  useEffect(() => {
    if (isDragReject) {
      notify({ type: "error", message: "Грешен тип файл" })
    }
  }, [isDragReject])

  return (
    <>
      <div {...getRootProps()} className="min-h-[50vh] min-w-[70vh] flex flex-col items-center justify-center p-10 border-[#7795FF] border-2 rounded-2xl">
        <input {...getInputProps()} />
        {
          isLoading ? <LoadingSpinner /> :
            isDragActive ?
              <p>Пуснете файла тук ...</p> :
              <p>{areButtonsVisible ? `Избран файл: ${file?.name}` : "Поставете .zip файл с JSON фактури тук"}</p>
        }
      </div>

      <div className="flex flex-row w-full min-h-[10vh]">
        {
          areButtonsVisible
            ?
            <>
              <div className="flex flex-row w-1/2 justify-end">
                <Button title="Изпрати" onClick={() => handleUploadFile()} />
              </div>
              <div className="flex flex-row w-1/2 justify-start">
                <Button title="Отмени" onClick={() => setFile(null)}
                />
              </div>
            </>
            : null
        }
      </div>
    </>
  )
}
