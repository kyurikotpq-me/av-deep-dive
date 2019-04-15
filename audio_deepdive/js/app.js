// let api = 'http://ws01.worldskills.org/LifeBook%20Audios/';
let api = 'http://ws01.worldskills.org/LifeBook%20Audios/';

let audioPlayer = Vue.component('audio-player', {
    props: ['songs'],
    template: "#audio-player",
    data() {
        return {
            currentSongIndex: 0,
            currentSong: {
                name: '',
                duration: ''
            },
            currentTime: 0,
            durationTime: 0,
            isPlaying: false,
            canPlay: false,
        }
    },
    computed: {
        pauseIcon() {
            return { pauseIcon: this.isPlaying };
        },
        songSrc() {
            return api + this.currentSong.name + ".m4a";
        },
        timeLeft() {
            let timeLeft = this.durationTime - this.currentTime;
            return this.formatTime(timeLeft);
        },
        currentTimeDisplay() {
            // display the currentTime in an elegant way
            let finalString = this.formatTime(this.currentTime);
            return finalString;
        },
        progress() {
            let width = (this.currentTime / this.durationTime) * 100 + "%";
            return { 'width': width };
        },
        thumbnailStyle() {
            // make the BG image appear
            let arr = this.currentSong.name.split("_");
            let coverName = (arr.length > 1) ? arr[1] : arr[0];
            coverName = coverName.replace(/ /g, "%20");
            coverName += "_Audio.jpg";
            let thumbnailSrc = api + coverName;

            return { backgroundImage: 'url(' + thumbnailSrc + ')' };
        }
    },
    methods: {
        togglePlay() {
            if (this.canPlay) {
                let audio = this.$refs.audio;
                this.isPlaying = !this.isPlaying;
                this.isPlaying ? audio.play() : audio.pause();
            }
        },
        canPlayHandle(event) {
            let audio = event.target;

            // update the durationTime in seconds
            this.durationTime = audio.duration;
            this.canPlay = true;

            if (this.isPlaying) {
                this.$refs.audio.play();
            }
        },
        updateCT(event) {
            // update the current time
            this.currentTime = event.target.currentTime;
        },
        showError() {
            // handle audio load error
            alert("The audio has problem loading, sorry!");
        },
        formatTime(time) {
            // thank you GitHub repo:
            // https://github.com/shershen08/vuejs-sound-player/blob/master/src/vueaudio.plugin.js
            let hhmmss = new Date(time * 1000).toISOString().substr(11, 8);
            return (hhmmss.indexOf('00:') === 0) ? hhmmss.substr(3) : hhmmss;
        },
        skip(event) {
            let newTimeX = event.offsetX;

            // if-else in case we're skipping backwards
            // in which 'target' will be audio-progress,
            // not audio-seeker
            let width = (event.target.classList.contains('audio-seeker'))
                ? event.target.offsetWidth
                : event.target.parentElement.offsetWidth;

            let percentage = newTimeX / width;

            this.currentTime = percentage * this.durationTime; // for presentation
            this.$refs.audio.currentTime = this.currentTime; // for actual skiping

            // fastSeek: has precision tradeoff
            // currentTime: no precision tradeoff
            // this.$refs.audio.fastSeek(currentTime); // so this will work too!
        },
        playSongFromList(index) {
            /** CODE NOT YET TESTED */
            if(this.currentSongIndex == index) {
                // already playing, so we should play/pause
                this.togglePlay();
            } else {
                this.currentSongIndex = index;
                this.setCurrentSong();
            }
        },
        previous() {
            this.currentSongIndex = (this.currentSongIndex > 0) ? this.currentSongIndex - 1 : this.songs.length - 1;
            this.setCurrentSong();
        },
        next() {
            this.currentSongIndex = (this.currentSongIndex < this.songs.length - 1) ? this.currentSongIndex + 1 : 0;
            this.setCurrentSong();
        },
        setCurrentSong() {
            this.currentSong = this.songs[this.currentSongIndex];
            this.canPlay = false;
            this.isPlaying = true;
        }
    },
    mounted() {
        if (this.songs.length != 0)
            this.currentSong = this.songs[0];

        let component = this;
        $(window).on("keypress", function (e) {
            e.preventDefault();
            if (e.key == " ") {
                component.togglePlay();
            }
        });
    }
});

let app = new Vue({
    el: '#app',
    data: {
        songs: [
            {
                name: '12_Life Vision',
                duration: "21:53",
            },
            {
                name: 'The Journey Continues',
                duration: "21:53",
            },
        ],
    },
});