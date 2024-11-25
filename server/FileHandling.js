const fs = require('fs');
const archiver = require('archiver');

function createZip(files) {
    // Set up a place to save the zip file called 'archive.zip'
    const output = fs.createWriteStream(__dirname + '/archive.zip');
    
    // Set up the zip file with maximum compression
    const archive = archiver('zip', {
        zlib: { level: 9 }
    });

    // When the zip file is done, log the size and a message
    output.on('close', function () {
        console.log(archive.pointer() + ' total bytes'); // Show the size of the zip file
        console.log('Zip file has been created and closed.');
    });

    // If there's an error while making the zip, throw an error
    archive.on('error', function(err){
        throw err; // Stop and show the error
    }); 

    // Connect the zip data to the output file
    archive.pipe(output);

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
            console.log(`Adding file: ${name} from path: ${path}`); // Log the file name and path
            const fileStream = fs.createReadStream(path);
            // Add the file to the zip with its original name
            archive.append(fileStream, { name: name });
        }
    }

    // Finish the zip file (no more files can be added)
    archive.finalize();
}

// Export the createZip function
module.exports = { createZip };