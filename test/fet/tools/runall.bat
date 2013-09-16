@echo off
set t=http://localhost/fet/bin/list.php?cov=true&browser=chrome&batchrun=true
start "" "c:\Program Files\Internet Explorer\iexplore.exe" %t%
start "" "C:\Documents and Settings\shenlixia01\Local Settings\Application Data\Google\Chrome\Application\chrome.exe" %t%
start "" "C:\Program Files\Mozilla Firefox\firefox.exe" %t%
