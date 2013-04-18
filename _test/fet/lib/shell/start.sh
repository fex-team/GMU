#!/bin/sh
#read DocumentRoot of apache
apachePath=$1
testFolder=$2
echo "DocumentRoot is $1" 
conf=$apachePath"/conf/httpd.conf"
if [ ! -f "$conf" ]; then
    echo "Invalid directory!"
    exit 0
fi
#get the value of DocumentRoot
dr=`grep -E "^DocumentRoot" $conf |sed "s/\s\+/ /g" |cut -d' ' -f2`                       
dr=`echo $dr|sed -e "s/[\"']//g"`


#copy fet code to documentRoot of apache
cp ./fet ${dr/DocumentRoot /}/ -rf

#cp ./fet-webapp $dr/fet  -rf
chmod 777 $conf

#echo `grep -E "mod_rewrite.c" $conf`
cp $conf $apachePath"/conf/httpd.bak1.conf"
if grep -E "mod_rewrite.c\>" $conf &&! grep "RewriteCond \%{REQUEST_URI} \^\/list.php" $conf;then
    echo add rewrite rule into httpd.conf
    add_label=`cat add_label`
    line=`grep -n mod_rewrite.c\> /home/forum/apache/apache_wap/conf/httpd.conf | cut -d ":" -f 1`
    echo "line number of rewrite.c:"$line
    sed "$line a\ \ \ \ $add_label$testFolder\/\n" -i $conf
 #   cp $conf $apachePath"/conf/httpd.bak1.conf
elif ! grep -E "mod_rewrite.c\>" $conf; then
    line=`cat -n $conf|tail -1|cut -f1`
    add_label=`cat add_label`
    #get the total line number of httpd.conf
    line=`cat -n $conf|tail -1|cut -f1`
    sed "$line  a\<IfModule mod_rewrite.c\>\n\ \ \ \ $add_label$testFolder\/\n\<\/IfModule\>" -i $conf
    
fi
