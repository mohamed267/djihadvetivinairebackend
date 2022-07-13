

const verification_code = (code, text) => {
    return (

        '<table style="width:100%;margin:0;padding:10px 0 0 0;background-color:#f2f4f6" width="100%" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px" align="center"> <table style="width:100%;margin:0;padding:0" width="100%" cellpadding="0" cellspacing="0" role="presentation"><tbody>                 <tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px;width:100%;margin:0;padding:0" width="570" cellpadding="0" cellspacing="0"><table class="m_-7650951548765298678email-body_inner" style="width:570px;margin:0 auto;padding:0;background-color:#fff" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px;padding:20px 45px"> <div> <h1 style="margin-top:0;color:#333;font-size:24px;font-weight:bold;text-align:left"> Free Class! شكرًا لك على التسجيل                        </h1>                                            <p style="color:#51545e;margin:0.4em 0 1.1875em;font-size:16px;line-height:1.625">                                                ' + text + '                    </p>                                            <p style="color:#51545e;margin:0.4em 0 1.1875em;font-size:16px;line-height:1.625">                                                <a style="color:#fff;background-color:#3869d4;border-top:10px solid #3869d4;border-right:18px solid #3869d4;border-bottom:10px solid #3869d4;border-left:18px solid #3869d4;display:inline-block;text-decoration:none;border-radius:3px;box-sizing:border-box" href="" target="_blank" data-saferedirecturl="">' + code + '</a>                                           </p>                                                                                   </div>                                    </td>                                </tr>                                </tbody></table>                        </td>                    </tr>                </tbody></table>        </td>    </tr>    </tbody></table>'
    );
}


const emailTemplate = (template ,   data) =>{
    console.log("template is " + template)
    if(template ==="verify_email"){
        return (
            '<table style="width:100%;margin:0;padding:10px 0 0 0;background-color:#f2f4f6" width="100%" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px" align="center"> <table style="width:100%;margin:0;padding:0" width="100%" cellpadding="0" cellspacing="0" role="presentation"><tbody>                 <tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px;width:100%;margin:0;padding:0" width="570" cellpadding="0" cellspacing="0"><table class="m_-7650951548765298678email-body_inner" style="width:570px;margin:0 auto;padding:0;background-color:#fff" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td style="word-break:break-word;font-family:Lato,Tahoma,sans-serif;font-size:16px;padding:20px 45px"> <div> <h1 style="margin-top:0;color:#333;font-size:24px;font-weight:bold;text-align:left">'+data.text+'</h1>                                            <p style="color:#51545e;margin:0.4em 0 1.1875em;font-size:16px;line-height:1.625">                                                ' + data.text + '                    </p>                                            <p style="color:#51545e;margin:0.4em 0 1.1875em;font-size:16px;line-height:1.625">                                                <a style="color:#fff;background-color:#3869d4;border-top:10px solid #3869d4;border-right:18px solid #3869d4;border-bottom:10px solid #3869d4;border-left:18px solid #3869d4;display:inline-block;text-decoration:none;border-radius:3px;box-sizing:border-box" href="" target="_blank" data-saferedirecturl="">' + data.code + '</a>                                           </p>                                                                                   </div>                                    </td>                                </tr>                                </tbody></table>                        </td>                    </tr>                </tbody></table>        </td>    </tr>    </tbody></table>'
        );
    }else{
        return ("<h1>email</h1>")
    }

    

}



module.exports = emailTemplate;