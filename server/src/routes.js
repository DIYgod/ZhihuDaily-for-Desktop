import {
    Index,
    Story
} from './controllers';

export default {
    '/': Index,
    '/story/:storyId': Story
};
