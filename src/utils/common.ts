import dayjs from "dayjs";

export function timeFormat(time: string | Date) {
    return dayjs(time).format('M-D HH:mm:ss')
}