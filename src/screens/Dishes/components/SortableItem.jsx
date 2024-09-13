/* eslint-disable n/no-extraneous-import */
import React, { createContext, useContext, useMemo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const SortableItemContext = createContext({
  attributes: {},
  listeners: undefined,
  ref() {}
})

export function SortableItem({ children, id }) {
  const { attributes, isDragging, listeners, setNodeRef, setActivatorNodeRef, transform, transition } = useSortable({ id })
  const context = useMemo(
    () => ({
      attributes,
      listeners,
      ref: setActivatorNodeRef
    }),
    [attributes, listeners, setActivatorNodeRef]
  )
  const style = {
    opacity: isDragging ? 0.4 : undefined,
    transform: CSS.Translate.toString(transform),
    transition
  }

  return (
    <SortableItemContext.Provider value={context}>
      <li
        className="flex justify-between flex-grow items-center p-4 bg-white shadow-list border border-gray-200 rounded-md list-none text-gray-700"
        ref={setNodeRef}
        style={style}>
        {children}
      </li>
    </SortableItemContext.Provider>
  )
}

export function DragHandle() {
  const { attributes, listeners, ref } = useContext(SortableItemContext)

  return (
    <button
      className="flex w-12 p-15 items-center justify-center flex-0 flex-no-grow flex-no-shrink cursor-grab rounded-5 border-none outline-none appearance-none bg-transparent tap-highlight-transparent transition duration-300 hover:bg-opacity-5 focus-visible:shadow-outline-blue"
      {...attributes}
      {...listeners}
      ref={ref}>
      <svg
        viewBox="0 0 20 20"
        width="12"
        className="flex-0 flex-no-grow flex-no-shrink m-auto h-full overflow-visible fill-grey-500">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
    </button>
  )
}
