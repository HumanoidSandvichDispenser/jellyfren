import { BaseItemDto } from "@jellyfin/client-axios";

export default interface PlayerState {
    song: BaseItemDto;
    time: number;
    isPaused: boolean;
    audio: HTMLAudioElement;
}
