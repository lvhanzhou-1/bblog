import axios from '@/lib/request'

export const timeLineApi = {
    queryTimeLineAll: () => {
        return axios.post(`/timeLine/queryTimeLineAll`)
    }
}
