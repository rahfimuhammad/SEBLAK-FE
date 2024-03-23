

export const formattedDate = (date) => {

    let dateToFormat = new Date(date)
    let year = dateToFormat.getFullYear()
    let month = dateToFormat.getMonth()
    let day = dateToFormat.getDate()
    let hour = dateToFormat.getHours()
    let minute = dateToFormat.getMinutes()

    return `${hour}:${minute} ${day}/${month + 1}/${year}`
}