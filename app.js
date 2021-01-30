require('dotenv').config()

const express = require('express');
const app = express();
    
app.use (express.json({extended: true}));
app.listen(process.env.PORT );
app.get('/',(req,res)=>{
    res.json({
        "message": "My Rule-Validation API",
        "status": "success",
        "data":{
            "name":"Omolere Enoch",
            "github":"@enoch17",
            "email":"enochomolere1@gmail.com",
            "mobile":"07038738314",
            "twitter":""
        }
    })
})
app.use (function (error, req, res, next){

    console.log(error);
    if (error instanceof SyntaxError){
        res.status(400).json(
            {
                "message":  "Invalid JSON payload passed",
                "status": "error",
                "data": null
            }
        );
    }else{
        next ();
    }
});

app.post('/validate-rule',(req,res)=>{
    // console.log(req);
    const input = req.body;
    var errfield = "";
    var statuscode= 200;
    var extype = "";
    var errortype ="";
    //validation
    if(!input.rule)
    {
        errfield = "rule";
        statuscode = 400;
        errortype = "required"
    }else if(!input.data)
    {
        errfield = "data";
        statuscode = 400;
        errortype = "required"
    }
    else if(!testJSON(input.rule))
    {
        errfield = "rule";
        statuscode = 400;
        errortype = "notjson"
        extype = "JSON Object"
    }
    else if(!checkType(input.data)){
        errfield = "data";
        statuscode = 400;
        errortype = "notcorrecttype"
        extype = "JSON Object or Array or String"
    }
    else if(!input.rule.field)
    {
        errfield = "field";
        statuscode = 400;
        errortype = "required"
    }
    else if(!input.rule.condition)
    {
        errfield = "condition";
        statuscode = 400;
        errortype = "required"
    }
    else if(!input.rule.condition_value)
    {
        errfield = "condition_value";
        statuscode = 400;
        errortype = "required"
    }
    else if(!input.data.hasOwnProperty(input.rule.field))
    {  
        errfield = input.rule.field;
        statuscode = 400;
        errortype = "missing";
    }
    // else if(!check(input.data))
    // {

    // }
    else{
        cond  = input.rule.condition;
        condvalue = input.rule.condition_value;
        field = input.data[input.rule.field];
        var stat = false;
        switch(cond)
        {
            case 'eq':
                (condvalue == field)? stat = true: stat =false ;
            
            case 'neq':
                (condvalue != field)? stat = true: stat =false ;
            case 'gt':
                (condvalue < field)? stat = true: stat =false ;
            case 'gte':
                (condvalue <= field)? stat = true: stat =false ;
        }
        if(stat==true)
        {
            errortype = "success";
        }
        else{
            errortype = "error";
        }
    }





    //Sending Reponse
    if(errortype == "required")
    {
        res.status(statuscode).send(
            {
                "message":  errfield+" is required.",
                "status": "error",
                "data": null
              }
        );
    }
    else if(errortype =="invaliddata")
    {
        res.status(statuscode).send(
            {
                "message":  "rule should be an object",
                "status": "error",
                "data": null
              }
        );
    }
    else if(errortype == "missing")
    {
        res.status(statuscode).send(
            {
                "message":  "field "+errfield+ " is missing from data",
                "status": "error",
                "data": null
              }
        );
    }
    else if(errortype == "notjson")
    {
        res.status(statuscode).send(
            {
                "message":  "field "+errfield+ " should be a|an "+extype+"",
                "status": "error",
                "data": null
              }
        );
    }
    else if(errortype == "notcorrecttype")
    {
        res.status(statuscode).send(
            {
                "message":  "field "+errfield+ " should be a|an "+extype+"",
                "status": "error",
                "data": null
              }
        );
    }
    else if(errortype=="success"){
        res.status(200).json(
            {
            
                "message": "field "+input.rule.field+ " successfully validated.",
                "status": "success",
                "data": {
                  "validation": {
                    "error": false,
                    "field": input.rule.field,
                    "field_value": input.data[input.rule.field],
                    "condition": input.rule.condition,
                    "condition_value": input.rule.condition_value,
                  }
                }
              
        })
    }
    else if(errortype=="error"){
        res.status(400).send(
            {
            
                "message": "field "+input.rule.field+ " failed validation.",
                "status": "error",
                "data": {
                  "validation": {
                    "error": true,
                    "field": input.rule.field,
                    "field_value": input.data[input.rule.field],
                    "condition": input.rule.condition,
                    "condition_value": input.rule.condition_value,
                  }
                }
              
        })
    }
})
function checkType(val){
    var a= typeof val;
    console.log(a)
    console.log(testJSON(a))
    console.log(Array.isArray(a))
    
    if(testJSON(val)||a==="string"||Array.isArray(val)){
        return true;
    }
    else{
        return false;
    }
}
function testJSON(text) { 
    try {
        text = JSON.stringify(text); 
        JSON.parse(text); 
        return true; 
    } catch (error) { 
        return false; 
    } 
} 

//404
app.use((req,res)=>{
    res.status(404).json({
        "status" : "404",
        "messgae":"PAGE NOT FOUND"
    })
})