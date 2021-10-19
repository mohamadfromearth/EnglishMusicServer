const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");




schemaArtist = new mongoose.Schema({
    name:String,
    artistImg:String,
    plays:Number
});
schemaSelectedArtist = new mongoose.Schema({
    _id:String,
    name:String,
    artistImg:String

});



schemaArtistInfo = new mongoose.Schema({
    _id:String,
    info:String,
    born:String,
    height:Number
});


schemaSong = new mongoose.Schema({
    name:String,
    artist:String,
    songUrl:String,
    genre:String,
    duration:Number,
    album:String,
    cover:String,
    topSong:Number,
    views:Number,
    plays:Number
});

schemaTopSong = new mongoose.Schema({
    _id:String,
    name:String,
    artist:String,
    songUrl:String,
    genre:String,
    duration:String,
    album:String,
    cover:String
})




schemaSongForFavorite = new mongoose.Schema({
    _id:String,
    name:String,
    artist:String,
    songUrl:String,
    duration:Number,
    album:String,
    genre:String,
    cover:String
});



schemaAlbum = new mongoose.Schema({
    name:String,
    artist:String,
    imageUrl:String,
    released:String
});

schemaAlbumForUser = new mongoose.Schema({
    _id:String,
    name:String,
    artist:String,
    imageUrl:String,
    released:String
});

schemaSearch = new mongoose.Schema({
    name:String,
    songId:String,
    status:String,
    url:String,
    imgUrl:String,
    duration:Number,
    artist:String
});


schemaUser = new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},
    favorites:[schemaSongForFavorite],
    followingArtists:[schemaSelectedArtist],
    favoriteAlbums:[schemaAlbumForUser]
});

schemaLyric = new mongoose.Schema({
    time:String,
    perLyric:String,
    enLyric:String
});


schemaSongLyrics = new mongoose.Schema({
    _id:{type:String ,required:true},
    name:{type:String,required:true},
    lyric:[schemaLyric]

    }

);





schemaUser.methods.generateAuthToken = function (){
    const data ={
        _id:this._id
    };
    return jwt.sign(data,'jwtPrivateKey');
}



const artistModel = mongoose.model("artists",schemaArtist);

const songModel = mongoose.model("songs",schemaSong);

const topSongModel = mongoose.model("topSong",schemaTopSong);

const albumModel = mongoose.model("albums",schemaAlbum);

const searchModel = mongoose.model("searchData",schemaSearch);

const userModel = mongoose.model("Users",schemaUser);

const artistInfoModel = mongoose.model("artistInfo",schemaArtistInfo);

const lyricModel = mongoose.model("lyrics",schemaSongLyrics);


module.exports = {artistModel,songModel,albumModel,searchModel,userModel,topSongModel,artistInfoModel,lyricModel};





