var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

// 设置模板目录
app.set('views',path.join(__dirname,'views'));
// 设置模板引擎为 ejs
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));
app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new MongoStore({
        url:config.mongodb
    })
}));

app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),// 上传文件目录
    keepExtensions:true//保留后缀
}));
// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});
// 正常请求的日志
app.use(expressWinston.logger({
    transports:[
        new(winston.transports.Console)({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/success.lg'
        })
    ]
}));
routes(app);
// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports:[
        new winston.transports.Console({
            json:true,
            colorize:true
        }),
        new winston.transports.File({
            filename:'logs/error.log'
        })
    ]
}))
//error page
app.use(function(err,req,res,next){
    if(err){
        res.send('error',{
            error:err,
        })
    }
})

if(module.parent){
    module.exports = app;
}else{
    app.listen(config.port,function(){
        console.log(`${pkg.name} listening on port ${config.port}`);
    })
}

