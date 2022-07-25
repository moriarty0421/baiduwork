var Main = {
    division:function(x,y){
        if(y === 0){
            throw new Error('除数不可以为 0 哦 亲!');
        }
        return x / y;
    }
}
module.exports = Main;