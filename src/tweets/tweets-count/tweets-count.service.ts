import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tweet } from '../entities/tweet.entity';
import { Interval } from '@nestjs/schedule';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class TweetsCountService {
    private limit = 10;
    constructor(
        @InjectModel(Tweet)
        private tweetModel: typeof Tweet,
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
      ) {}

    @Interval(5000)
    async countTweets() {
        
        console.log('procurando tweets');
        
        let offset = await this.cacheManager.get<number>('tweet-offset');
        console.log(`offset: ${offset}`);
        offset = offset === undefined ? 0 : offset;

        console.log(`offset: ${offset}`);

        const tweets = await this.tweetModel.findAll({
            offset,
            limit: this.limit,
        });

        console.log(`${tweets.length} encontrados`);
    
        if (tweets.length === this.limit) {
            this.cacheManager.set('tweet-offset', offset + this.limit, 0);
            console.log(`achou mais ${this.limit} tweets`);
        }
    }

}
