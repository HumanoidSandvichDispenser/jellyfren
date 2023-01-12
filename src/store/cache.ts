import {
    BaseItemDto,
    BaseItemDtoQueryResult,
    ItemsApiGetItemsByUserIdRequest
} from "@jellyfin/client-axios";
import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive, ref, Ref } from "vue";
import Cacheable from "../cacheable";
import { useJellyfinStore } from "./jellyfin";
import { useSettingsStore } from "./settings";

export const useCacheStore = defineStore("cache", () => {
    const jellyfin = useJellyfinStore();
    const settings = useSettingsStore();

    type LibraryCache = Cacheable<BaseItemDto[][]>
    //const albumCache = new Cacheable<Library>([]);
    //const albumCache = new Cacheable<Library>([]);
    const albumCache: { [parentId: string]: LibraryCache } = { };
    const albumCounts: { [albumId: string]: number } = reactive({ });

    async function fetchAlbums(
        parentId: string,
        page: number
    ): Promise<BaseItemDto[]> {
        if (!(parentId in albumCache)) {
            albumCache[parentId] = new Cacheable<BaseItemDto[][]>([]);
            albumCache[parentId].kill();
        }

        const albums = albumCache[parentId];

        if (!albums.isStale) {
            if (albums.value[page]) {
                return albums.value[page];
            }
        }

        let res = await jellyfin.itemsApi?.getItems({
            userId: jellyfin.userId,
            includeItemTypes: ["MusicAlbum"],
            recursive: true,
            parentId,
            sortBy: ["SortName"],
            albumArtistIds: [],
            limit: settings.preferences.itemsPerPage,
            startIndex: page * settings.preferences.itemsPerPage,
        });

        let hasCountChanged: boolean = false;
        
        if (res?.data.TotalRecordCount) {
            hasCountChanged = albumCounts[parentId] !=
                res.data.TotalRecordCount;
            albumCounts[parentId] = res.data.TotalRecordCount;
        }

        if (res?.data.Items) {
            if (hasCountChanged) {
                // clear cache if count has changed
                albums.value.length = 0;
            }
            Object.freeze(res);
            //albumCache.value[page] = res.data.Items;
            //albumCache.updateCacheTime();
            // set the current page to the result
            albums.value[page] = res.data.Items;
            albums.updateCacheTime();
            return res.data.Items;
        }

        return Promise.reject();
    }

    const artistCache: { [parentId: string]: LibraryCache } = { };
    const artistCounts: { [albumId: string]: number } = reactive({ });

    async function fetchArtists(
        parentId: string,
        page: number
    ): Promise<BaseItemDto[]> {
        if (!(parentId in artistCache)) {
            artistCache[parentId] = new Cacheable<BaseItemDto[][]>([]);
            artistCache[parentId].kill();
        }

        let artists = artistCache[parentId];

        if (!artists.isStale) {
            if (artists.value) {
                return artists.value[page];
            }
        }

        let res = await jellyfin.artistsApi?.getArtists({
            userId: jellyfin.userId,
            parentId,
        });

        let hasCountChanged = false;

        if (res?.data.TotalRecordCount) {
            hasCountChanged = artistCounts[parentId] != res.data.TotalRecordCount;
            artistCounts[parentId] = res.data.TotalRecordCount;
        }

        if (res?.data.Items) {
            if (hasCountChanged) {
                artists.value.length = 0;
            }
            Object.freeze(res);
            artists.value[page] = res.data.Items;
            artists.updateCacheTime();
            return res.data.Items;
        }

        return Promise.reject();
    }

    type ItemCache = { [id: string]: Cacheable<BaseItemDto> };
    const itemCache: ItemCache = { };

    async function fetchItem(
        id: string
    ): Promise<BaseItemDto> {
        const ttl = 3600 * 1000;

        async function request() {
            let res = await jellyfin.userLibraryApi?.getItem({
                userId: jellyfin.userId,
                itemId: id
            });

            if (res?.data) {
                Object.freeze(res.data);
                itemCache[id] = new Cacheable<BaseItemDto>(res.data, ttl);
                return res.data;
            }

            return Promise.reject();
        }

        if (id in itemCache) {
            if (itemCache[id].isStale) {
                return request();
            }

            return itemCache[id].value;
        }

        return request();
    }

    return {
        albumCounts,
        fetchAlbums,
        artistCounts,
        fetchArtists,
        fetchItem,
    };
});
