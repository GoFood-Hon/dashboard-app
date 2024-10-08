import { Paper, Skeleton } from "@mantine/core"

export const TableSkeleton = () => {
  return (
    <Paper>
      <div className="flex flex-col rounded-25 shadow-5xl px-2">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="overflow-hidden">
              <table className="min-w-full">
                <tbody>
                  {Array.from({ length: 12 }).map((_, index) => (
                    <tr key={index} className="!flex w-full items-center h-12">
                      <td className="pr-0 py-2 whitespace-nowrap flex items-center">
                        <div className="flex items-center gap-4">
                          <Skeleton height={20} width={20} />
                        </div>
                      </td>
                      <td className="pr-0 py-2 flex w-full space-x-1">
                        <Skeleton height={10} width={"100%"} />
                        <Skeleton height={10} width={"100%"} />
                        <Skeleton height={10} width={"100%"} />
                        <Skeleton height={10} width={"100%"} />
                        <Skeleton height={10} width={"100%"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Paper>
  )
}
