#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const search = (dir, obj, callback) => {
    let filesList = [];
    fs.readdir(dir, (err, files) => {
        if (err) {
            throw err;
        }
        if (files.length === 0) {
            callback(null, filesList);
        }
        files.forEach(file => {
            fs.stat(path.join(dir, file), (err, stat) => {
                if (err) {
                    throw err;
                }
                if (check(obj, file, stat)) {
                    filesList.push(path.join(dir, file));
                }
                if (stat && stat.isDirectory()) {
                    search(path.join(dir, file), obj, (err, goodFiles) => {
                        if (err) {
                            throw err;
                        }
                        filesList = filesList.concat(goodFiles);
                        // check if we're done with the last file
                        if (--files.length <= 0) {
                            callback(null, filesList)
                        }
                    })
                }
                // check if we're done with the last file
                else if (--files.length <= 0) {
                    callback(null, filesList)
                }
            });
        });
    });
};

//convert conditions from shell
const splitConditions = (shellArgs) => {
    return shellArgs.slice(2)
        .reduce((prev, curr) => {
            prev[curr.slice(2, curr.search("="))] = curr.slice(curr.search("=") + 1);
            return prev
        }, {});
};
//normalize path to file
const goodPath = (somePath) => {
    return path.resolve(somePath);
};

//get file size
const getFileSize = (stat) => {
    return stat.size
};

//convert file size to Bytes
const sizeConvert = (conditionSize) => {
    switch (conditionSize.slice(conditionSize.length - 1)) {
        case "G":
            return +conditionSize.slice(0, -1) * 1073741824;
            break;
        case "M":
            return +conditionSize.slice(0, -1) * 1048576;
            break;
        case "K":
            return +conditionSize.slice(0, -1) * 1024;
            break;
        default:
            return +conditionSize.slice(0, -1)
    }
};

//check conditions
const check = (obj, file, stat) => {
    if (Object.keys(obj).length > 1) {

        if ("MIN-SIZE" in obj && stat.isFile()) {
            if (getFileSize(stat) < sizeConvert(obj["MIN-SIZE"])) {
                return
            }
        }
        if ("MAX-SIZE" in obj && stat.isFile()) {
            if (getFileSize(stat) > sizeConvert(obj["MAX-SIZE"])) {
                return
            }
        }
        if ("PATTERN" in obj) {
            let pattern = new RegExp(obj["PATTERN"]);
            if (!pattern.test(file)) {
                return
            }
        }
        if ("TYPE" in obj) {
            if (obj["TYPE"] === "F" && !stat.isFile()) {
                return
            }
            if (obj["TYPE"] === "D" && (!stat.isDirectory() || "MAX-SIZE" in obj || "MIN-SIZE" in obj)) {
                return
            }
        }
    }

    return true
};

const conditions = splitConditions(process.argv);
search(goodPath(conditions['DIR']), conditions, (err, filesList) => {
    if (err) throw err;
    if (filesList.length !== 0){
        filesList.forEach((filePath)=>
            console.log(filePath)
        );
    console.log(`\n--- Find ${filesList.length} matching ---`);
    }
    else {
        console.log("No such file or directory")
    }
});
