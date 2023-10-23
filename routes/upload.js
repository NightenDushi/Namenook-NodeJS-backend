const express = require('express');
const upload_router = express.Router();
const data = require('../data_sqlite');
const fs = require('fs');
var crypto = require('crypto');
const path = require('path');

//TODO(Nighten) Replace this by a config and env variable
const PATH_TO_IMAGE_FOLDER = process.env.NAMENOOK_PATH_IMAGE_FOLDER || "C:/Users/Lenovo/code/NODEJS/namenook/src/assets/profile";
// console.log("PATH_TO_IMAGE_FOLDER:",PATH_TO_IMAGE_FOLDER)
// console.log("ENV:",process.env)
upload_router.post('/:id', async (req, res)=>{
    if (!req.body.data) return res.status(300).send("Bad input");
    const filetype = req.body.type.split("/")[1]
    // console.log(req.body.data)
    // req.params.id
    const owner_id = req.query.owner_id;
    // console.log(req.query)
    if (!owner_id || owner_id=="undefined" || owner_id==undefined) {
        res.status(300).send(JSON.stringify("ERROR: a valid owner id must be specified"))
        return
    }
    if (filetype != "jpeg"){
        res.status(300).send(JSON.stringify("ERROR: only jpeg files are accepted"))
        return
    }

    const check_contact_owned = data.get(req.params.id, "contacts", owner_id)
    if (check_contact_owned.length == 0){
        res.status(300).send(JSON.stringify("ERROR: a valid owner id must be specified"))
        return
    }
    
    //WRITE IMAGE TO THE DISK
    const filename = `${crypto.createHash('md5').update(req.body.data).digest('hex')}.${filetype}`
    const filepath = path.join(PATH_TO_IMAGE_FOLDER, filename);
    console.log(filepath)

    const file = await fs.writeFile(filepath, req.body.data.replace(/^data:.*;base64,/, ""), 'base64', (err)=>{if (err) throw err;})

    //UPDATE THE DATABASE
    data.set(req.params.id, {picture:filename, owner_id:owner_id}, "contacts")
    
    //SEND THE DATABASE BACK
    res.send(data.get(false, "contacts", req.query.owner_id))
})

module.exports = upload_router;