document.getElementById("grace_period").addEventListener('change',(e)=>{
    const value = e.target.value
    if(value ==="")
    {
     document.getElementById('graceDiv').style.display = 'none'
    }
    else if(value==='Yes')
    {
        document.getElementById('graceDiv').style.display = 'block'
    }
    else if(value==='No')
    {
        document.getElementById('graceDiv').style.display = 'none'
    }
})