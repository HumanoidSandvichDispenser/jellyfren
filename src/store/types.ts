import { BaseItemDto } from "@jellyfin/client-axios";

export interface RootState {
    currentPlaylist: BaseItemDto[],
    items: { [id: string]: BaseItemDto },
    libraries: BaseItemDto[],
    currentSong: BaseItemDto,
    isPlaying: boolean,
    audio?: HTMLAudioElement,
};
