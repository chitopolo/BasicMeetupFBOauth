var express = require('express'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    sessions = require('./routes/sessions'),
    app = express(),
    Meetup = require('meetup'),
    cors = require('cors'),
    _ = require('underscore');

app.use(bodyParser());          // pull information from html in POST
app.use(methodOverride());      // simulate DELETE and PUT

app.use(express.static('../streetmeet/www'));

app.use(cors());

var mup = new Meetup({
  clientId:"3fss73ueag5e744sp45cmopag2",
  clientSecret:"g31i2o39pbf2qgscie95pkcdod",
  redirectUri:"http://localhost/callback"
});


app.get('/api/meetup/:lat/:long/', function(req, res){
console.log('inside get server');
    var reqLat =  req.params.lat;
    var reqLong = req.params.long;
    if(req.param("token")){
       mup.options.accessToken = req.param("token"); 
    }else{
        console.log('redoing the query');
    }
    
    var result= [];
    //data streaming from Meetup
        // mup.stream("/2/open_events?&sign=true&photo-host=public&zip=94102&page=20", function(stream){
        //   stream
        //     .on("data", function(item){
        //       console.log("got item ", item)
        //       result.push(item);
        //       if(result.length>5){
        //       res.json(_.flatten(result));
        //       stream.destroy()
        //     }
              
        //     }).on("error", function(e) {
        //        console.log("error! " + e)
        //     });
        // });  
    var actualDate = new Date();
    var dateInMs = actualDate.getTime();
    var desiredTime = 1320000
    var oneDay = 86400000; 
    var oneHour = 3600000;
    var twentytwoMins = dateInMs+oneHour;

    meetupQuery  = "/2/open_events?lon="+reqLong.toString()+"&lat="+reqLat.toString()+"&radius=1&time="+dateInMs.toString()+","+twentytwoMins.toString()+"&sign=true&photo-host=public";
    console.log('applying this query: '+ meetupQuery);
    mup.get(meetupQuery, function(err, data){
      if(!err){
      // console.log("got data thru GET: " , JSON.parse(data));
      res.json(JSON.parse(data));

    }else{
        console.log('got err: ', err);
    }
    })

});

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/sessions', sessions.findAll);
app.get('/sessions/:id', sessions.findById);

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
