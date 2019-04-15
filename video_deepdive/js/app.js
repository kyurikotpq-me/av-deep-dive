let api = 'http://ws01.worldskills.org/Speed%20Reading%20Videos/';

let videoPlayer = Vue.component('video-player', {
    props: ['videos'],
    template: "#video-player",
    data() {
        return {
            currentVideoIndex: 0,
            currentVideo: {
                name: '',
                duration: '',
            },
            currentTime: 0,
            durationTime: 0,
            isPlaying: false,
            isMute: false,
            canPlay: false,
            playbackRate: 1,
        }
    },
    methods: {
        togglePlay() {
            if (this.canPlay) {
                let video = this.$refs.video;
                this.isPlaying = !this.isPlaying;
                (this.isPlaying) ? video.play() : video.pause();
            }
        },
        canPlayHandle(event) {
            let video = this.$refs.video;
            this.durationTime = video.duration; // in seconds
            this.canPlay = true;
            if (this.isPlaying)
                video.play();
        },
        errorHandle() {
            alert("The video can't be loaded, sorry!");
        },
        updateCT(event) {
            // update the currentTime
            this.currentTime = event.target.currentTime;
        },
        prev() {
            this.currentVideoIndex = (this.currentVideoIndex > 0)
                ? this.currentVideoIndex - 1 : this.videos.length - 1;
            this.updateCurrentVideo();
        },
        next() {
            this.currentVideoIndex = (this.currentVideoIndex < this.videos.length - 1)
                ? this.currentVideoIndex + 1 : 0;
            this.updateCurrentVideo();
        },
        skip(event) {
            // for seeking
            let newX = event.offsetX;

            // if-else in case we're skipping backwards
            // in which 'target' will be audio-progress,
            // not audio-seeker
            let width = (event.target.classList.contains('video-seeker'))
                ? event.target.offsetWidth
                : event.target.parentElement.offsetWidth;

            let percentage = newX / width;
            this.currentTime = percentage * this.durationTime;
            this.$refs.video.currentTime = this.currentTime; // for actual skiping
        },
        fullScreen() {
            let video = this.$refs.video;
            if (!document.fullscreenElement)
                video.requestFullscreen();
            else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    /* Firefox */
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    /* Chrome, Safari and Opera */
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    /* IE/Edge */
                    document.msExitFullscreen();
                }
            }
        },
        toggleMute() {
            this.isMute = !this.isMute;
            this.$refs.video.volume = (this.isMute) ? 0 : 1;
        },
        changePlaybackRate(newRate) {
            this.playbackRate = newRate;
            this.$refs.video.playbackRate = this.playbackRate;
        },
        formatTime(time) {
            let hhmmss = new Date(time * 1000).toISOString().substr(11, 8);
            return (hhmmss.indexOf("00:") === 0) ? hhmmss.substr(3) : hhmmss;
        },
        videoTitle(video) {
            return video.name.split("-")[1];
        },
        changeVideo(index) {
            if (this.currentVideoIndex == index) {
                // already playing: toggle play/pause
                this.togglePlay();
            } else {
                this.currentVideoIndex = index;
                this.updateCurrentVideo();
            }
        },
        updateCurrentVideo() {
            this.currentVideo = this.videos[this.currentVideoIndex];
            this.canPlay = false;
            this.isPlaying = true;
        }

    },
    computed: {
        videoSrc() {
            let video = this.currentVideo;
            let str = video.name.split("-"); // Folder/Title
            return api + str[0] + "/" + str[1] + video.ext;
        },
        timeLeftDisplay() {
            let time = this.durationTime - this.currentTime;
            return this.formatTime(time);
        },
        currentTimeDisplay() {
            return this.formatTime(this.currentTime);
        },
        progress() {
            let width = this.currentTime / this.durationTime * 100;
            return { width: width + '%' };
        }
    },
    mounted() {
        let component = this;
        $(window).on("keypress", function (e) {
            e.preventDefault();
            if (e.key == " ")
                component.togglePlay();
            else if (e.key == 'm')
                component.toggleMute();
            else if (e.key == "f")
                component.fullScreen();
        });

        if (this.videos.length != 0)
            this.currentVideo = this.videos[this.currentVideoIndex];
    }
});


let app = new Vue({
    el: "#app",
    data: {
        videos: [
            {
                name: 'Day 21-Building A Reading Habit Part 1',
                ext: '.bin',
                duration: '9:04'
            },
            {
                name: 'Day 21-Building A Reading Habit Part 2',
                ext: '.bin',
                duration: '9:04'
            },
            {
                name: 'Day 21-Building A Reading Habit Part 3',
                ext: '.bin',
                duration: '9:04'
            },
            {
                name: 'Day 21-Building A Reading Habit Part 4',
                ext: '.mp4',
                duration: '9:04'
            },
        ]
    }
});