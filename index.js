let fs = require('fs');
let _path = require('path');

var chalk = require('chalk');

let NODE_MODULES = 'node_modules';
let dirs = {
    win32:   'node_modules-win'
    ,_other: 'node_modules-lxss'
};

module.exports = {
    init: function(){
        // move an existing 'node_modules' to named directory.
        let result = stat(NODE_MODULES);
        if (result){
            if (result.isDirectory()){
                
                // move to platform-specific dir
                let patformId = getPlatformId();
                let platformDir = dirs[patformId];
                
                let destStat = stat(platformDir);
                if (destStat){
                    // not ok, destination already exists
                    console.log(`can't move "${chalk.magenta(NODE_MODULES)}" to ${chalk.cyan(platformDir)}" destination already exists - choose one to keep before trying again`);
                    return;
                } else {
                    // move to destination
                    console.log(`moving "${chalk.magenta(NODE_MODULES)}" to "${chalk.cyan(platformDir)}"`);
                    fs.renameSync(NODE_MODULES, platformDir);
                }
                
            } else if (result.isSymbolicLink()){
                
                // not ok, it's already a symlink
                console.log(`"${chalk.magenta(NODE_MODULES)}" is already a symlink`);
                
            } else {
                
                // not ok, don't know what it is
                throw new Error(`"${chalk.magenta(NODE_MODULES)}" already exists and is an unknown type`);
                
            }
        } else {
            // ok, doesn't exist
        }
        
        mkdirIfPossible(dirs.win32);
        mkdirIfPossible(dirs._other);
    }
    
    ,link: function(){
        unlinkIfPossible();
        linkIfPossible();
    }
    
    ,unlink: function(){
        if (unlinkIfPossible()){
            console.log(`unlinked "${chalk.magenta(NODE_MODULES)}"`);
        } else {
            // fail because it's a real file
            console.log(`"${chalk.magenta(NODE_MODULES)}" already exists as a real directory - skipping unlink`);
        }
    }
    
    ,list: function(){
        let result = stat(NODE_MODULES);
        if (result) {
            if (result.isDirectory()) {

                console.log(`"${chalk.magenta(NODE_MODULES)}" is a directory - run "${chalk.green('nswap --init')}"`);

            } else if (result.isSymbolicLink()) {

                // not ok, it's already a symlink
                let realpath = fs.realpathSync(NODE_MODULES);
                let dirname = _path.basename(realpath);
                console.log(`"${chalk.magenta(NODE_MODULES)}" is linked to "${chalk.cyan(dirname)}"`);

            } else {

                // not ok, don't know what it is
                throw new Error(`"${chalk.magenta(NODE_MODULES)}" already exists and is an unknown type`);

            }
        } else if (checkForLinuxLink(NODE_MODULES)){
            console.log(`"${chalk.magenta(NODE_MODULES)}" is probably linked to "${chalk.cyan(dirs._other)}"`);
        } else {
            // ok, doesn't exist
            console.log(`"${chalk.magenta(NODE_MODULES)}" doesn't exist`);
        }
    }
};



/*
if node_modules doesn't exist or is a symlink
*/
function stat(path){
    let result;
    if (fs.existsSync(path)) {
        result = fs.lstatSync(path);
    }
    
    
    return result;
}


// doesn't exist or is a symlink.
function unlinkIfPossible(){
    let result = false;
    
    let statResult = stat(NODE_MODULES);
    let isLink = false;
    if (statResult) {
        if (statResult.isSymbolicLink()) {
            isLink = true;
        }
    } else {
        isLink = checkForLinuxLink(NODE_MODULES);
    }
    
    if (isLink){
        fs.unlinkSync(NODE_MODULES);
        result = true;
    }
    
    return result;
}


// link the named dir to 'node_modules'
function linkIfPossible(){
    let canContinue = true;
    
    let platformId = getPlatformId();
    let sourceDir = dirs[platformId];
    
    let sourceStat = stat(sourceDir);
    if (!sourceStat || !sourceStat.isDirectory()){
        console.log(`"${chalk.cyan(sourceDir)}" does not exist as a directory.`);
        canContinue = false;
    }
    
    let destStat = stat(NODE_MODULES);
    if (destStat){
        console.log(`"${chalk.magenta(NODE_MODULES)}" is a real directory and must be moved or deleted before linking. Run "${chalk.green('nswap --init')}" to setup`);
        canContinue = false;
    }
    
    if (canContinue){
        if (isWindows()) {
            // windows mode
            console.log(`activating ${chalk.green('win32')}`);
            fs.symlinkSync(sourceDir, NODE_MODULES, 'junction');
        } else {
            // unix mode
            console.log(`activating ${chalk.green('*nix')}`);
            fs.symlinkSync(sourceDir, NODE_MODULES);
        }
    }
}


// make a directory if it doesn't already exist
function mkdirIfPossible(dir){
    let created = false;
    
    let statResult = stat(dir);
    if (!statResult){
        fs.mkdir(dir);
        created = true;
    }
    
    return created;
}


function getPlatformId(){
    let id = '_other';
    if (isWindows()){
        id = 'win32';
    }
    
    return id;
}


function isWindows(){
    let platform = process.platform;
    return (platform == 'win32');
}


/**
 * Return true if the file/directory exists in some form.
 * 
 * @param dirName
 * @returns {*|boolean}
 */
function exists(dirName){
    let exists = fs.existsSync(dirName) || checkForLinuxLink(dirName);
    return exists;
}


/**
 * Special detection for a symlink created in LXSS.
 * 
 * Returns `true` if the directory exists but we can't access it because it's a Linux symlink.
 * 
 * @param dirName
 * @returns {boolean}
 */
function checkForLinuxLink(dirName){
    let isLinuxLink = false;
    
    let index = fs.readdirSync('.').indexOf(dirName);
    if (index >= 0){
        // There is a file with that name but it doesn't show as existing.
        isLinuxLink = !fs.existsSync(dirName);
    }
    
    return isLinuxLink;
}
