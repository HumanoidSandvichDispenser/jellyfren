import SongInfo from "./song-info";

export default class Song implements SongInfo {
    title: string;
    trackArtist: string;
    album: string;
    albumArtist = "";
    id: string;
    isPlaying = false;

    constructor(
        title = "",
        trackArtist = "",
        album = "",
        albumArtist = "",
        id = ""
    ) {
        this.title = title;
        this.trackArtist = trackArtist;
        this.album = album;
        if (albumArtist == "") {
            this.albumArtist = trackArtist;
        }
        // TODO: id from jellyfin server
        if (id == "") {
            this.id = this.genId(title + album).toString();
        } else {
            this.id = id;
        }
    }

    get artist() {
        if (this.trackArtist != "") {
            return this.trackArtist;
        }
        return this.albumArtist;
    }

    private genId(key: string): number {
        let hash = 0;
        let char;
        for (let i = 0; i < key.length; i++) {
            char = key.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return hash;
    }
}
