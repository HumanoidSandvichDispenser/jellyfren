export default class Cacheable<T> {
    value: T;
    cacheTime: number;
    timeToLive: number;

    public constructor(value: T, timeToLive?: number) {
        this.value = value;
        this.cacheTime = new Date().getTime();
        this.timeToLive = timeToLive ?? 300000;
    }

    public get isStale(): boolean {
        return new Date().getTime() > this.cacheTime + this.timeToLive;
    } 

    public updateCacheTime(): void {
        this.cacheTime = new Date().getTime();
    }

    public kill(): void {
        this.cacheTime = 0;
    }
};
