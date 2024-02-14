import { RouterOutputs } from "@/server"
import { trpc } from "../trpc/client"

export const useGetAuthedUser = ({ initialData }: { initialData?: RouterOutputs['user']['getAuthedUser'] } = {}) => {

    const {
        isLoading, isPending, isError, isSuccess, data, error } =
        trpc.user.getAuthedUser.useQuery(undefined,
            {
                initialData,
                refetchOnMount: initialData ? false : true,
            })

    return {
        isLoading,
        isPending,
        isError,
        isSuccess,
        data,
        error,
    }
}