#!/usr/bin/env sh

set -e

# 构建
echo '开始构建项目...'
yarn build

# cd 到构建输出的目录下 
cd dist

git init
git add -A
git commit -m '重新部署'

# 部署到 https://<USERNAME>.github.io
echo '正在部署到gitee page'
git push -f git@gitee.com:jiuyanlight/jiuyanlight.git master

cd -