/* eslint-disable n/no-extraneous-import */
import React, { createContext, useContext, useMemo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Paper } from "@mantine/core"
import { IconGripVertical } from "@tabler/icons-react"

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
      <Paper withBorder radius="md">
        <li
          className="flex justify-between flex-grow items-center p-4  shadow-list  rounded-md list-none"
          ref={setNodeRef}
          style={style}>
          {children}
        </li>
      </Paper>
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
      <IconGripVertical size="1.1rem" />
    </button>
  )
}
