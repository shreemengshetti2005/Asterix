export const responce=(s:any)=>{
    return {
        status:s.status,
        message:s?.message,
        data:s?.data,
        display_on_frontend:s?.frontend,
        
    }
}