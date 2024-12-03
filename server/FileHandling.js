const fs = require('fs');
const archiver = require('archiver');

function createZip(files) {
    return new Promise((resolve, reject) => {
        // Set up a place to save the zip file called 'archive.zip'
        const output = fs.createWriteStream(__dirname + '/archive.zip');
        
        // Set up the zip file with maximum compression
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        // When the zip file is done, log the size and resolve the promise
        output.on('close', function () {
            console.log(archive.pointer() + ' total bytes');
            console.log('Zip file has been created and closed.');
            resolve();
        });

        // If there's an error while making the zip, reject the promise
        archive.on('error', function(err){
            reject(err);
        }); 

        // Connect the zip data to the output file
        archive.pipe(output);

        try {
            // Go through each file object given
            for (const file of files) {
                // Ensure both arrays have the same length
                if (file.file_paths.length !== file.file_names.length) {
                    throw new Error('Mismatch between file paths and file names');
                }

                // Iterate over the indices of the arrays
                for (let i = 0; i < file.file_paths.length; i++) {
                    const path = file.file_paths[i];
                    const name = file.file_names[i];
                    console.log(`Adding file: ${name} from path: ${path}`);
                    const fileStream = fs.createReadStream(path);
                    // Add the file to the zip with its original name
                    archive.append(fileStream, { name: name });
                }
            }

            // Finish the zip file (no more files can be added)
            archive.finalize();
        } catch (error) {
            reject(error);
        }
    });
}

function deleteZip() {
    fs.unlinkSync(__dirname + '/archive.zip');
}

// Export the createZip function
module.exports = { createZip, deleteZip };