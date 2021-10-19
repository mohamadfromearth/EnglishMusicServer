const multer = require('multer');
const router = require('express').Router();
const songController = require('.././http/controller/songController');
const Auth = require('../http/middleware/Auth');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now()+"-"+file.originalname)
    }
 })
var upload = multer({ storage: storage })

router.post('/createSong',songController.createSong);
router.get('/getSongs/:album',songController.getSong);
router.get('/getAllSong',songController.getAllSong);
router.get('/getTopSongs/:artist',songController.getTopSongs);
router.get('/getSongByPlayLists/:playList',[Auth],songController.getSongByPlayList);
router.get('/getPlaylists',songController.getPlaylists);
router.post('/sendFile',upload.single("sendfile"),songController.sendFile);
router.post('/createArtist',songController.createArtist);
router.get('/getArtist',songController.getArtist);
router.post('/createAlbum',songController.createAlbum);
router.get('/getAlbum/:artist',songController.getAlbums);
router.get('/getMyAlbums',[Auth],songController.getMyAlbums);
router.post('/addAlbum',[Auth],songController.addAlbum)
router.post('/deleteAlbum',[Auth],songController.deleteAlbum);
router.post('/isAlbumFavorite',[Auth],songController.isAlbumFavorite);
router.post("/createSearch",songController.createSearch);
router.get('/getSearch/:search',songController.getSearch);
router.post('/registerUser',songController.registerUser);
router.post('/loginUser',songController.loginUser);
router.post('/addFavorites',[Auth],songController.addFavorite);
router.post('/deleteFavorites',[Auth],songController.deleteFavorite);
router.get('/getFavorites',[Auth],songController.getFavorites);
router.post('/selectArtist',[Auth],songController.selectArtist);
router.get('/getSelectedArtists',[Auth],songController.getSelectedArtist);
router.post('/unSelectArtist',[Auth],songController.unSelectArtist);
router.post('/isFollowed',[Auth],songController.isFollowed);
router.post('/isFavorite',[Auth],songController.isFavorite);
router.get('/getSongByGenre',[Auth],songController.getSongByGenre);
router.post('/createArtistInfo',songController.createArtistInfo);
router.get('/getArtistInfo/:id',songController.getArtistInfo);
router.put('/increaseViewAndPlay',songController.increaseViewAndPlay);
router.post('/createLyric',songController.createLyrics);
router.get('/getLyric/:id',songController.getLyric);
router.post('/addLyric',songController.addLyric);


module.exports = router;