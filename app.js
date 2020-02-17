
var ws = require('nodejs-websocket');
 
var server = ws.createServer(function(conn) {
 
    conn.on('text', function(str) {
 
        var data = JSON.parse(str);
        console.log(data);
 
        switch (data.type) {
            case 'setname':
                conn.nickname = data.name;
                
                boardcast(JSON.stringify({
                    type: 'serverInformation',
                    message: data.name + ' 加入房间'
                }));
 
                boardcast(JSON.stringify({
                    type: 'chatterList',
                    list: getAllChatter()
                }))
                break;
        
            case 'chat':
                boardcast(JSON.stringify({
                    type: 'chat',
                    name: conn.nickname,
                    message: data.message
                }));
                break;
 
            default:
                break;
        }
    });
 
    conn.on('close', function() {
        boardcast(JSON.stringify({
            type: 'serverInformation',
            message: conn.nickname + ' 离开房间'
        }));
 
        boardcast(JSON.stringify({
            type: 'chatterList',
            list: getAllChatter()
        }))
    });
 
    conn.on('error', function(err) {
        console.log(err);
    });
}).listen(12345);
 
function boardcast(str) {
    server.connections.forEach(function(conn) {
        conn.sendText(str);
    })
}
 
function getAllChatter() {
 
    var chatterArr = [];
 
    server.connections.forEach(function(conn) {
        chatterArr.push({name: conn.nickname});
    })
 
    return JSON.stringify(chatterArr);
}