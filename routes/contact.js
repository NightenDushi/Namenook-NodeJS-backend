const express = require('express');
const contacts_router = express.Router();
const data = require('../data_sqlite');

contacts_router.get('/', async (req, res) => {
    //Return list of contacts
    const owner_id = req.query.owner_id;
    console.log(req.query)
    if (!owner_id || owner_id=="undefined" || owner_id==undefined) {
        res.status(300).send(JSON.stringify("ERROR: an owner id must be specified"))
        return
    }

    res.send(data.get(false, "contacts", owner_id));
});


contacts_router.get('/:id', (req, res) => {
    
    const owner_id = req.query.owner_id;
    console.log(req.query)
    if (!owner_id || owner_id=="undefined" || owner_id==undefined) {
        res.status(300).send(JSON.stringify("ERROR: an owner id must be specified"))
        return
    }

    let get = data.get(req.params.id, "contacts", pWhere=owner_id);
    if (get == false){
        //Error
        res.status(404).send("contact not found");
        return;
    } 
    res.send(get);
    
});

contacts_router.post('/', (req, res)=>{

    // console.log(req.body)
    // if (!req.body.name) return res.status(300).send("The value 'name' is required");
    res.send(data.add(req.body, "contacts"))
})
contacts_router.put('/:id', (req, res)=>{

    res.send(data.set(req.params.id, req.body, "contacts"));
})
contacts_router.delete('/:id', (req, res)=>{
    const owner_id = req.query.owner_id;
    console.log(req.query)
    if (!owner_id || owner_id=="undefined" || owner_id==undefined) {
        res.status(300).send(JSON.stringify("ERROR: a valid owner id must be specified"))
        return
    }
   
    let get = data.del(req.params.id, "contacts", req.query.owner_id);
    if (!get){
        //Error
        res.status(404).send("contact not found");
        return;
    } 
    
    res.send(get);
})

module.exports = contacts_router;