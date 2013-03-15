#! /bin/bash
declare nodeFolder=c:/dev/svn/path/to/node/folder
declare current=`cygpath -w $PWD`
declare overwrite=false

while getopts ":O" opt; do
    case $opt in
        O)
            shift;
            overwrite=true
            ;;
    esac
done

declare file=$1

if [ "`\ls -a | grep \.svn`" ]; then
    if [ "$file" ]; then
        cd $nodeFolder
        if $overwrite; then
            read -p "Overwriting $file. Are you sure (type yes)? " -r
            if [[ $REPLY =~ ^yes$ ]]
            then
                node convertToAMD.js --overwrite $current/$file
            fi
        else
            node convertToAMD.js $current/$file
        fi
        cd - > /dev/null
    else
        echo "No argument provided"
    fi
else
    echo "No .svn folder found. Exiting"
fi

