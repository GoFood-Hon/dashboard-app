import React from "react"

import { CloseIcon, Text } from "@mantine/core"

export default function PreviewImageCard({ imgName, size, previews, deleteImage }) {
  return (
    <div className="w-full">
      <Text size="lg" inline className="mb-5 text-left">
        Imagen seleccionada:
      </Text>
      <div className="my-3 flex w-full flex-row items-center justify-center rounded-2xl border border-slate-200">
        <div className="flex w-full flex-row flex-wrap items-center gap-2 p-2">
          {previews}
          <div className="flex flex-col">
            <Text className="font-semibold italic">{imgName}</Text>
            <Text className="font-semibold" size="sm" c="dimmed" inline>
              {size} MB
            </Text>
          </div>
        </div>
        <button onClick={deleteImage} className="pr-3">
          <CloseIcon size={24} />
        </button>
      </div>
    </div>
  )
}
