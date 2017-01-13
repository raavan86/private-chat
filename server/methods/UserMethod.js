var async = require('async');
var UserModel = require('../models/UserModel')
var UserMethods = {
    
    registerUser: function(userData, callback){
        async.waterfall([
            function(nextcb){
                var errMsg = "This is a test error";
                UserModel.count({email: UserModel.email})
                        .exec(function(err, e_count){
                            if(err){
                                nextcb(err);
                            }
                            else if(e_count > 0){
                                errMsg = "email id already exists";
                            }
                            nextcb(null, errMsg);
                        });
            },
            function(errMsg, nextcb){
                if(errMsg != "")
                    nextcb(null, errMsg, null);
                else {
                    var user = new UserModel(userData);
                    user.save(function(err, res){
                        if(err)
                            nextcb(err);
                        else
                            nextcb(null, errMsg, res);
                    })
                }
            }
        ], function(err, errMsg, res){
            
            if(err)
                callback({success: false, message: "Some internal error has occurred", err: err});
            else if (errMsg != "")
                callback({success: false, message: errMsg});
            else
                callback({success: true, message: "user created successfully", data: res});
        });
    },
    
    checkEmail: function(email, callback){
        if(typeof(email) == "undefined")
            callback({success: false, message: "email id not defined"});
        else {
            UserModel.count({email: email}, function(err, e_count){
                //e_count = 1;
                if(e_count == 0)
                    callback({success: true, message: "email id is available"});
                else
                    callback({success: false, message: "email already in use"});
            });
        }
            
    }
}

module.exports = UserMethods;