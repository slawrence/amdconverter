#! /bin/bash
declare nodeFolder=c:/dev/svn/path/to/node/folder

declare overwrite=false
declare msg="The previous files will be converted. "
while getopts ":O" opt; do
    case $opt in
        O)
            overwrite=true
            ;;
    esac
done

#make sure a ./svn folder is in the directory
if [ "`\ls -a | grep \.svn`" ]; then
    \ls -l | grep -v "/" | awk {'print$10'}
    echo ""
    if $overwrite; then
        msg="Files will be Overwritten!!! "
    fi
    read -p "$msg Are you sure (type yes)? " -r
    if [[ $REPLY =~ ^yes$ ]]
    then
        declare current=`cygpath -w $PWD`
        for f in *
        do
            cd $nodeFolder
            if $overwrite; then
                node convertToAMD.js --overwrite $current/$f
            else
                node convertToAMD.js $current/$f
            fi
            cd - > /dev/null
        done
    fi
else
    echo "No .svn folder found. Exiting"
fi
