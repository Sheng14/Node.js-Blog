class BaseModel { // 街基类/父类负责处理具体数据
    constructor(data, message) {
        if (typeof data === 'string') { // 如果data是参数说明只是传入了一个参数且还是对象，我们只给message即可，不用数据
            this.message = data
            data = null
            message = null // 给了null就不会走下面的分支了
        }
        if (data) {
            this.data = data
        }
        if (message) {
            this.message = message
        }
    }
}

class SuccessModel extends BaseModel { // 继承父类加一个自己的属性（标识正确）
    constructor(data, message) {
        super(data, message)
        this.errno = 0
    }
}

class ErrorModel extends BaseModel { // 继承父类加一个自己的属性（标识错误）
    constructor(data, message) {
        super(data, message)
        this.errno = -1
    }
}

module.exports = {
    ErrorModel,
    SuccessModel
}