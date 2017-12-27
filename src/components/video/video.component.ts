import Vue from 'vue';
import Component from 'vue-class-component';
import 'video.js/dist/video-js.css'
import './video.component.scss';

@Component({
    template: require('./video.component.html'),
    computed: {
        player() {
            return this.$refs.videoPlayer.player
        }
    },
    components: {
        VueVideo
    },
    props:['playerOptions']

})

export class VueVideo extends Vue {
    player: any;
    playerOptions: any;
    

    onPlayerPlay(player) {
        // console.log('player play!', player)
    }
    onPlayerPause(player) {
        // console.log('player pause!', player)
    }
    // ...player event

    // or listen state event
    playerStateChanged(playerCurrentState) {
        // console.log('player current update state', playerCurrentState)
    }

    // player is ready
    playerReadied(player) {
        console.log('the player is readied', player)
        // you can use it to do something...
        // player.[methods]
    }
}
