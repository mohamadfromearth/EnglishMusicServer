const bcrypt = require("bcrypt");
const{artistModel,songModel,albumModel,searchModel,userModel,topSongModel,artistInfoModel,lyricModel} = require('../../model/SongModel');
class SongController {
    async createSong(req, res) {
        let song = new songModel(
            {
                name: req.body.name,
                artist: req.body.artist,
                songUrl: req.body.songUrl,
                genre:req.body.genre,
                duration: req.body.duration,
                album: req.body.album,
                cover: req.body.cover,
                views:req.body.views
            }
        );

        song = await song.save();
        let search = new searchModel({
            name: req.body.name,
            songId:song._id,
            status: req.body.status,
            url: req.body.songUrl,
            imgUrl: req.body.cover,
            duration: req.body.duration,
            artist: req.body.artist
        });
        await search.save();


        res.send(song);
    }
    async getSong(req, res) {
        const album = req.params.album;
        const songList = await songModel.find({"album": album});
        res.send(songList);
    }
    async getSongByGenre(req,res){
        const genre = req.params.genre;
        const songList = await songModel.find({"genre":genre});
        res.send(songList);
    }
    async getAllSong(req, res) {
        const songList = await songModel.find().limit(15);
        res.send(songList);
    }
    async getTopSongs(req,res){
        const artist = req.params.artist
        const topSong = await songModel.find({"artist":artist,"topSong":1})
        res.send(topSong)
    }
    async sendFile(req, res) {
        const url = req.file.path;
        res.send(url);
    }
    async createArtist(req, res) {
        let artist = new artistModel({
            name: req.body.name,
            artistImg: req.body.artistImg
        });
        artist = await artist.save();
        let search = new searchModel({
            name: req.body.name,
            status: req.body.status,
            url: req.body.url,
            imgUrl: req.body.artistImg,
            duration: req.body.duration,
            artist: req.body.artist
        });
         await search.save();
         res.send(artist);
    }
    async getArtist(req, res) {
        const artistList = await artistModel.find()

        res.send(artistList);
    }
    async createAlbum(req, res) {
        let album = new albumModel({
            name: req.body.name,
            artist: req.body.artist,
            imageUrl: req.body.imageUrl,
            released: req.body.released
        });
        album = await album.save();
        res.send(album);

    }
    async increaseViewAndPlay(req,res){
       await songModel.findByIdAndUpdate(req.body.id,{
            $inc:{views:1,plays:1}
        })

       res.send(true);


    }
    async getPlaylists(req,res){
        res.send([{name:"TopHits",imageUrl:"https://i.pinimg.com/564x/75/28/e7/7528e70aef7cf03be7a5fb13a163f476.jpg"},
            {name:"NewSongs",imageUrl: "https://thumbs.dreamstime.com/b/new-music-promotional-emblem-headphones-notes-modern-small-stars-popular-french-songs-commercial-logotype-isolated-112311755.jpg"},
            {name:"FavoriteSongs",imageUrl: "https://image.shutterstock.com/image-vector/favorite-music-icon-grey-headphones-260nw-307611827.jpg"},
            {name:"HipHop",imageUrl:"https://image.freepik.com/free-vector/street-style-colorful-print-with-big-boombox-hip-hop-rap-music-type-fashion-design-print-clothes-t-shirt-bomber-cover-single-sweatshirt-also-sticker-poster-patch-underground-style_185390-409.jpg"}

        ]);
    }
    async getSongByPlayList(req,res){
        const playList = req.params.playList;
        if (playList === "NewSongs"){
            const newSongs = await songModel.find();
            res.send(newSongs);
        }
        if (playList === "TopHits"){
            const topHits = await songModel.find().sort({views:-1}).limit(15);
            res.send(topHits);
        }
        if (playList === "FavoriteSongs"){
            const id = req.body.id;
            const user = await userModel.findById(id);
            const favorites = user.favorites;
            res.send(favorites);
        }


    }
    async getAlbums(req, res) {
        const artist = req.params.artist;
        const albumList = await albumModel.find({"artist": artist});
        res.send(albumList);

    }
    async getMyAlbums(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        const myAlbums = user.favoriteAlbums;
        res.send(myAlbums);
    }
    async addAlbum(req,res){
        const id = req.body.id;
        const albumId = req.body.albumId;
        let user = await userModel.findById(id);
        if (!user) return res.send({message:"login first"});
        const album = {
            _id:albumId,
            name:req.body.name,
            artist:req.body.artist,
            imageUrl:req.body.imageUrl,
            released:req.body.released
        }
        user.favoriteAlbums.push(album);
        await user.save();
        res.send({message:"Successfully added"});

    }
    async deleteAlbum(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        if (!user) return res.send({message:"login first"});
        const albumId = req.body.albumId;
        const foundAlbum = user.favoriteAlbums.id(albumId);
        if (foundAlbum)
            foundAlbum.remove();
        await user.save();
        res.send({message:"Successfully deleted"})
    }
    async isAlbumFavorite(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        const favoriteId = req.body.favoriteId;
        const isFavorite = user.favoriteAlbums.id(favoriteId);
        if (isFavorite) return res.send({isFavorite:true});
        if (!isFavorite) return res.send({isFavorite:false});
    }
    async createSearch(req, res) {
        let search = new searchModel({
            name: req.body.name,
            status: req.body.status,
            url: req.body.url,
            imgUrl: req.body.imgUrl,
            duration: req.body.duration,
            artist: req.body.artist
        });
        search = await search.save();
        res.send(search)
    }
    async getSearch(req, res) {
        const search = req.params.search
        const result = await searchModel.find({'name': new RegExp(search, 'i')});
        res.send(result)

    }
    async registerUser(req, res) {
        let user = await userModel.findOne({name: req.body.name});
        if (user)
            return res.send({message: "A user with this name already exists"});

        user = new userModel({
            name: req.body.name,
            password: req.body.password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user = await user.save();

        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header('x-auth-token', token).send({message: "Welcome " + user.name});

    }
    async loginUser(req, res) {

        let user = await userModel.findOne({name: req.body.name});
        if (!user)
            return res.send({message: 'A user with this name or password does not exists'});

        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result)
            return res.send({message: 'A user with this name or password does not exits'});


        const token = user.generateAuthToken();
        res.header("Access-Control-Expose-headers", "x-auth-token").header('x-auth-token', token).status(200).send({message: 'Welcome ' + user.name});


    }
    async addFavorite(req, res) {
        const id = req.body.id
        const songId = req.body.songId;
        let user = await userModel.findById(id);
        if (!user) return res.send({message:"login first"});
        const song = {
            _id:songId,
            name:req.body.name,
            artist:req.body.artist,
            songUrl:req.body.songUrl,
            duration:req.body.duration,
            album:req.body.album,
            cover:req.body.cover
        }

        user.favorites.push(song);

        user = await user.save();

        res.send({message:"successfully added"});
    }
    async deleteFavorite(req, res) {
        const id = req.body.id;
        const user = await userModel.findById(id);
        if (!user) return res.send("ssss");
        const favoriteId = req.body.favoriteId;

        const foundFavorite = user.favorites.id(favoriteId);
        if (foundFavorite)
            foundFavorite.remove();
        await user.save();

        res.send({message:"successfully deleted"});

    }
    async getFavorites(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        const favorites = user.favorites;

        res.send(favorites);
    }
    async selectArtist(req,res){
        const id = req.body.id;
        const artistId = req.body.artistId;
        let user = await  userModel.findById(id);
        if (!user)  return res.send({message:"login first"});
        const artist = {
            _id:artistId,
            name:req.body.name,
            artistImg:req.body.artistImg
        }
        user.followingArtists.push(artist);
         await user.save();
        res.send({message:"successfully added"});

   }
    async unSelectArtist(req,res){
        const id = req.body.id;
        const artistId = req.body.artistId;
        let user = await userModel.findById(id);
        if (!user) return res.send({message:"login first"});
      const foundArtist =  user.followingArtists.id(artistId)
       if(foundArtist) foundArtist.remove();

      await user.save();
      res.send({message:"successfully deleted"});
   }
   async getSelectedArtist(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        if (!user) return res.send({message:"user does not exist"});
        const artists = user.followingArtists;
        res.send(artists);
   }
   async isFollowed(req,res){
        const id = req.body.id;
        const user = await userModel.findById(id);
        const followId = req.body.followId;
        const isFollowed = user.followingArtists.id(followId);
        if (isFollowed) return res.send({isFavorite:true});
        if (!isFollowed) return res.send({isFavorite:false});
   }
   async isFavorite(req,res){
        const id = req.body.id;
        const user = await  userModel.findById(id);
        const favoriteId = req.body.favoriteId;
      const isFavorite = user.favorites.id(favoriteId)
       if (isFavorite) return res.send({isFavorite:true});
       if (!isFavorite) res.send({isFavorite:false});

    }
    async createArtistInfo(req,res){
        let artistInfo = new artistInfoModel({
            _id:req.body._id,
            info:req.body.info,
            born:req.body.born,
            height:req.body.height
        });
       artistInfo = await artistInfo.save();
       res.send(artistInfo);
    }
    async getArtistInfo(req,res){
        const id = req.params.id;
        const artistInfoList = await artistInfoModel.findById(id);
        res.send(artistInfoList);
    }
    async createLyrics(req,res){
        const data = {
            time:req.body.time,
            perLyric:req.body.perLyric,
            enLyric:req.body.enLyric
        }

      let lyric = new lyricModel({
          _id:req.body.id,
          name:req.body.name,
          lyric:data
      });

     lyric = await lyric.save();

     res.send(lyric);
    }
    async getLyric(req,res){
        const id = req.params.id;
        const song = await lyricModel.findById(id);
        const lyric = song.lyric;
        res.send(lyric);
    }
    async addLyric(req,res){
        const song = await lyricModel.findById(req.body.id);
        const data = {
            time:req.body.time,
            perLyric:req.body.perLyric,
            enLyric:req.body.enLyric
        }
        song.lyric.push(data);
         song.save();
        res.send({message:"successfully added"});

    }
}
module.exports = new SongController();