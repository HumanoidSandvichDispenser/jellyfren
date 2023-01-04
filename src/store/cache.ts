import {
    BaseItemDto,
    BaseItemDtoQueryResult,
    ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive, ref } from "vue";
import Cacheable from "../cacheable";
import { useJellyfinStore } from "./jellyfin";
import { useSettingsStore } from "./settings";

export const useCacheStore = defineStore("cache", () => {
    const jellyfin = useJellyfinStore();
    const settings = useSettingsStore();

    const albumCache = new Cacheable<BaseItemDto[][]>([]);
    const albumCount = ref(0);

    async function fetchAlbums(
        parentId: string,
        page: number
    ): Promise<BaseItemDto[]> {
        if (!albumCache.isStale) {
            if (albumCache.value[page]) {
                return albumCache.value[page];
            }
        }

        let res = await jellyfin.itemsApi?.getItems({
            userId: jellyfin.userId,
            includeItemTypes: ["MusicAlbum"],
            recursive: true,
            parentId,
            sortBy: ["SortName"],
            albumArtistIds: [],
            limit: settings.itemsPerPage,
            startIndex: page * settings.itemsPerPage,
        });

        let hasCountChanged: boolean = false;
        
        if (res?.data.TotalRecordCount) {
            hasCountChanged = albumCount.value != res.data.TotalRecordCount;
            albumCount.value = res.data.TotalRecordCount;
        }

        if (res?.data.Items) {
            if (hasCountChanged) {
                // clear cache if count has changed
                albumCache.value.length = 0;
            }
            Object.freeze(res);
            albumCache.value[page] = res.data.Items;
            albumCache.updateCacheTime();
            return res.data.Items;
        }

        return Promise.reject();
    }

    const artistsCache = new Cacheable<BaseItemDto[][]>([]);
    const artistCount = ref(0);

    async function fetchArtists(
        parentId: string,
        page: number
    ): Promise<BaseItemDto[]> {
        if (!artistsCache.isStale) {
            if (artistsCache.value) {
                return artistsCache.value[page];
            }
        }

        let res = await jellyfin.artistsApi?.getArtists({
            userId: jellyfin.userId,
            parentId,
        });

        let hasCountChanged = false;

        if (res?.data.TotalRecordCount) {
            hasCountChanged = artistCount.value != res.data.TotalRecordCount;
            artistCount.value = res.data.TotalRecordCount;
        }

        if (res?.data.Items) {
            if (hasCountChanged) {
                artistsCache.value.length = 0;
            }
            Object.freeze(res);
            artistsCache.value[page] = res.data.Items;
            artistsCache.updateCacheTime();
            return res.data.Items;
        }

        return Promise.reject();
    }

    return {
        albumCount,
        fetchAlbums,
        artistCount,
        fetchArtists,
    };
});
