#!/bin/bash

# 查找所有HTML文件
find . -type f -name "*.html" | while read -r file; do
  echo "处理文件: $file"
  
  # 删除AddToAny HTML部分
  # 方法: 使用sed查找AddToAny开始和结束标记，并删除它们之间的所有内容
  sed -i '' '/<!-- AddToAny BEGIN -->/,/<!-- AddToAny END -->/d' "$file"
  
  # 删除AddToAny JavaScript部分
  # 删除包含AddToAny的script标签
  sed -i '' '/AddToAny/,/<\/script>/d' "$file"
  
  # 删除对addtoany.com的引用
  sed -i '' '/addtoany\.com/d' "$file"
  
  # 删除a2a_config相关代码
  sed -i '' '/a2a_config/,/<\/script>/d' "$file"
done

echo "已完成所有文件的处理!" 