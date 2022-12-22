import Song from "../song";
import { BaseItemDto } from "@jellyfin/client-axios";

export interface RootState {
    currentPlaylist: Song[],
    items: { [id: string]: BaseItemDto },
    currentLibrary: BaseItemDto,
};
