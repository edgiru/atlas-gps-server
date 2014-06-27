console.log('controllers add');
var con ={
    newdev: require('./newdev'),
    deldev:require('./deldev'),
    show_track: require('./show_track'),
    newregist: require('./newregist')
}

exports.switch = function(contr, req, res){
     switch (contr){
         case 'newdev':con.newdev.init(req, res);
             break;
         case  'deldev': con.deldev.init(req, res);
             break;
         case 'show_track': con.show_track.init(req, res);
             break;
         case 'newregist': con.newregist.init(req, res);
             break;
         default :
             res.statusCode = 404;
             res.end('err controller');
             break;
     }

}


