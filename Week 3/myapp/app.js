var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

let tasks = []

app.post('/todo', (req, res) => {
    for (let i of tasks)
    {
        if (i.name == req.body.name)
        {
            i.todos.push(req.body.task)
            res.json({ message: "Task added!" })
            return
        }
    }
    
    tasks.push({ name: req.body.name, todos: [req.body.task] })
    res.json({ message: "User added!" })
})

app.get('/user/:id', (req, res) => {
    const name = req.params["id"]

    for (let i of tasks)
    {
        if (i.name == name)
        {
            res.json({ name: i.name, todos: i.tasks })
            return
        }
    }

    res.json({ message: "User not found" })
})

app.delete("/user/:id", (req, res) => {
    const name = req.params["id"]

    for (let i = 0; i < tasks.length; i++)
    {
        if (tasks[i].name === name)
        {
            tasks.splice(i, 1)
            res.json({ message: "User deleted" })
            return
        }
    }
    
    res.json({ message: "User not found" })
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
