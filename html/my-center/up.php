<?php

// Test for upload endpoint
// Author: Allex Wang

// Define a destination
$targetFolder = '/html/demo/.tmp'; // Relative to the root

$data = null;
$msg = "";

if (!empty($_FILES)) {

    $tempFile = $_FILES['Filedata']['tmp_name'];
    $fileName = $_FILES['Filedata']['name'];
	$targetPath = $_SERVER['DOCUMENT_ROOT'] . $targetFolder;
	$targetFile = rtrim($targetPath,'/') . '/' . $fileName;

    // Validate the file type
    $fileTypes = array('jpg','jpeg','gif','png'); // File extensions
    $fileParts = pathinfo($_FILES['Filedata']['name']);

    if (in_array($fileParts['extension'], $fileTypes)) {
        move_uploaded_file($tempFile, $targetFile);
        $code = 0;
        $msg = "upload success";
        $url = dirname($_SERVER["REQUEST_URI"])."/$fileName";
        $data = array("id"=>$fileName, "url"=>$url);
    } else {
        $code = 405;
        $msg = 'Invalid file type';
    }
} else {
    $code = 404;
    $msg = 'Invalid file';
}

$result = array(
    "error" => $code,
    "msg" => $msg,
    "data" => $data,"code"=>0
);

echo json_encode($result);
