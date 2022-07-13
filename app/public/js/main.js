

const numberInput =  document.getElementById("number")
const msgInput = document.getElementById('msg');
const button =  document.getElementById('button');
const response =  document.querySelector('.response')

const  send = ()=>{
    let number =  numberInput.ariaValueMax.replace(/\D/g ,'');
    number =  "+213"+number
    // const  text =  textInput.value;
    // console.log("we are here");
    // fetch('/',{
    //     method : 'post',
    //     headers : {
    //         'Content-type' : "application/json"
    //     },
    //     body: 
    //         JSON.stringify({
    //             text , number
    //         })
        
    // }).then(res=>{
    //     console.log(response)
    // }).catch(error=>{
    //     console.log(error)
    // })
}

button.addEventListener('click' ,  send  , false )

