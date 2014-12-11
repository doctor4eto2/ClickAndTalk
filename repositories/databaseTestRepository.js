(function (databaseTestRepository) {

    var mongodb = require("mongodb");
    var mongoUrl = "mongodb://localhost:27017/ClickAndTalk";
    var theDb = null;
    var seedData = [
                    {
                        name : "History", 
                        notes: [
                                    {
                                        note: "Testing history", 
                                        author: "Shawn Wildermuth", 
                                        color : "yellow"
                                    }
                               ]
                    }
                   ];

    var getDb = function (next) {
        if (!theDb) {
            mongodb.MongoClient.connect(mongoUrl, function (err, db) {
                if (err) {
                    next(err, null);
                }
                else {
                    theDb = {
                        db: db,
                        notes: db.collection("notes")
                    };
                    next(null, theDb);
                }
            });
        }
        else {
            next(null, theDb);
        }
    };

    databaseTestRepository.seedNotes = function () {
        return getDb(function (err, db) {
            
            if (err) {
                console.log("Failed to seed database" + err);
            }
            else {
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to seed database" + err)
                    }
                    else {
                        
                        if (count == 0) {
                            console.log("Seeding database");
                            seedData.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                    if (err) {
                                        console.log("Failed to insert data" + err);
                                    }
                                })
                            });
                        }
                    }
                });
            }
        });
    }
    databaseTestRepository.getNotes = function (next) {
        return getDb(function (err, db) {
            
            if (err) {
                console.log("Failed to seed database" + err);
            }
            else {
                db.notes.find().toArray(function (err, results) { 
                    if (err) {
                        next(err, null);
                    }
                    else {
                        next(err, results);
                    }
                });
            }
        });
    }
})(module.exports);
