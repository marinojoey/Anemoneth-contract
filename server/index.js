const express = require("express");
const fileUpload = require('express-fileupload');
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8080;
const { create } = require('ipfs-http-client');

const ipfs = create('/ip4/127.0.0.1/tcp/5001');

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

app.use(fileUpload());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true })); // body-parser
app.use(express.json()); // for JSON payloads

app.get("/", (req, res) => {
    res.status(200).send("test");
})

app.post("/stringUpload", (req, res) => {
    console.log(req.body);
})

app.post("/fileUpload", (req, res) => {
    const file = req.files.file;
    const fileName = req.files.file.name;
    const filePath = "tempFiles/" + fileName;
  
    file.mv(filePath, async (err) => {
        if (err) {
            console.log("Error: failed to download the file");
            return res.status(500).send(err);
        }

        const fileHash = await addFile(fileName, filePath);
        fs.unlink(filePath, (err) => {
            if (err) console.log(err);
        })
        
        res.status(200).send({ fileHash, fileName });
    })
})

const addFile = async (fileName, filePath) => {
    const file = fs.readFileSync(filePath);
    const fileAdded = await ipfs.add({ path: fileName, content: file });
    const fileHash = fileAdded.cid.toString();
    console.log(fileHash)

    return fileHash;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})