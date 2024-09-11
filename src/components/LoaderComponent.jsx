import { Loader } from "@mantine/core"

export const LoaderComponent = ({ width, size, margin }) => {
  return (
    <div
      className={`bg-primary_button text-white flex h-10 w-${width} items-center justify-center space-x-3 rounded-md text-sm shadow-sm transition-all duration-700 focus:outline-none ${margin ? "my-3" : ""} dark:bg-slate-900 cursor-pointer`}>
      <Loader size={size} color="white" />
    </div>
  )
}
