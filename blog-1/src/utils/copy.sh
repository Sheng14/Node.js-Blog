#!/bin/sh
cd D:\工作室\VsCode\VsProject\Mooc-NodeBlog\blog-1\logs
cp access.log $(date + %Y-%m-%d).access.log
echo "" > access.log