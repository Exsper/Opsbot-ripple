# Opsbot-ripple
koishi based qq-bot plugin for ripple based osu! server

不知道为什么UserInfo不复制一份就会出错

## install
```sh
npm install Exsper/Opsbot-ripple
```

## usage
```javascript
app.plugin(require('opsbot-ripple'));
```
or
```javascript
module.exports = {
    plugins: [
        ['opsbot-ripple'],
    ],
}
```
### 配置文件
第一次运行，会在插件所在目录的上上层（一般为node_modules文件夹上一层）创建配置文件：   
```sh
opsbot-settings.json
```

#### opsbot-settings.json
```javascript
{
    "admin" : [1],    // 管理员      
    "prefix" : "*",    // 前缀1，可省略，默认为"*"
    "prefix2" : "%",    // 前缀2，可省略，默认为"%"
    "host" : "osu.ppy.sb",    // 私服主机名，可省略，默认为"osu.ppy.sb"
    "database" : "./Opsbot-Ripple-v1.db"    // 如果不存在则会自动生成，可省略，默认在根目录下
}
```