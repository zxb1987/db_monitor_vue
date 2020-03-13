## 项目介绍

> 基于 iview-admin 2.5.0


## 运行

```bush
1. 下载项目源码
git clone https://github.com/gumengkai/db_monitor_vue

2. 修改后端API连接地址
src/config/index.js
baseUrl:
    dev: 测试
    pro: 线上
示例API地址：47.100.119.84:43278

3. 安装依赖包
yarn install

4. 开发环境运行
yarn run dev
```

## DEMO

> 全新数据库监控平台已发布
>
> 测试地址:http://114.116.16.6:9992
>
> 账号：admin 密码：123qwe
>
> 后端：https://github.com/zxb1987/db_monitor.git
>
> 前端：https://github.com/zxb1987/db_monitor_vue.git
>
> 前端开发IDE工具JetBrains WebStorm
>
> 后端开发IDE工具PyCharm


![demo1](src/demo/demo1.jpg)
![demo2](src/demo/demo2.jpg)

## 编译

> dist

```bush
yarn build
```

将dist文件夹部署到nginx即可
