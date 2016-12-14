#! /usr/bin/env node

/**
 * Swap node_modules directory between Windows and LXSS (Ubuntu on Windows)
 */
var chalk = require('chalk');
var nopt = require('nopt');

var nswap = require('../index');


function getArgs(){
    var knownArgs = {
        init: [Boolean]
        ,link: [Boolean]
        ,unlink: [Boolean]
        ,list: [Boolean]
    };
    var alias = {
        info: '--list'
    };
    var args = nopt(knownArgs, alias, process.argv, 2);
    
    // console.log('args=', args);
    
    return args;
}



var args = getArgs();

if (args.init){
    nswap.init();
} else if (args.link){
    nswap.link();
} else if (args.unlink){
    nswap.unlink();
} else if (args.list){
    nswap.list();
} else {
    // print help
    console.log(
`
Usage: nswap --command

Where --command is one of:

nswap --info    print info about current node_modules status
nswap --init    move existing node_modules to platform-specific dir
nswap --link    link current platform's directory as node_modules
nswap --unlink  remove node_modules link if it exists
`
);
}

