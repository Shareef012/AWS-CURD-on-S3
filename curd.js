var region = "ap-south-1";
var accessKeyId = "Your-acess-key";
var secretAccessKeyId = "your-secret-key";

AWS.config.update({
    region: region,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKeyId,
    },
    // Setting AWS_SDK_LOAD_CONFIG if needed
    AWS_SDK_LOAD_CONFIG: 1,
});

var s3 = new AWS.S3();

function refreshFileList(bucketName) {
    var tableBody = document.querySelector("table tbody");
    tableBody.innerHTML = "";

    s3.listObjectsV2({ Bucket: bucketName }, (err, data) => {
        if (err) {
            console.log("Error occurred listing failed ", err.message);
        } else {
            console.log(data.Contents);
            data.Contents.forEach((object)=>{
                var fileRow = document.createElement("tr");
                var fileNameCell = document.createElement("td");
                fileNameCell.textContent = object.Key;
                fileRow.appendChild(fileNameCell);

                var fileSizeCell = document.createElement("td");
                fileSizeCell.textContent = object.Size;
                fileRow.appendChild(fileSizeCell);

                var downloadCell = document.createElement("td");
                var downloadLink = document.createElement("a");
                downloadLink.href = s3.getSignedUrl("getObject",{
                    Bucket:bucketName,
                    Key:object.Key,
                    Expires: 60,
                });
                downloadLink.textContent="Download"
                downloadCell.appendChild(downloadLink)
                fileRow.appendChild(downloadCell)

                var deleteCell = document.createElement("td");
                var deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click",()=>{
                    deleteFile(bucketName,object.Key);
                })
                deleteCell.appendChild(deleteButton)
                fileRow.appendChild(deleteCell)

                tableBody.appendChild(fileRow)

            })
        }
    });
}

function deleteFile(bucketName,key){
    var params = {
        Bucket : bucketName,
        Key : key
    }
    s3.deleteObject(params,(err,data)=>{
        console.log("delete succesfulll");
        refreshFileList(your-bucket-name);
    })
}

function upload(bucketName){
    let files = document.getElementById("fileInput").files

    var fileCount = files.length;

    for(var i=0;i<fileCount;i++){
        var file = files[i]
        var params = {
            Bucket:bucketName,
            Key:file.name,
            Body:file
        }
        s3.upload(params,(err,data)=>{
            console.log("File uploaded");
            refreshFileList(your-bucket-name)
        })
    }
}

refreshFileList(your-bucket-name);
