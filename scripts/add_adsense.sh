#!/bin/bash

# Google AdSense代码
ADSENSE_CODE='<!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7293351660638119" crossorigin="anonymous"></script>'

# 处理根目录下的HTML文件
for file in *.html; do
  if [ -f "$file" ]; then
    # 检查文件是否已包含AdSense代码
    if ! grep -q "ca-pub-7293351660638119" "$file"; then
      # 在</head>之前插入代码
      sed -i '' -e "/<\/head>/i\\
$ADSENSE_CODE" "$file"
      echo "已添加AdSense代码到 $file"
    else
      echo "$file 已包含AdSense代码"
    fi
  fi
done

# 处理所有语言目录
for dir in */ ; do
  if [ -d "$dir" ] && [ "$dir" != "scripts/" ] && [ "$dir" != ".git/" ] && [ "$dir" != "js/" ] && [ "$dir" != "images/" ] && [ "$dir" != "fonts/" ] && [ "$dir" != "components/" ] && [ "$dir" != ".cursor/" ] && [ "$dir" != "temp_img/" ]; then
    echo "处理目录: $dir"
    for file in "$dir"*.html; do
      if [ -f "$file" ]; then
        # 检查文件是否已包含AdSense代码
        if ! grep -q "ca-pub-7293351660638119" "$file"; then
          # 在</head>之前插入代码
          sed -i '' -e "/<\/head>/i\\
$ADSENSE_CODE" "$file"
          echo "已添加AdSense代码到 $file"
        else
          echo "$file 已包含AdSense代码"
        fi
      fi
    done
  fi
done

echo "完成所有文件的AdSense代码添加" 