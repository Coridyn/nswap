Share your project between Windows and Bash on Windows (also known as Ubuntu on Windows or LXSS) and swap between different `node_module` directories.

If you have a
 

## Installation

```bash
$ npm install -g nswap
```

This will give you a global `nswap` command that you can use in any project directory.


You'll probably want to add `node_modules-win` and `node_modules-lxss` to your `.gitignore` (either local or global).


## USAGE


### --info

print out info about current project directory

```bash
$ nswap --info
"node_modules" is a directory - run "nswap --init"
```

```bash
$ nswap --info
"node_modules" is linked to "node_modules-win"
```

```bash
$ nswap --info
"node_modules" is probably linked to "node_modules-lxss"
```

```bash
$ nswap --info
"node_modules" doesn't exist
```

### --init

rename existing `node_modules` to platform-specific directory (renames to `node_modules-win` or `node_modules-lxss`)

Run this command in a project directory before running `--link`

```bash
$ nswap --init
moving "node_modules" to "node_modules-win"
```


### --link

link the platform-appropriate directory as `node_modules`

In Windows:

```bash
$ nswap --link
activating win32
```

In LXSS:

```bash
$ nswap --link
activating *nix
```

__NOTE:__ This needs to be run from within the environment that needs the link.

e.g. Windows will only link the `node_modules-win` and *nix will only link `node_modules-lxss`.
Because of the way the filesystem works Windows _cannot_ link `node_modules-lxss` -> `node_modules`


### --unlink

remove the `node_modules` link (either Windows junction or *nix symlink).

```bash
$ nswap --unlink
unlinked "node_modules"
```

It won't delete your real `node_modules` directory:

```bash
$ nswap --unlink
"node_modules" already exists as a real directory. Move or delete this to continue.
```

If there is no output then the link didn't exist and nothing was done.


## Cleanup

If you want to 
