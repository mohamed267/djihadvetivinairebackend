exports.tokenInterceptor = (req, res, next, data) => {
    // let t  = req && req.inst && req.inst.t
    // if(t){
    //     t.commit()
    // }
    res.status(200).json({ ...data
        // , token: req.intercepttoken ? req.intercepttoken.token : null 
    })
} 