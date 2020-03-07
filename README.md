# Opsbot-ripple
koishi based qq-bot plugin for ripple based osu! server

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
    host : "osu.ppy.sb"    // 私服主机名，可省略，默认为"osu.ppy.sb"
}
```