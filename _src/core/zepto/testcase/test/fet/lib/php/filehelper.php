<?php
    //获取两个目录下的相同路径的文件数
    function getSameFile( $src , $test , $path = '' )
    {
        $result = array();
        $as = listFile( $src . $path );
        $ts = listFile( $test . $path );
        $ds = array_intersect( $as , $ts );
        foreach ( $ds as $item ) {
            $si = $src . $path . $item;
            $ti = $test . $path . $item;
            if ( is_dir( $si ) && is_dir( $ti ) ) {
                $result = array_merge( $result , getSameFile( $src , $test , $path . $item . '/' ) );
            } else if ( is_file( $si ) && is_file( $ti ) ) {
                if ( substr( $si , -3 ) == '.js' )
                    array_push( $result , $path . $item );
            }
            else {
                //			print("error : $si");
            }
        }
        return $result;
    }

    function getAllFiles( $filedir , $fileType , $exclude )
    {
        $allfiles = array(); //文件名数组
        if ( is_dir( $filedir ) ) { //判断要遍历的是否是目录
            if ( $dh = opendir( $filedir ) ) { //打开目录并赋值一个目录句柄(directory handle)
                while ( FALSE !== ( $filestring = readdir( $dh ) ) ) { //读取目录中的文件名
                    if ( $filestring != '.' && $filestring != '..' && !preg_match( "/\\.svn$/" , $filestring ) && !preg_match( "/data$/" , $filestring ) && !preg_match( "/tools$/" , $filestring ) && !preg_match( "/ipad$/" , $filestring ) && !preg_match( "/import\\.js$/" , $filestring ) ) { //如果不是.和..(每个目录下都默认有.和..)
                        if ( is_dir( $filedir . $filestring ) ) { //该文件名是一个目录时
                            if ( !$exclude || ( $exclude && !preg_match( "/$exclude/" , $filedir . $filestring ) ) ) {
                                $tempArr = getAllFiles( $filedir . $filestring . '/' , $fileType , $exclude ); //继续遍历该子目录
                                $allfiles = array_merge( $allfiles , $tempArr ); //把临时文件名和临时文件名组合
                            }

                        } else if ( is_file( $filedir . $filestring ) ) {
                            //如果该文件名是一个文件不是目录,直接赋值给文件名数组
                            if ( preg_match( "/$fileType/" , $filedir . $filestring ) ) {
                                $allfiles[ ] = $filedir . $filestring;
//                                                                }
                            }
                        }
                    }
                }
            } else { //打开目录失败
                exit( 'Open the directory failed' );
            }
            closedir( $dh ); //关闭目录句柄
            return $allfiles; //返回文件名数组
        } else { //目录不存在
            echo "$filedir";
            exit( 'The directory does not exist' );
        }

    }

    //获取只在src中存在的文件，防止遗漏用例
    function getSrcOnlyFile( $src , $test , $path = '' )
    {
        $result = array();
        $as = listFile( $src . $path );
        $ts = listFile( $test . $path );
        foreach ( $as as $item ) {
            $si = $src . $path . $item;
            $ti = $test . $path . $item;
            if ( is_dir( $si ) && is_dir( $ti ) ) {
                $result = array_merge( $result , getSrcOnlyFile( $src , $test , $path . $item . '/' ) );
            } else if ( is_file( $si ) && !is_file( $ti ) ) {
                if ( substr( $si , -3 ) == '.js' )
                    array_push( $result , $path . $item );
            }
            else {
                //			print("error : $si");
            }
        }
        return $result;
    }

    function listFile( $dir )
    {
        $as = array();
        if ( $dh = opendir( $dir ) ) {
            while ( ( $file = readdir( $dh ) ) !== false ) {
                if ( substr( basename( $file ) , 0 , 1 ) == '.' )
                    continue;
                array_push( $as , basename( $file ) );
            }
            closedir( $dh );
        }
        return $as;
    }

    /*根据src与title拼串的结果查询是否有这样的css，title是import.js中对应的名称，没有.js后缀*/
    function getCssFile( $src , $title )
    {
        $path = explode( '.' , $title );
        $cssFile = implode( '/' , $path ) . '.css';
        if ( file_exists( $src . $cssFile ) ) {
            print '<link type="text/css" href="' . $src . $cssFile . '" rel=stylesheet> ';
        }
    }

?>