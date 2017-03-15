# myblog

一个学习N-blog的博客，用nodejs+express实现了登录注册，发表文章，留言，评论，统计PV，页面权限管理，测试等一系列的操作,使用Mlab网站上的Mongodb做数据库

开发环境配置:

linux,node v6.9.1,pm2,git,npm


```
yum install git 
yum install nodejs
yum install npm
npm i npm -g #升级npm
npm i pm2 -g #安装pm2
npm i n -g #安装n
n v6.9.1 #安装nodejsv6.9.1
n use 6.9.1
```

操作运行：
```
git clone https://github.com/VampireKnigh/myblog.git
cd myblog
npm i
npm start 
pm2logs

```

即可部署到云服务器上运行
