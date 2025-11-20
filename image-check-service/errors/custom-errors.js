export function handleAxiosErrors(name){
    return(err)=>{
        const status=err?.response?.status
        const data=err?.response?.data
        console.error(`[Axios Error] ${name} failed`)
        if(status) console.error(`Status: ${status}`)
        if(data) console.error(`Response data:`,data)
    }
}