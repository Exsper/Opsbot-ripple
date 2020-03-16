# Opsbot-ripple
koishi based qq-bot plugin for ripple based osu! server

不知道为什么UserInfo不复制一份就会出错

## install
```sh
npm install Exsper/Opsbot-ripple
```

## usage
```javascript
app.plugin(require('opsbot-ripple'), options);
```
or
```javascript
module.exports = {
    plugins: [
        ['opsbot-ripple', options],
    ],
}
```

### options
```javascript
{
    prefix : "$",    // 前缀1，可省略，默认为"$"
    prefix2 : "￥",    // 前缀2，可省略，默认为"￥"
    host : "osu.ppy.sb",    // 私服主机名，可省略，默认为"osu.ppy.sb"
    database : __dirname + "/database.db",    // 如果不存在则会自动生成，，可省略，默认为插件脚本所在目录
    // 或者 database : "./database.db",
}
```